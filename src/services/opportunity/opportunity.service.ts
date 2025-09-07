import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DexProviderService } from '../dex-provider/dex-provider.service';

const USDC_DEC = 1_000_000n;

function toUsd6(n: bigint | null | undefined): number {
  if (n == null) return NaN;
  return Number(n) / 1_000_000; // 6 знаков
}

// правильный расчёт комиссии по tier (500=0.05%, 3000=0.3%, 10000=1%)
function calcFeeUSDC(out: bigint, feeTier: number): bigint {
  return (out * BigInt(feeTier)) / 1_000_000n;
}

// возьми из .env, а пока константа для Arbitrum
const GAS_USD = Number(process.env.GAS_USD ?? 0.02);

function formatUsd6(n: bigint | null | undefined): string {
  if (n == null) return 'n/a';
  const s = n.toString();
  if (s.length <= 6) return '0.' + s.padStart(6, '0');
  return s.slice(0, -6) + '.' + s.slice(-6);
}


@Injectable()
export class OpportunityService {
  private readonly amountInWeth: string;

  constructor(
    private cfg: ConfigService,
    private dex: DexProviderService,
  ) {
    this.amountInWeth = this.cfg.get<string>('AMOUNT_IN_WETH') ?? '0.10';
  }

  /** Возвращает лучший DEX для продажи WETH->USDC на указанном объёме */
  async findOpportunity() {
    const [uni, sushi] = await Promise.all([
      this.dex.uniBestOut(this.amountInWeth),     // { out:bigint, fee:number } | null
      this.dex.sushiWethToUsdc(this.amountInWeth), // сделай объектную версию как для Uni: { out, fee:3000 } | null
    ]);

    // значения (bigint)
    const uniOut  = uni?.out ?? null;
    const sushiOut = sushi?.out ?? null;

    // комиссии (bigint, в минималках USDC)
    const uniFeeUsdc   = uniOut  != null && uni?.fee   != null ? calcFeeUSDC(uniOut,  uni!.fee)   : null;
    const sushiFeeUsdc = sushiOut!= null && sushi?.fee != null ? calcFeeUSDC(sushiOut,sushi!.fee) : null;

    // кто лучше и спред (bigint)
    let better = 'EQUAL';
    let direction = 'NO_TRADE';
    let spreadRaw: bigint | null = null;

    if (uniOut != null && sushiOut != null) {
      if (uniOut > sushiOut) {
        better = `UNISWAP_V3 (fee=${uni!.fee})`;
        direction = 'SELL on Uniswap';
        spreadRaw = uniOut - sushiOut;
      } else if (sushiOut > uniOut) {
        better = `SUSHI_V2 (fee=${sushi!.fee})`;
        direction = 'SELL on Sushi';
        spreadRaw = sushiOut - uniOut;
      }
    } else if (uniOut != null) {
      better = `UNISWAP_V3 (fee=${uni!.fee})`;
      direction = 'SELL on Uniswap';
    } else if (sushiOut != null) {
      better = `SUSHI_V2 (fee=${sushi!.fee})`;
      direction = 'SELL on Sushi';
    }

    // переведём в числа (USD)
    const uniUsd    = toUsd6(uniOut);
    const sushiUsd  = toUsd6(sushiOut);
    const spreadUsd = toUsd6(spreadRaw);
    const uniFeeUSD   = toUsd6(uniFeeUsdc);
    const sushiFeeUSD = toUsd6(sushiFeeUsdc);
    const feesUSD = (isFinite(uniFeeUSD) ? uniFeeUSD : 0) + (isFinite(sushiFeeUSD) ? sushiFeeUSD : 0);

    // база для процентов — mid (устойчивее)
    const midUSD = (isFinite(uniUsd) && isFinite(sushiUsd))
      ? (uniUsd + sushiUsd) / 2
      : (isFinite(uniUsd) ? uniUsd : sushiUsd);

    const grossPct = (isFinite(spreadUsd) && isFinite(midUSD) && midUSD > 0)
      ? (spreadUsd / midUSD) * 100
      : NaN;

    const netUSD = (isFinite(spreadUsd) ? spreadUsd : 0) - feesUSD - GAS_USD;
    const netPct = (isFinite(netUSD) && isFinite(midUSD) && midUSD > 0)
      ? (netUSD / midUSD) * 100
      : NaN;

    return {
      amountInWeth: this.amountInWeth,
      // сырье
      uniOutUSDC: formatUsd6(uniOut),
      sushiOutUSDC: formatUsd6(sushiOut),
      uniFee: uni?.fee ?? null,
      sushiFee: sushi?.fee ?? null,
      uniFeeUSDC: isFinite(uniFeeUSD) ? uniFeeUSD.toFixed(6) : 'n/a',
      sushiFeeUSDC: isFinite(sushiFeeUSD) ? sushiFeeUSD.toFixed(6) : 'n/a',
      // спред/направление
      better,
      direction,
      spreadUSDC: isFinite(spreadUsd) ? spreadUsd.toFixed(6) : 'n/a',
      // итог
      gasUSD: GAS_USD.toFixed(6),
      netUSD: isFinite(netUSD) ? netUSD.toFixed(6) : 'n/a',
      grossPct: isFinite(grossPct) ? grossPct.toFixed(3) + '%' : 'n/a',
      netPct: isFinite(netPct) ? netPct.toFixed(3) + '%' : 'n/a',
    };
  }



}
