import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArbEvals } from '../../entities/ArbEvals';
import { Quotes } from '../../entities/Quotes';

@Injectable()
export class ArbEvalsService {
  constructor(
    @InjectRepository(ArbEvals)
    private readonly evalsRepo: Repository<ArbEvals>,
  ) {}

  // Получить все записи
  async getAll(): Promise<ArbEvals[]> {
    return this.evalsRepo.find();
  }

  // Сохранить новую оценку арбитража
  async saveEvaluation(entity: Partial<ArbEvals>): Promise<ArbEvals> {
    const evalEntity = this.evalsRepo.create(entity);
    return this.evalsRepo.save(evalEntity);
  }

  async saveEvaluations(evals: Partial<ArbEvals>[]) {
    if (!evals.length) return [];

    // upsert по quote_id (чтобы не было дублей)
    await this.evalsRepo
      .createQueryBuilder()
      .insert()
      .into(ArbEvals)
      .values(evals)
      .orUpdate(
        [
          'quote_id',
          'best_buy',
          'best_sell',
          'dex_id_buy',
          'dex_id_sell',
          'gross_quote',
          'gas_cost',
          'net_profit',
          'spread_pct',
          'should_trade',
        ],
        ['quote_id'],
      )
      .execute();

    return evals;
  }

  /**
   * Отдает оценку арбитража по набору последних котировок одного рынка.
   * @param quotes — массив котировок (должен содержать BUY_BASE и SELL_BASE с разных DEX)
   * @param gasCostAtomic — стоимость газа в атомарных единицах QUOTE (строка). По умолчанию "0".
   */
  getArbEvalFromQuotes(
    quotes: Quotes[],
    gasCostAtomic: string = '0',
  ): Partial<ArbEvals> {
    if (!quotes?.length) {
      throw new Error('saveEvaluationFromQuotes: quotes is empty');
    }

    // только валидные ок-котировки
    const okQuotes = quotes.filter((q) => q.ok);
    if (!okQuotes.length) throw new Error('No OK quotes provided');

    // убедимся, что все по одному marketId (на всякий)
    const marketId = okQuotes[0].marketId;
    if (!okQuotes.every((q) => q.marketId === marketId)) {
      throw new Error(
        'Quotes from different marketId are not supported in one evaluation',
      );
    }

    // Разделим на покупки/продажи
    const buys = okQuotes.filter((q) => q.side === 'BUY_BASE'); // сколько QUOTE нужно, чтобы купить 1 BASE
    const sells = okQuotes.filter((q) => q.side === 'SELL_BASE'); // сколько QUOTE получим, продавая 1 BASE

    if (!buys.length || !sells.length) {
      throw new Error('Need at least one BUY_BASE and one SELL_BASE quote');
    }

    // Выбираем лучшую покупку (минимум amountQuote)
    const bestBuy = buys.reduce(
      (min, q) => (BigInt(q.amountQuote) < BigInt(min.amountQuote) ? q : min),
      buys[0],
    );

    // Выбираем лучшую продажу (максимум amountQuote)
    const bestSell = sells.reduce(
      (max, q) => (BigInt(q.amountQuote) > BigInt(max.amountQuote) ? q : max),
      sells[0],
    );

    const bestBuyAmt = BigInt(bestBuy.amountQuote);
    const bestSellAmt = BigInt(bestSell.amountQuote);
    const gasCost = BigInt(gasCostAtomic || '0');

    const gross = bestSellAmt - bestBuyAmt; // валовая прибыль в атомарных единицах QUOTE
    const net = gross - gasCost; // чистая
    const spreadPct =
      bestBuyAmt > 0n
        ? String(
            Number(((bestSellAmt - bestBuyAmt) * 1_000_000n) / bestBuyAmt) /
              1_000_000,
          )
        : '0';

    // Выберем "триггерную" котировку — самую свежую по ts
    const latest = okQuotes.reduce((a, b) => {
      const at = new Date(a.ts as any).getTime();
      const bt = new Date(b.ts as any).getTime();
      return bt > at ? b : a;
    });

    const entity: Partial<ArbEvals> = {
      quoteId: latest.id, // id новой котировки-триггера
      bestBuy: bestBuyAmt.toString(),
      bestSell: bestSellAmt.toString(),
      dexIdBuy: bestBuy.dexId,
      dexIdSell: bestSell.dexId,
      grossQuote: gross.toString(),
      gasCost: gasCost.toString(),
      netProfit: net.toString(),
      spreadPct,
      shouldTrade: net > 0n,
      // created_ts заполняется default now()
    };

    return entity;
  }
}
