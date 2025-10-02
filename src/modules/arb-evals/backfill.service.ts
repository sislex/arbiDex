// src/arb-evals/backfill.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Quotes } from '../../db/entities/Quotes';
import { QuotesService } from '../../db/services/quotes/quotes.service';
import { ArbEvalsService } from '../../db/services/arbEvals/arb-evals.service';
import { ArbEvals } from '../../db/entities/ArbEvals';

@Injectable()
export class ArbEvalsBackfillService {
  private readonly logger = new Logger(ArbEvalsBackfillService.name);

  constructor(
    private readonly ds: DataSource,
    private readonly quotesService: QuotesService,
    private readonly arbEvalsService: ArbEvalsService,
  ) {
    // this.backfillArbEvals({ fromId: '0', untilId: '1000000', batchSize: 2000 });
  }

  /**
   * Бэкфилл оценок по котировкам: идём по quotes батчами (keyset), для каждой котировки
   * берём "срез" последних котировок по её рынку и id, считаем arbEval и сохраняем.
   *
   * @param fromId     - начиная с id (исключая его), по умолчанию '0'
   * @param untilId    - опционально ограничить верхней границей id (включительно)
   * @param batchSize  - размер батча чтения quotes (по умолчанию 1000)
   */
  async backfillArbEvals({
    fromId = '0',
    untilId,
    batchSize = 1,
  }: {
    fromId?: string;
    untilId?: string;
    batchSize?: number;
    concurrency?: number;
  } = {}): Promise<void> {
    let lastId = fromId;

    // бесконечный цикл с выходом, когда записей больше нет
    while (true) {
      // берём только нужные поля (быстро), keyset-пагинация
      const qb = this.ds
        .getRepository(Quotes)
        .createQueryBuilder('q')
        .select(['q.id AS id', 'q.market_id AS "marketId"'])
        .where('q.ok = true')
        .andWhere('q.kind = :kind', { kind: 'EXACT_IN' })
        .andWhere('q.id > :lastId', { lastId })
        .orderBy('q.id', 'ASC')
        .limit(batchSize);

      if (untilId) qb.andWhere('q.id <= :untilId', { untilId });

      const rows: Array<{ id: string; marketId: string }> =
        await qb.getRawMany();

      if (rows.length === 0) {
        this.logger.log(`Done. Last processed id=${lastId}`);
        break;
      }

      // this.logger.log(
      //   `Batch: ${rows[0].id}..${rows[rows.length - 1].id} (${rows.length})`,
      // );

      // Последовательно, по одной записи
      let batch: Partial<ArbEvals>[] = [];

      for (const row of rows) {
        try {
          const quotes =
            await this.quotesService.getLastQuotesByMarketIdAndQuoteId(
              row.marketId,
              row.id,
            );
          const arbEval = this.arbEvalsService.getArbEvalFromQuotes(quotes); // если async — добавь await
          batch.push(arbEval);
          // const arbEvalItem =
          //   await this.arbEvalsService.saveEvaluation(arbEval); // upsert по quote_id
          // console.log(arbEvalItem.id);
        } catch (err) {
          this.logger.warn(
            `Failed for quoteId=${row.id}, market=${row.marketId}: ${String(err)}`,
          );
        }
      }

      // вставляем целым батчем
      if (batch.length) {
        const saved = await this.arbEvalsService.saveEvaluations(batch);
        this.logger.log(`Saved batch of ${saved.length} evaluations`);
        batch = [];
      }

      // обновляем lastId и идём дальше
      lastId = rows[rows.length - 1].id;
    }
  }
}
