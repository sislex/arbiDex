import { Injectable } from '@nestjs/common';
import { PoolDto, UpdatePoolDto, UpdateReservesDto } from '../dtos/pools-dto/pool.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pools } from '../entities/main/entities/Pools';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class PoolsService {
  constructor(
    @InjectRepository(Pools)
    private poolRepository: Repository<Pools>,
    private tokensService: TokensService,
  ) {}

  async create(poolDto: PoolDto) {
    const pool = this.poolRepository.create({
      poolAddress: poolDto.poolAddress,
      fee: poolDto.fee,
      version: poolDto.version,
      chain: { chainId: poolDto.chainId },
      token0: { tokenId: poolDto.token0 },
      token1: { tokenId: poolDto.token1 },
      dex: { dexId: poolDto.dexId },
    });

    return await this.poolRepository.save(pool);
  }

  async findAll() {
    return await this.poolRepository.find({
      relations: {
        chain: true,
        dex: true,
        token0: true,
        token1: true,
      },
      select: {
        poolId: true,
        poolAddress: true,
        reserve0: true,
        reserve1: true,
        version: true,
        fee: true,
        chain: { chainId: true },
        dex: { dexId: true },
        token0: { tokenId: true },
        token1: { tokenId: true },
      },
      order: {
        poolId: 'DESC',
      },
    });
  }


  async findOne(id: number) {
    const item = await this.poolRepository.findOne({
      where: { poolId: id },
      relations: ['token0', 'token1', 'chain', 'dex'],
    });
    if (!item) {
      throw new Error(`Pool with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, poolDto: UpdatePoolDto) {
    const pool = await this.findOne(id);

    pool.poolAddress = poolDto.poolAddress;
    pool.fee = poolDto.fee;
    pool.version = poolDto.version;
    pool.chain = { chainId: poolDto.chainId } as any;
    pool.token0 = { tokenId: poolDto.token0 } as any;
    pool.token1 = { tokenId: poolDto.token1 } as any;
    pool.dex = { dexId: poolDto.dexId } as any;

    return await this.poolRepository.save(pool);
  }

  async updateReserves(reserves: UpdateReservesDto[]) {
    const poolsMap = new Map<string, Pools>();

    const pools = await this.poolRepository.find({
      where: reserves.map(r => ({
        poolAddress: r.address,
        chain: { chainId: r.chainId }
      })),
      relations: ['token0', 'token1', 'chain'],
    });

    pools.forEach(pool => {
      const key = `${pool.poolAddress}-${pool.chain.chainId}`;
      poolsMap.set(key, pool);
    });

    for (const dto of reserves) {
      const key = `${dto.address}-${dto.chainId}`;
      const pool = poolsMap.get(key);

      if (!pool) continue;

      const token0 = await this.tokensService.findOneByAddress(dto.token0, pool.chain.chainId);
      const token1 = await this.tokensService.findOneByAddress(dto.token1, pool.chain.chainId);

      if (!token0 || !token1) continue;

      if (pool.token0.tokenId === token0.tokenId && pool.token1.tokenId === token1.tokenId) {
        pool.reserve0 = dto.reserve0;
        pool.reserve1 = dto.reserve1;
      } else {
        pool.reserve0 = dto.reserve1;
        pool.reserve1 = dto.reserve0;
      }

      pool.reserves_updated_at = new Date();
    }

    const updatedPools = await this.poolRepository.save(Array.from(poolsMap.values()));
    // console.log(`Reserves update completed. Total pools updated: ${updatedPools.length}`);
    return updatedPools;
  }

  async remove(id: number) {
    return await this.poolRepository.delete(id);
  }
}
