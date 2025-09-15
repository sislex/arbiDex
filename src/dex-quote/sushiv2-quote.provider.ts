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
    const amountIn = ethers.parseUnits(amountBase, baseDecimals);

    try {
      const [, out] = await this.router().getAmountsOut(amountIn, [
        base,
        quote,
      ]);
      return {
        ok: true,
        dex: this.name,
        side: 'SELL_BASE',
        feeTier: 3000,
        amountBaseAtomic: amountIn,
        amountQuoteAtomic: out as bigint,
      };
    } catch (e: any) {
      return {
        ok: false,
        dex: this.name,
        side: 'SELL_BASE',
        amountBaseAtomic: amountIn,
        amountQuoteAtomic: 0n,
        err: e?.message ?? 'ROUTER_REVERT',
      };
    }
  }

  async getBuyQuote(input: QuoteInput): Promise<QuoteResult> {
    const { base, quote, amountBase, baseDecimals } = input;
    const outBase = ethers.parseUnits(amountBase, baseDecimals);
    try {
      const [inQuote] = await this.router().getAmountsIn(outBase, [
        quote,
        base,
      ]);
      return {
        ok: true,
        dex: this.name,
        side: 'BUY_BASE',
        feeTier: 3000,
        amountBaseAtomic: outBase,
        amountQuoteAtomic: inQuote as bigint,
      };
    } catch (e: any) {
      return {
        ok: false,
        dex: this.name,
        side: 'BUY_BASE',
        amountBaseAtomic: outBase,
        amountQuoteAtomic: 0n,
        err: e?.message ?? 'ROUTER_REVERT',
      };
    }
  }
}
