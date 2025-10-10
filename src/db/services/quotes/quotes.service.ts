import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotes } from '../../entities/Quotes';

type Side = 'BUY_BASE' | 'SELL_BASE';
type Kind = 'EXACT_IN' | 'EXACT_OUT';

export interface SaveQuoteInput {
  chainId: number; // 42161
  dexId: string; // из DexSwapModel
  marketId: string; // из DexSwapModel
  side: Side; // BUY_BASE | SELL_BASE
  kind: Kind; // если котируем по amountIn — EXACT_IN
  feeTier?: number | null; // для V3
  amountBaseAtomic: bigint; // как пришло из кворера
  amountQuoteAtomic: bigint; // как пришло из кворера
  ok: boolean; // true/false
  errorMessage?: string | null; // текст ошибки, если ok=false
  latencyMs?: number | null; // измерь вокруг вызова
  gasQuoteAtomic?: bigint | null; // если считаешь газ в quote-деноминации
  blockNumber?: number | null; // если доступен
}

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quotes)
    private readonly repo: Repository<Quotes>,
  ) {}

  async save(input: SaveQuoteInput) {
    const row = this.repo.create({
      chainId: input.chainId,
      dexId: input.dexId,
      marketId: input.marketId,
      side: input.side,
      kind: input.kind,
      feeTier: input.feeTier ?? null,
      amountBase: input.amountBaseAtomic.toString(),
      amountQuote: input.amountQuoteAtomic.toString(),
      ok: input.ok,
      errorMessage: input.errorMessage ?? null,
      latencyMs: input.latencyMs ?? null,
      gasQuote: input.gasQuoteAtomic ? input.gasQuoteAtomic.toString() : null,
      blockNumber: input.blockNumber ? input.blockNumber.toString() : null,
      // ts и snapshot_id проставятся дефолтами БД
    });

    return this.repo.save(row);
  }

  /**
   * Батч-вставка котировок одной INSERT-операцией.
   * Возвращает вставленные строки с id/ts/snapshot_id от БД.
   */
  async saveList(input: SaveQuoteInput[]) {
    if (!input?.length) return [];

    const entities = input.map((q) => ({
      chainId: q.chainId,
      dexId: q.dexId, // bigint в БД — строка ок
      marketId: q.marketId,
      side: q.side,
      kind: q.kind,
      feeTier: q.feeTier ?? null,
      amountBase: q.amountBaseAtomic.toString(),
      amountQuote: q.amountQuoteAtomic.toString(),
      ok: q.ok,
      errorMessage: q.errorMessage ?? null,
      latencyMs: q.latencyMs ?? null,
      gasQuote: q.gasQuoteAtomic != null ? q.gasQuoteAtomic.toString() : null,
      blockNumber: q.blockNumber != null ? q.blockNumber.toString() : null,
      // ts и snapshot_id проставятся дефолтами БД
    }));

    return this.repo.save(entities, { chunk: 100 });
  }

  async getLastQuotesByMarketId(marketId: string) {
    return this.repo
      .createQueryBuilder('q')
      .select([
        'q.id AS id',
        'q.snapshot_id AS "snapshotId"',
        'q.ts AS ts',
        'q.chain_id AS "chainId"',
        'q.dex_id AS "dexId"',
        'q.market_id AS "marketId"',
        'q.side AS side',
        'q.kind AS kind',
        'q.fee_tier AS "feeTier"',
        'q.amount_base AS "amountBase"',
        'q.amount_quote AS "amountQuote"',
        'q.ok AS ok',
        'q.error_message AS "errorMessage"',
        'q.latency_ms AS "latencyMs"',
        'q.gas_quote AS "gasQuote"',
        'q.block_number AS "blockNumber"',
      ])
      .where('q.market_id = :marketId', { marketId })
      .andWhere('q.ok = true')
      .distinctOn(['q.dex_id', 'q.side', 'q.kind'])
      .orderBy('q.dex_id')
      .addOrderBy('q.side')
      .addOrderBy('q.kind')
      .addOrderBy('q.ts', 'DESC')
      .getRawMany<Quotes>();
  }

  async getLastQuotesByMarketIdAndQuoteId(marketId: string, quoteId?: string) {
    const qb = this.repo
      .createQueryBuilder('q')
      .select([
        'q.id AS id',
        'q.snapshot_id AS "snapshotId"',
        'q.ts AS ts',
        'q.chain_id AS "chainId"',
        'q.dex_id AS "dexId"',
        'q.market_id AS "marketId"',
        'q.side AS side',
        'q.kind AS kind',
        'q.fee_tier AS "feeTier"',
        'q.amount_base AS "amountBase"',
        'q.amount_quote AS "amountQuote"',
        'q.ok AS ok',
        'q.error_message AS "errorMessage"',
        'q.latency_ms AS "latencyMs"',
        'q.gas_quote AS "gasQuote"',
        'q.block_number AS "blockNumber"',
      ])
      .where('q.market_id = :marketId', { marketId })
      .andWhere('q.ok = true');

    if (quoteId && quoteId !== '') {
      qb.andWhere('q.id <= :quoteId', { quoteId });
    }

    return qb
      .distinctOn(['q.dex_id', 'q.side', 'q.kind'])
      .orderBy('q.dex_id')
      .addOrderBy('q.side')
      .addOrderBy('q.kind')
      .addOrderBy('q.ts', 'DESC')
      .getRawMany<Quotes>();
  }
}
