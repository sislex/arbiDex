// src/services/dex-provider.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { concat, ethers, toBeHex } from 'ethers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Dexes } from '../../db/entities/Dexes';
import { Tokens } from '../../db/entities/Tokens';
import { Markets } from '../../db/entities/Markets';

export interface IDexQuotes {
  amountInWeth: string;
  uniSellWethForUsdcBest: IAmountAndFeeResult | null;
  uniBuyWethForUsdcBest: IAmountAndFeeResult | null;
  sushiSellWethForUsdc: IAmountAndFeeResult | null;
  sushiBuyWethForUsdc: IAmountAndFeeResult | null;
}

const UNI_V3_QUOTER_ABI = [
  'function quoteExactInput(bytes path, uint256 amountIn) view returns (uint256 amountOut, uint160, uint32, uint256)',
  'function quoteExactOutput(bytes path, uint256 amountOut) view returns (uint256 amountIn, uint160, uint32, uint256)',
  'function quoteExactOutputSingle(address tokenIn,address tokenOut,uint24 fee,uint256 amountOut,uint160 sqrtPriceLimitX96) view returns (uint256 amountIn, uint160, uint32, uint256)',
];
const UNI_V3_FACTORY_ABI = [
  'function getPool(address,address,uint24) external view returns (address)',
];
const SUSHI_V2_ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory)',
  'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory)',
];

// вспомогалка для exact-output: ПУТЬ ОБРАТНЫЙ!
function buildPathForExactOutput(
  tokenIn: string,
  tokenOut: string,
  fee: number,
): string {
  // exact-output path = tokenOut -> fee -> tokenIn
  const feeHex3 = toBeHex(fee, 3);
  return concat([tokenOut, feeHex3, tokenIn]);
}

export interface IAmountAndFeeResult {
  amount: bigint;
  fee: 500 | 3000 | 10000 | null;
}

function buildPath(tokenIn: string, tokenOut: string, fee: number): string {
  // fee кодируем строго в 3 байта
  const feeHex3 = toBeHex(fee, 3);
  return concat([tokenIn, feeHex3, tokenOut]); // concat = hexConcat
}

const FEES = [500, 3000, 10000] as const;

@Injectable()
export class DexProviderService {
  private readonly log = new Logger(DexProviderService.name);
  readonly provider: ethers.JsonRpcProvider;
  readonly quoter: ethers.Contract;
  readonly factory: ethers.Contract;
  readonly sushi: ethers.Contract;
  base: string;
  quote: string;

  constructor(
    private cfg: ConfigService,
    @InjectRepository(Dexes) private dexRepo: Repository<Dexes>,
    @InjectRepository(Tokens) private tokenRepo: Repository<Tokens>,
    @InjectRepository(Markets) private marketRepo: Repository<Markets>,
  ) {
    this.provider = new ethers.JsonRpcProvider(
      this.cfg.get<string>('RPC_URL'),
      { chainId: 42161, name: 'arbitrum' },
    );
    this.quoter = new ethers.Contract(
      this.cfg.get<string>('UNISWAP_V3_QUOTER')!,
      UNI_V3_QUOTER_ABI,
      this.provider,
    );

    this.factory = new ethers.Contract(
      this.cfg.get<string>('UNISWAP_V3_FACTORY')!,
      UNI_V3_FACTORY_ABI,
      this.provider,
    );
    this.sushi = new ethers.Contract(
      this.cfg.get<string>('SUSHISWAP_V2_ROUTER')!,
      SUSHI_V2_ROUTER_ABI,
      this.provider,
    );
    this.base = this.cfg.get<string>('BASE_TOKEN')!;
    this.quote = this.cfg.get<string>('QUOTE_TOKEN')!;
  }

  /** Лучший вывод USDC для amountIn WETH по UniV3 (перебор fee-тиеров) */
  async uniSellWethForUsdcBest(
    amountInWeth: string,
  ): Promise<IAmountAndFeeResult | null> {
    const amountInWei = ethers.parseEther(amountInWeth);

    let bestFee: 500 | 3000 | 10000 | null = null;
    let bestAmount: bigint = 0n;

    for (const fee of FEES) {
      const poolAddr: string = await this.factory.getPool(
        this.base,
        this.quote,
        fee,
      );
      if (poolAddr === ethers.ZeroAddress) continue;

      try {
        const path = buildPath(this.base, this.quote, fee);
        const [amount] = await this.quoter.quoteExactInput(path, amountInWei);
        if (amount > bestAmount) {
          bestAmount = amount;
          bestFee = fee;
        }
      } catch (e) {
        this.log.debug(`quoteExactInput reverted fee=${fee}`, e);
      }
    }

    return bestFee ? { fee: bestFee, amount: bestAmount } : null;
  }

  /** Сколько USDC нужно на Uni V3, чтобы КУПИТЬ ровно amountOutWeth WETH (перебор fee-тиеров) */
  async uniBuyWethForUsdcBest(
    amountOutWeth: string,
  ): Promise<IAmountAndFeeResult | null> {
    const amountOutWei = ethers.parseEther(amountOutWeth); // хотим РОВНО столько WETH
    let best: IAmountAndFeeResult | null = null;

    for (const fee of FEES) {
      // проверим, что пул существует
      const poolAddr: string = await this.factory.getPool(
        this.quote,
        this.base,
        fee,
      );
      if (poolAddr === ethers.ZeroAddress) continue;

      try {
        // строим path для exact-output: WETH -> fee -> USDC (обратный!)
        const path = buildPathForExactOutput(this.quote, this.base, fee);
        // ВАЖНО: order = tokenOut(=WETH),fee,tokenIn(=USDC)
        const [amountIn] = await this.quoter.quoteExactOutput.staticCall(
          path,
          amountOutWei,
        );
        if (amountIn > 0n && (!best || amountIn < best.amount)) {
          best = { fee: fee, amount: amountIn };
        }
      } catch (e) {
        this.log.debug(
          `quoteExactOutput reverted fee=${fee}, outWETH=${amountOutWei}`,
          e,
        );
      }
    }
    return best;
  }

  /** Сколько USDC даст Sushi за amountIn WETH */
  async sushiSellWethForUsdc(
    amountInWeth: string,
  ): Promise<IAmountAndFeeResult | null> {
    try {
      const wei = ethers.parseEther(amountInWeth);
      const path = [this.base, this.quote];
      const amounts: bigint[] = await this.sushi.getAmountsOut(wei, path);
      const amount: bigint = amounts.at(-1) as bigint;

      return { fee: 3000, amount }; // у Sushiswap фиксированный fee 0.3%
    } catch (e) {
      this.log.debug('Sushi getAmountsOut reverted');
      return null;
    }
  }

  /** Сколько USDC нужно внести на Sushi, чтобы КУПИТЬ ровно amountOutWeth WETH */
  async sushiBuyWethForUsdc(
    amountOutWeth: string, // например "0.5"
  ): Promise<IAmountAndFeeResult | null> {
    try {
      const outWeth = ethers.parseEther(amountOutWeth); // 18 знаков
      const path = [this.quote, this.base]; // [USDC, WETH]
      // amountsIn = [amountInUSDC, amountOutWETH] для пути из 2 токенов
      const amounts: bigint[] = await this.sushi.getAmountsIn(outWeth, path);
      const amount = amounts[0]; // 6 знаков у USDC
      return { fee: 3000, amount };
    } catch (e) {
      this.log.debug('Sushi getAmountsIn reverted', e);
      return null;
    }
  }

  async getWethUsdcQuotes(amountInWeth: string): Promise<IDexQuotes> {
    const [
      uniSellWethForUsdcBest,
      uniBuyWethForUsdcBest,
      sushiSellWethForUsdc,
      sushiBuyWethForUsdc,
    ] = await Promise.all([
      this.uniSellWethForUsdcBest(amountInWeth),
      this.uniBuyWethForUsdcBest(amountInWeth),
      this.sushiSellWethForUsdc(amountInWeth),
      this.sushiBuyWethForUsdc(amountInWeth),
    ]);

    return {
      amountInWeth,
      uniSellWethForUsdcBest,
      uniBuyWethForUsdcBest,
      sushiSellWethForUsdc,
      sushiBuyWethForUsdc,
    };
  }
}
