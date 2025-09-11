import { Injectable } from '@nestjs/common';
import { IDexQuotes } from '../dex-provider/dex-provider.service';
import { ethers } from 'ethers';

export type ArbDirection =
  | 'UNI_BUY__SUSHI_SELL'
  | 'SUSHI_BUY__UNI_SELL'
  | 'NO_TRADE';

export interface ArbDecision {
  shouldTrade: boolean;
  direction: ArbDirection;
  netUSDC: bigint; // чистая прибыль (min)
  grossUSDC: bigint; // валовая (min)
  gasUSDC: bigint; // (min)
  minProfitUSDC: bigint; // (min)
  // Новое:
  grossPctBps: bigint; // валовая доходность в бипсах (1% = 100 bps)
  netPctBps: bigint; // чистая доходность в бипсах
  grossPctStr: string; // например "1.072%"
  netPctStr: string; // например "0.981%"
  amountInWeth: string;
  amountInUsdc: bigint; // 💰 в минималках USDC
  amountInUsdcStr: string; // 💰 человекопонятный вид
  legs?: {
    buy: {
      dex: 'UNI' | 'SUSHI';
      costUSDC: bigint;
      fee: 500 | 3000 | 10000 | null;
    };
    sell: {
      dex: 'UNI' | 'SUSHI';
      proceedsUSDC: bigint;
      fee: 500 | 3000 | 10000 | null;
    };
  };
}

function formatUsdc(amount: bigint): string {
  return Number(ethers.formatUnits(amount, 6)).toFixed(2); // 2 знака после запятой
}

function toPctStrFromBps(bps: bigint): string {
  const neg = bps < 0n;
  const abs = neg ? -bps : bps; // берём модуль
  const whole = abs / 100n; // целые проценты
  const frac = (abs % 100n).toString().padStart(2, '0'); // сотые
  return `${neg ? '-' : ''}${whole}.${frac}%`;
}

function pctBps(numerator: bigint, denominator: bigint): bigint {
  // (numerator / denominator) * 100% в бипсах
  if (denominator <= 0n) return 0n;
  return (numerator * 10_000n) / denominator; // целочисленное деление (сечёт вниз по модулю)
}

@Injectable()
export class OpportunityService {
  /** Возвращает лучший DEX для продажи WETH->USDC на указанном объёме */
  evaluateArbitrage(q: IDexQuotes): ArbDecision {
    const gasUSDC = ethers.parseUnits(process.env.GAS_USD ?? '0.02', 6);
    const minProfitUSDC = ethers.parseUnits(
      process.env.MIN_ABS_PROFIT_USD ?? '0.01',
      6,
    );

    // Ветка A: UNI buy (cost) -> SUSHI sell (proceeds)
    const canA = q.uniBuyWethForUsdcBest && q.sushiSellWethForUsdc;
    const aCost = canA ? q.uniBuyWethForUsdcBest!.amount : 0n;
    const aProceeds = canA ? q.sushiSellWethForUsdc!.amount : 0n;
    const aGross = aProceeds - aCost;
    const aNet = aGross - gasUSDC;

    // Ветка B: SUSHI buy (cost) -> UNI sell (proceeds)
    const canB = q.sushiBuyWethForUsdc && q.uniSellWethForUsdcBest;
    const bCost = canB ? q.sushiBuyWethForUsdc!.amount : 0n;
    const bProceeds = canB ? q.uniSellWethForUsdcBest!.amount : 0n;
    const bGross = bProceeds - bCost;
    const bNet = bGross - gasUSDC;

    // Выбираем лучшую ветку по NET
    let direction: ArbDirection = 'NO_TRADE';
    let netUSDC = 0n,
      grossUSDC = 0n,
      costUSDC = 0n;
    let legs: ArbDecision['legs'] | undefined;

    if (canA && canB) {
      if (aNet >= bNet) {
        direction = 'UNI_BUY__SUSHI_SELL';
        netUSDC = aNet;
        grossUSDC = aGross;
        costUSDC = aCost;
        legs = {
          buy: {
            dex: 'UNI',
            costUSDC: aCost,
            fee: q.uniBuyWethForUsdcBest!.fee,
          },
          sell: {
            dex: 'SUSHI',
            proceedsUSDC: aProceeds,
            fee: q.sushiSellWethForUsdc!.fee,
          },
        };
      } else {
        direction = 'SUSHI_BUY__UNI_SELL';
        netUSDC = bNet;
        grossUSDC = bGross;
        costUSDC = bCost;
        legs = {
          buy: {
            dex: 'SUSHI',
            costUSDC: bCost,
            fee: q.sushiBuyWethForUsdc!.fee,
          },
          sell: {
            dex: 'UNI',
            proceedsUSDC: bProceeds,
            fee: q.uniSellWethForUsdcBest!.fee,
          },
        };
      }
    } else if (canA) {
      direction = 'UNI_BUY__SUSHI_SELL';
      netUSDC = aNet;
      grossUSDC = aGross;
      costUSDC = aCost;
      legs = {
        buy: { dex: 'UNI', costUSDC: aCost, fee: q.uniBuyWethForUsdcBest!.fee },
        sell: {
          dex: 'SUSHI',
          proceedsUSDC: aProceeds,
          fee: q.sushiSellWethForUsdc!.fee,
        },
      };
    } else if (canB) {
      direction = 'SUSHI_BUY__UNI_SELL';
      netUSDC = bNet;
      grossUSDC = bGross;
      costUSDC = bCost;
      legs = {
        buy: { dex: 'SUSHI', costUSDC: bCost, fee: q.sushiBuyWethForUsdc!.fee },
        sell: {
          dex: 'UNI',
          proceedsUSDC: bProceeds,
          fee: q.uniSellWethForUsdcBest!.fee,
        },
      };
    }

    // Проценты (от стоимости входа)
    const grossPctBps = pctBps(grossUSDC, costUSDC);
    const netPctBps = pctBps(netUSDC, costUSDC);
    const grossPctStr = toPctStrFromBps(grossPctBps);
    const netPctStr = toPctStrFromBps(netPctBps);

    const shouldTrade = netUSDC >= minProfitUSDC;

    const amountInUsdc = costUSDC;
    const amountInUsdcStr = formatUsdc(costUSDC);

    return {
      shouldTrade: shouldTrade && direction !== 'NO_TRADE',
      direction: shouldTrade ? direction : 'NO_TRADE',
      netUSDC,
      grossUSDC,
      gasUSDC,
      minProfitUSDC,
      grossPctBps,
      netPctBps,
      grossPctStr,
      netPctStr,
      amountInWeth: q.amountInWeth,
      amountInUsdc,
      amountInUsdcStr,
      legs: shouldTrade ? legs : undefined,
    };
  }
}
