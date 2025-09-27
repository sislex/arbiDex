// src/dex-quote/univ3-quote.provider.ts
import { DexQuoteProvider } from './dex-quote.provider';
import { QuoteInput, QuoteResult, FeeTier } from './types';
import { ethers, concat, toBeHex } from 'ethers';

const FEES_DEFAULT: FeeTier[] = [500, 3000, 10000];

const QUOTER_ABI = [
  'function quoteExactInput(bytes path, uint256 amountIn) view returns (uint256 amountOut, uint160, uint32, uint256)',
  'function quoteExactOutput(bytes path, uint256 amountOut) view returns (uint256 amountIn, uint160, uint32, uint256)',
  'function quoteExactOutputSingle(address tokenIn,address tokenOut,uint24 fee,uint256 amountOut,uint160 sqrtPriceLimitX96) view returns (uint256 amountIn, uint160, uint32, uint256)',
];
const FACTORY_ABI = [
  'function getPool(address,address,uint24) external view returns (address)',
];

function buildPath(tokenIn: string, tokenOut: string, fee: number) {
  const feeHex3 = toBeHex(fee, 3);
  return concat([tokenIn, feeHex3, tokenOut]);
}
function buildPathExactOut(tokenIn: string, tokenOut: string, fee: number) {
  // exact-output path = tokenOut -> fee -> tokenIn
  const feeHex3 = toBeHex(fee, 3);
  return concat([tokenOut, feeHex3, tokenIn]);
}

export class UniswapV3QuoteProvider implements DexQuoteProvider {
  readonly name = 'UniswapV3';

  constructor(
    private readonly provider: ethers.JsonRpcProvider,
    private readonly quoterAddr: string,
    private readonly factoryAddr: string,
  ) {}

  private quoter() {
    return new ethers.Contract(this.quoterAddr, QUOTER_ABI, this.provider);
  }
  private factory() {
    return new ethers.Contract(this.factoryAddr, FACTORY_ABI, this.provider);
  }

  async getSellQuote(input: QuoteInput): Promise<QuoteResult> {
    const {
      base,
      quote,
      amountBase,
      baseDecimals,
      candidateFees = FEES_DEFAULT,
    } = input;

    const amountIn = BigInt(amountBase);

    const factory = this.factory();
    const quoter = this.quoter();

    let best: { fee: FeeTier; out: bigint } | null = null;

    const start = Date.now();
    for (const fee of candidateFees) {
      const pool = await factory.getPool(base, quote, fee);
      if (pool === ethers.ZeroAddress) continue;
      try {
        const path = buildPath(base, quote, fee);
        const [amountOut] = await quoter.quoteExactInput(path, amountIn);
        if (amountOut > 0n && (!best || amountOut > best.out))
          best = { fee, out: amountOut };
      } catch {}
    }
    const latencyMs = Date.now() - start;

    const blockNumber = await this.provider.getBlockNumber();

    return best
      ? {
          ok: true,
          dex: this.name,
          side: 'SELL_BASE',
          feeTier: best.fee,
          amountBaseAtomic: amountIn,
          amountQuoteAtomic: best.out,
          blockNumber,
          latencyMs,
        }
      : {
          ok: false,
          dex: this.name,
          side: 'SELL_BASE',
          amountBaseAtomic: amountIn,
          amountQuoteAtomic: 0n,
          err: 'NO_POOL_OR_REVERT',
          blockNumber,
        };
  }

  async getBuyQuote(input: QuoteInput): Promise<QuoteResult> {
    const {
      base,
      quote,
      amountBase,
      baseDecimals,
      candidateFees = FEES_DEFAULT,
    } = input;
    const amountOutBase = BigInt(amountBase);

    const factory = this.factory();
    const quoter = this.quoter();

    let best: { fee: FeeTier; in: bigint } | null = null;

    const start = Date.now();
    for (const fee of candidateFees) {
      const pool = await factory.getPool(quote, base, fee);
      if (pool === ethers.ZeroAddress) continue;
      try {
        const path = buildPathExactOut(quote, base, fee);
        const [amountInQuote] = await quoter.quoteExactOutput(
          path,
          amountOutBase,
        );
        if (amountInQuote > 0n && (!best || amountInQuote < best.in))
          best = { fee, in: amountInQuote };
      } catch {}
    }
    const latencyMs = Date.now() - start;

    const blockNumber = await this.provider.getBlockNumber();

    return best
      ? {
          ok: true,
          dex: this.name,
          side: 'BUY_BASE',
          feeTier: best.fee,
          amountBaseAtomic: amountOutBase,
          amountQuoteAtomic: best.in,
          blockNumber,
          latencyMs,
        }
      : {
          ok: false,
          dex: this.name,
          side: 'BUY_BASE',
          amountBaseAtomic: amountOutBase,
          amountQuoteAtomic: 0n,
          err: 'NO_POOL_OR_REVERT',
          blockNumber,
        };
  }
}
