import { Injectable } from '@nestjs/common';
import { PoolDto } from '../dtos/pools-dto/pool.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pools } from '../entities/entities/Pools';
import { Chains } from '../entities/entities/Chains';
import { Tokens } from '../entities/entities/Tokens';
import { Dexes } from '../entities/entities/Dexes';

@Injectable()
export class PoolsService {
  constructor(
    @InjectRepository(Pools)
    private poolRepository: Repository<Pools>,
    @InjectRepository(Chains)
    private chainRepository: Repository<Chains>,
    @InjectRepository(Tokens)
    private tokensRepository: Repository<Tokens>,
    @InjectRepository(Dexes)
    private dexesRepository: Repository<Dexes>,
  ) {}

  async create(poolDto: PoolDto) {
    const chain = await this.chainRepository.findOne({
      where: { chainId: poolDto.chainId },
    });
    if (!chain) throw new Error(`Chain с id ${poolDto.chainId} не найден`);

    const baseToken = await this.tokensRepository.findOne({
      where: { tokenId: poolDto.baseTokenId },
    });
    if (!baseToken)
      throw new Error(`Chain с id ${poolDto.baseTokenId} не найден`);

    const quoteToken = await this.tokensRepository.findOne({
      where: { tokenId: poolDto.quoteTokenId },
    });
    if (!quoteToken)
      throw new Error(`Chain с id ${poolDto.quoteTokenId} не найден`);

    const dex = await this.dexesRepository.findOne({
      where: { dexId: poolDto.dexId },
    });
    if (!dex) throw new Error(`Chain с id ${poolDto.dexId} не найден`);

    const market = this.poolRepository.create({
      chain,
      baseToken,
      quoteToken,
      dex,
      version: poolDto.version,
      fee: poolDto.fee,
      poolAddress: poolDto.poolAddress,
    });

    return await this.poolRepository.save(market);
  }

  async findAll() {
    return await this.poolRepository.find({
      relations: ['chain', 'baseToken', 'quoteToken', 'dex'],
      order: {
        poolId: 'DESC',
      },
    });
  }

  async update(id: number, poolDto: PoolDto) {
    const pool = await this.poolRepository.findOne({
      where: { poolId: id },
      relations: ['baseToken', 'quoteToken', 'chain', 'dex'],
    });
    if (!pool) {
      throw new Error(`Chain с id ${poolDto.poolId} не найден`);
    }

    const chain = await this.chainRepository.findOne({
      where: { chainId: poolDto.chainId },
    });
    if (!chain) throw new Error(`Chain с id ${poolDto.chainId} не найден`);

    const baseToken = await this.tokensRepository.findOne({
      where: { tokenId: poolDto.baseTokenId },
    });
    if (!baseToken)
      throw new Error(`Chain с id ${poolDto.baseTokenId} не найден`);

    const quoteToken = await this.tokensRepository.findOne({
      where: { tokenId: poolDto.quoteTokenId },
    });
    if (!quoteToken)
      throw new Error(`Chain с id ${poolDto.quoteTokenId} не найден`);

    const dex = await this.dexesRepository.findOne({
      where: { dexId: poolDto.dexId },
    });
    if (!dex) throw new Error(`Chain с id ${poolDto.dexId} не найден`);

    pool.poolId = poolDto.poolId;
    pool.poolAddress = poolDto.poolAddress;
    pool.fee = poolDto.fee;
    pool.version = poolDto.version;
    pool.chain = chain;
    pool.baseToken = baseToken;
    pool.quoteToken = quoteToken;
    pool.dex = dex;

    return await this.poolRepository.save(pool);
  }

  async remove(id: number) {
    return await this.poolRepository.delete(id);
  }
}
