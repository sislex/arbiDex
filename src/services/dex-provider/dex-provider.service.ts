// src/services/dex-provider.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { concat, ethers, toBeHex } from 'ethers';

const UNI_V3_QUOTER_ABI = [
  'function quoteExactInput(bytes path, uint256 amountIn) view returns (uint256 amountOut, uint160, uint32, uint256)',
];
const UNI_V3_FACTORY_ABI = [
  'function getPool(address,address,uint24) external view returns (address)',
];
const SUSHI_V2_ROUTER_ABI = [
  'function getAmountsOut(uint256,address[]) view returns (uint256[])',
];

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
  readonly base: string;
  readonly quote: string;

  constructor(private cfg: ConfigService) {
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

  // // минимальный ABI пула
  // UNI_V3_POOL_ABI = [
  //   'function liquidity() external view returns (uint128)',
  //   'function slot0() external view returns (uint160 sqrtPriceX96,int24 tick,uint16,uint16,uint16,uint8,bool)',
  // ];
  //
  // async debugPools() {
  //   for (const fee of [500, 3000, 10000] as const) {
  //     const poolAddr: string = await this.factory.getPool(this.base, this.quote, fee);
  //     console.log('fee', fee, 'pool', poolAddr);
  //     if (poolAddr === ethers.ZeroAddress) continue;
  //     const pool = new ethers.Contract(poolAddr, this.UNI_V3_POOL_ABI, this.provider);
  //     try {
  //       const [liq, s0] = await Promise.all([pool.liquidity(), pool.slot0()]);
  //       console.log('  liquidity', liq.toString(), 'slot0.sqrt', s0[0].toString());
  //     } catch (e) {
  //       console.log('  pool read reverted');
  //     }
  //   }
  // }

  /** Лучший вывод USDC для amountIn WETH по UniV3 (перебор fee-тиеров) */
  async uniBestOut(
    amountInWeth: string,
  ): Promise<{ fee: number; out: bigint } | null> {
    const amountInWei = ethers.parseEther(amountInWeth);

    for (const fee of FEES) {
      // 1) проверяем, что пул существует (у тебя он есть по логам)
      const poolAddr: string = await this.factory.getPool(
        this.base,
        this.quote,
        fee,
      );
      if (poolAddr === ethers.ZeroAddress) continue;

      try {
        // 2) квотируем через path (без recipient — QuoterV2 так надёжнее)
        const path = buildPath(this.base, this.quote, fee);
        const [out] = await this.quoter.quoteExactInput(path, amountInWei);
        if (out > 0n) return { fee, out: out as bigint };
      } catch {
        // если конкретный fee ревертит — пробуем следующий
        // (бывает на пустых/малоликвидных пулах под большой объём)
      }
    }
    return null;
  }

  /** Сколько USDC даст Sushi за amountIn WETH */
  async sushiWethToUsdc(
    amountInWeth: string,
  ): Promise<{ fee: number; out: bigint } | null> {
    try {
      const wei = ethers.parseEther(amountInWeth);
      const path = [this.base, this.quote];
      const amounts: bigint[] = await this.sushi.getAmountsOut(wei, path);
      const out: bigint = amounts.at(-1) as bigint;

      return { fee: 3000, out }; // у Sushiswap фиксированный fee 0.3%
    } catch (e) {
      this.log.debug('Sushi getAmountsOut reverted');
      return null;
    }
  }
}
