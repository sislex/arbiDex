import { Injectable, Logger } from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';
import { PoolsService } from '../pools/pools.service';
import { CreateTokenDto } from '../dtos/token-dto/token.dto';
import { fetchTokensData, getUniqueTokens } from '../-helpers/getTokensData';
import { Tokens } from '../entities/entities/Tokens';
import { Pools } from '../entities/entities/Pools';
import { getV2PoolsFromFactory } from '../-helpers/getV2PoolsFromFactory';
import { GetV2ReservesHelper } from '../-helpers/getV2Reserves';
import { GetV3ReservesHelper } from '../-helpers/getV3Reserves';
import { UpdateReservesDto } from '../dtos/pools-dto/pool.dto';
import {
  configCreateCamelotV2,
  configCreateCamelotV3,
  configCreateSushiV2,
  configCreateSushiV3,
  configCreateUniswapV2,
  configCreateUniswapV3,
} from './config';
import { getUniswapV3PoolsFromFactory } from '../-helpers/getUniswapV3PoolsFromFactory';
import { getCamelotV3PoolsFromFactory } from '../-helpers/getCamelotV3PoolsFromFactory';

@Injectable()
export class BlockchainService {

  private readonly logger = new Logger(BlockchainService.name);

  constructor(
    private tokensService: TokensService,
    private poolsService: PoolsService,
    private getV2ReservesHelper: GetV2ReservesHelper,
    private getV3ReservesHelper: GetV3ReservesHelper,
  ) {}

  async create() {
    // меняем configData --- вызываемый метод получения pools --- версию получаемых резервов, сервис и его метод
    const configData = configCreateUniswapV2;

    // const pools = await getUniswapV3PoolsFromFactory(configData.factoryAddress, 1, );
    // const pools = await getCamelotV3PoolsFromFactory(configData.factoryAddress, 1,  );
    const pools = await getV2PoolsFromFactory(configData.factoryAddress, 1,  );

    const uniqueTokens = getUniqueTokens(pools);
    console.log('uniqueTokens::::', uniqueTokens);

    const newTokenAddresses = await this.filterNewTokenAddresses(uniqueTokens);
    console.log('newTokenAddresses::::', newTokenAddresses);

    const tokensData = await fetchTokensData(newTokenAddresses);
    console.log('tokensData::::', tokensData);

    const tokensToSave = tokensData.map(t => ({ ...t, chainId: 42161 }));

    await this.saveTokensIfNotExist(tokensToSave);

    const tokenMap = await this.buildTokenMap();

    const existingPools = await this.getExistingPoolsSet();

    await this.createPools(pools, tokenMap, existingPools, configData);

    await this.setReserves()
  }

  async saveTokensIfNotExist(
    tokensData: Array<{
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      chainId: number;
    }>
  ) {
    const savedTokens: Tokens[] = [];

    const cleanString = (str: string | null | undefined, maxLength = 255): string => {
      if (!str) return '';

      return str
        .replace(/\0/g, '')
        .trim()
        .slice(0, maxLength);
    };

    for (const token of tokensData) {
      const dto: CreateTokenDto = {
        address: token.address.toLowerCase(),
        symbol: cleanString(token.symbol, 50),
        tokenName: cleanString(token.name, 255),
        decimals: token.decimals,
        chainId: token.chainId,
      };

      const savedToken = await this.tokensService.create(dto);
      savedTokens.push(savedToken);
    }

    return savedTokens;
  }

  async buildTokenMap(): Promise<Map<string, number>> {
    const tokens = await this.tokensService.findAll();

    return new Map(
      tokens.map(t => [t.address.toLowerCase(), t.tokenId])
    );
  }

  async getExistingPoolsSet(): Promise<Set<string>> {
    const existingPools = await this.poolsService.findAll();
    return new Set(
      existingPools
        .map(p => p.poolAddress)
        .filter((addr): addr is string => !!addr)
        .map(addr => addr.toLowerCase())
    );
  }

  async createPools(
    pools: any[],
    tokenMap: Map<string, number>,
    existingPools: Set<string>,
    config: any
  ) {
    const createdPools: Pools[] = [];

    for (const pool of pools) {
      const poolAddress = pool.pool?.toLowerCase(); // pair/pool для v2/v3
      const token0Address = pool.token0?.toLowerCase();
      const token1Address = pool.token1?.toLowerCase();

      if (!poolAddress || !token0Address || !token1Address) {
        this.logger.warn(`Skipped pool with empty address or tokens: ${JSON.stringify(pool)}`);
        continue;
      }

      if (existingPools.has(poolAddress)) continue;

      const token0Id = tokenMap.get(token0Address);
      const token1Id = tokenMap.get(token1Address);

      if (!token0Id || !token1Id) {
        this.logger.warn(
          `No tokens found for the pool ${poolAddress}: ` +
          `token0=${token0Address} (${token0Id}), ` +
          `token1=${token1Address} (${token1Id})`
        );
        continue;
      }

      const poolDto = {
        token: token0Id,
        token2: token1Id,
        poolAddress,
        fee: pool.fee ?? config.fee,
        version: config.version || null,
        dexId: config.dexId,
        chainId: 42161,
      };

      try {
        const savedPool = await this.poolsService.create(poolDto);
        createdPools.push(savedPool);
      } catch (e) {
        this.logger.error(`Error creating pool ${poolAddress}: ${e.message}`);
      }
    }

    return createdPools;
  }

  async filterNewTokenAddresses(tokenAddresses: string[]): Promise<string[]> {
    const existingTokens = await this.tokensService.findAll();

    const existingAddresses = new Set(
      existingTokens.map(t => t.address.toLowerCase())
    );

    const result: string[] = [];

    for (const addr of tokenAddresses) {
      const normalized = addr.toLowerCase();

      if (!existingAddresses.has(normalized)) {
        result.push(normalized);
      }
    }

    return result;
  }

  async setReserves() {
    const pools = await this.poolsService.findAll();

    const filteredPools = pools.filter(
      pool => (pool.reserve0 === null || pool.reserve1 === null) && pool.version === 'v2'
    );
    const reserves: UpdateReservesDto[] = [];

    for (const pool of filteredPools) {
      try {
        const reserve =
          await this.getV2ReservesHelper.getV2Reserves(
            pool.poolAddress as `0x${string}`
          );

        if (!reserve) continue;

        const dto: UpdateReservesDto = {
          address: reserve.address,
          token: reserve.token0,
          token2: reserve.token1,
          reserve0: reserve.reserve0?.toString() ?? '0',
          reserve1: reserve.reserve1?.toString() ?? '0',
        };

        reserves.push(dto);
      } catch (error) {
        console.error(
          `Error getting reserves for pool ${pool.poolAddress}:`,
          error
        );
      }
    }

    console.log('Reserves received:', reserves);
    await this.poolsService.updateReserves(reserves)
  }

}
