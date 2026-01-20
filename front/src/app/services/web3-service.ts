import { Injectable } from '@angular/core';
import { createPublicClient, http, parseAbi } from 'viem';
import { arbitrum } from 'viem/chains';

const POOL_ABI = parseAbi([
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)'
]);

export interface PoolData {
  address: string;
  reserve0: bigint;
  reserve1: bigint;
  token0: string;
  token1: string;
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private client = createPublicClient({
    chain: arbitrum,
    // Включаем batching на уровне транспорта
    transport: http('https://arb-mainnet.g.alchemy.com/v2/TxHI6ptndQEJi3coISt0BcQZdZg1rnWV', {
      batch: true
    })
  });

  /**
   * Массовое получение данных через Multicall (1 запрос вместо 1000)
   */
  async getAllPoolsData(addresses: `0x${string}`[]): Promise<PoolData[]> {
    try {
      const contracts = [];

      // Формируем список вызовов для каждого адреса
      for (const address of addresses) {
        contracts.push({ address, abi: POOL_ABI, functionName: 'getReserves' });
        contracts.push({ address, abi: POOL_ABI, functionName: 'token0' });
        contracts.push({ address, abi: POOL_ABI, functionName: 'token1' });
      }

      // Выполняем ОДИН запрос ко всем контрактам сразу
      const results = await this.client.multicall({
        contracts,
        allowFailure: true // Если один пул не V2, остальные не упадут
      });

      const chunkedData: PoolData[] = [];

      // Разбираем плоский массив результатов обратно по структурам (шаг 3)
      for (let i = 0; i < addresses.length; i++) {
        const offset = i * 3;
        const reserves = results[offset].result as any;
        const t0 = results[offset + 1].result as string;
        const t1 = results[offset + 2].result as string;

        if (reserves && t0 && t1) {
          chunkedData.push({
            address: addresses[i],
            reserve0: reserves[0],
            reserve1: reserves[1],
            token0: t0,
            token1: t1
          });
        }
      }

      return chunkedData;
    } catch (error) {
      console.error('Ошибка Multicall:', error);
      throw error;
    }
  }
}
