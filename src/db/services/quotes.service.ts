// src/quotes/quotes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import { Quotes } from '../entities/Quotes';
import { Dexes } from '../entities/Dexes';
import { Markets } from '../entities/Markets';
import { ethers } from 'ethers';
import { IAmountAndFeeResult } from '../../services/dex-provider/dex-provider.service';

@Injectable()
export class QuotesService {
  constructor(
    private readonly ds: DataSource,
    @InjectRepository(Quotes) private readonly quotesRepo: Repository<Quotes>,
    @InjectRepository(Dexes) private readonly dexRepo: Repository<Dexes>,
    @InjectRepository(Markets) private readonly marketsRepo: Repository<Markets>,
  ) {}

  /**
   * Сохраняет 2 строки (SELL_BASE и BUY_BASE) в один snapshot.
   */
  async saveUniSnapshot(params: {
    chainId: number;
    amountInWeth: string; // "0.5"
    uniSell?: IAmountAndFeeResult | null;
    uniBuy?: IAmountAndFeeResult | null;
  }) {
    const { chainId, amountInWeth, uniSell, uniBuy } = params;

    const [uni, market] = await Promise.all([
      this.dexRepo.findOneByOrFail({ chainId, name: 'UniswapV3' }),
      // подставь свою логику выбора market (например, WETH/USDC)
      this.marketsRepo.findOneByOrFail({ chainId }),
    ]);

    const snapshotId = randomUUID();
    const ts = new Date();
    const amountBaseWei = ethers.parseEther(amountInWeth).toString();

    const sell = this.quotesRepo.create({
      snapshotId: snapshotId,
      ts,
      chainId,
      dexId: uni.dexId,
      marketId: market.marketId,
      side: 'SELL_BASE',
      kind: 'EXACT_IN',
      feeTier: uniSell?.fee ?? null,
      amountBase: amountBaseWei,
      amountQuote: (uniSell?.amount ?? 0n).toString(),
      ok: uniSell != null,
    });

    const buy = this.quotesRepo.create({
      snapshotId: snapshotId,
      ts,
      chainId,
      dexId: uni.dexId,
      marketId: market.marketId,
      side: 'BUY_BASE',
      kind: 'EXACT_OUT',
      feeTier: uniBuy?.fee ?? null,
      amountBase: amountBaseWei,
      amountQuote: (uniBuy?.amount ?? 0n).toString(),
      ok: uniBuy != null,
    });

    // Транзакция на случай расширений (газ, блок, latency)
    await this.ds.transaction(async (trx) => {
      await trx.getRepository(Quotes).save([sell, buy]);
    });

    return { snapshotId };
  }
}
