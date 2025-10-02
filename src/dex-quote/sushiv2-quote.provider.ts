import { DexQuoteProvider } from './dex-quote.provider';
import { QuoteInput, QuoteResult } from './types';
import { ethers } from 'ethers';

const ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory)',
  'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory)',
];

export class SushiV2QuoteProvider implements DexQuoteProvider {
  readonly name = 'SushiV2';

  constructor(
    private readonly provider: ethers.JsonRpcProvider,
    private readonly routerAddr: string,
  ) {}

  private router() {
    return new ethers.Contract(this.routerAddr, ROUTER_ABI, this.provider);
  }

  async getSellQuote(input: QuoteInput): Promise<QuoteResult> {
    const { base, quote, amountBase, baseDecimals } = input;
    const amountIn = BigInt(amountBase);

    try {
      const start = Date.now();
      const [, out] = await this.router().getAmountsOut(amountIn, [
        base,
        quote,
      ]);
      const latencyMs = Date.now() - start;
      const blockNumber = await this.provider.getBlockNumber();

      return {
        ok: true,
        dex: this.name,
        side: 'SELL_BASE',
        kind: 'EXACT_IN',
        feeTier: 3000,
        amountBaseAtomic: amountIn,
        amountQuoteAtomic: out as bigint,
        blockNumber,
        latencyMs,
      };
    } catch (e: any) {
      const blockNumber = await this.provider.getBlockNumber();
      return {
        ok: false,
        dex: this.name,
        side: 'SELL_BASE',
        kind: 'EXACT_IN',
        amountBaseAtomic: amountIn,
        amountQuoteAtomic: 0n,
        error: e?.message ?? 'ROUTER_REVERT',
        blockNumber,
      };
    }
  }

  async getBuyQuote(input: QuoteInput): Promise<QuoteResult> {
    const { base, quote, amountBase, baseDecimals } = input;
    const outBase = BigInt(amountBase);
    try {
      const start = Date.now();

      const [inQuote] = await this.router().getAmountsIn(outBase, [
        quote,
        base,
      ]);

      const latencyMs = Date.now() - start;

      const blockNumber = await this.provider.getBlockNumber();

      return {
        ok: true,
        dex: this.name,
        side: 'BUY_BASE',
        kind: 'EXACT_OUT',
        feeTier: 3000,
        amountBaseAtomic: outBase,
        amountQuoteAtomic: inQuote as bigint,
        blockNumber,
        latencyMs,
      };
    } catch (e: any) {
      const blockNumber = await this.provider.getBlockNumber();
      return {
        ok: false,
        dex: this.name,
        side: 'BUY_BASE',
        kind: 'EXACT_OUT',
        amountBaseAtomic: outBase,
        amountQuoteAtomic: 0n,
        error: e?.message ?? 'ROUTER_REVERT',
        blockNumber,
      };
    }
  }
}
