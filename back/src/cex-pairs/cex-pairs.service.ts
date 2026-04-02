import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CexPairDto } from '../dtos/cex-pools-dto/cex-pool.dto';
import { CexPair } from '../entities/entities/cex-pair.entity';

@Injectable()
export class CexPairsService {
  constructor(
    @InjectRepository(CexPair)
    private readonly cexPoolRepository: Repository<CexPair>,
  ) {}

  async create(dto: CexPairDto) {
    const pool = this.cexPoolRepository.create({
      source: dto.source,
      token0: dto.token0,
      token1: dto.token1,
    });

    return await this.cexPoolRepository.save(pool);
  }

  async findAll() {
    return await this.cexPoolRepository.find({
      relations: {
        chain: true,
      },
      select: {
        id: true,
        source: true,
        token0: true,
        token1: true,
        chain: {
          id: true,
          name: true,
        },
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const pool = await this.cexPoolRepository.findOne({
      where: { id },
      relations: ['chain'],
    });

    if (!pool) {
      throw new NotFoundException(`Cex Pool with id ${id} not found`);
    }
    return pool;
  }

  async update(id: number, dto: CexPairDto) {
    const pool = await this.findOne(id);

    pool.source = dto.source;
    pool.token0 = dto.token0;
    pool.token1 = dto.token1;

    return await this.cexPoolRepository.save(pool);
  }

  async remove(id: number) {
    const result = await this.cexPoolRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pool with id ${id} not found`);
    }
    return { deleted: true };
  }

  async findByChain(chainId: number) {
    return await this.cexPoolRepository.find({
      where: { source: chainId },
      relations: ['chain'],
    });
  }
}
