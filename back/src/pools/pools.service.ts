import { Injectable } from '@nestjs/common';
import { PoolDto } from '../dtos/pools-dto/pool.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pools } from '../entities/entities/Pools';
import { TokensService } from '../tokens/tokens.service';
import { ChainsService } from '../chains/chains.service';
import { DexesService } from '../dexes/dexes.service';

@Injectable()
export class PoolsService {
  constructor(
    @InjectRepository(Pools)
    private poolRepository: Repository<Pools>,
    private tokensService: TokensService,
    private chainsService: ChainsService,
    private dexesService: DexesService,
  ) {}

  async create(poolDto: PoolDto) {
    const chain = await this.chainsService.findOne(poolDto.chainId);
    const token = await this.tokensService.findOne(poolDto.token);
    const token2 = await this.tokensService.findOne(poolDto.token2);
    const dex = await this.dexesService.findOne(poolDto.dexId);

    const market = this.poolRepository.create({
      chain,
      token,
      token2,
      dex,
      version: poolDto.version,
      fee: poolDto.fee,
      poolAddress: poolDto.poolAddress,
    });

    return await this.poolRepository.save(market);
  }

  async findAll() {
    return await this.poolRepository.find({
      relations: ['chain', 'token', 'token2', 'dex'],
      order: {
        poolId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const item = await this.poolRepository.findOne({
      where: { poolId: id },
      relations: ['token', 'token2', 'chain', 'dex'],
    });
    if (!item) {
      throw new Error(`Pool with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, poolDto: PoolDto) {
    const pool = await this.findOne(id);
    const chain = await this.chainsService.findOne(poolDto.chainId);
    const token = await this.tokensService.findOne(poolDto.token);
    const token2 = await this.tokensService.findOne(poolDto.token2);
    const dex = await this.dexesService.findOne(poolDto.dexId);

    pool.poolId = poolDto.poolId;
    pool.poolAddress = poolDto.poolAddress;
    pool.fee = poolDto.fee;
    pool.version = poolDto.version;
    pool.chain = chain;
    pool.token = token;
    pool.token = token2;
    pool.dex = dex;

    return await this.poolRepository.save(pool);
  }

  async remove(id: number) {
    return await this.poolRepository.delete(id);
  }
}
