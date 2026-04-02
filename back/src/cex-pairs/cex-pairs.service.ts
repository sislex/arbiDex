import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CexPairDto } from '../dtos/cex-pairs-dto/cex-pair.dto';
import { CexPair } from '../entities/entities/cex-pair.entity';

@Injectable()
export class CexPairsService {
  constructor(
    @InjectRepository(CexPair)
    private readonly cexPairRepository: Repository<CexPair>,
  ) {}

  async create(dto: CexPairDto) {
    const pair = this.cexPairRepository.create({
      source: dto.source,
      token0: dto.token0,
      token1: dto.token1,
    });

    return await this.cexPairRepository.save(pair);
  }

  async findAll() {
    return await this.cexPairRepository.find({
      select: {
        id: true,
        source: true,
        token0: true,
        token1: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const pair = await this.cexPairRepository.findOne({
      where: { id },
    });

    if (!pair) {
      throw new NotFoundException(`Cex Pair with id ${id} not found`);
    }
    return pair;
  }

  async update(id: number, dto: CexPairDto) {
    const pair = await this.findOne(id);

    pair.source = dto.source;
    pair.token0 = dto.token0;
    pair.token1 = dto.token1;

    return await this.cexPairRepository.save(pair);
  }

  async remove(id: number) {
    const result = await this.cexPairRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pair with id ${id} not found`);
    }
    return { deleted: true };
  }

  async findByChain(chainId: number) {
    return await this.cexPairRepository.find({
      where: { source: chainId },
      relations: ['chain'],
    });
  }
}
