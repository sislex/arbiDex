import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CexChain } from '../entities/entities/cex-chain.entity';
import { CexChainDto } from '../dtos/cex-chains-dto/cex-chain.dto';

@Injectable()
export class CexChainsService {
  constructor(
    @InjectRepository(CexChain)
    private readonly cexChainsRepository: Repository<CexChain>,
  ) {}

  async create(dto: CexChainDto) {
    const chain = this.cexChainsRepository.create({
      name: dto.name,
    });

    return await this.cexChainsRepository.save(chain);
  }

  async findAll() {
    return await this.cexChainsRepository.find({
      select: {
        id: true,
        name: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const chain = await this.cexChainsRepository.findOne({
      where: { id },
    });

    if (!chain) {
      throw new NotFoundException(`CexChain with id ${id} not found`);
    }

    return chain;
  }

  async update(id: number, dto: CexChainDto) {
    const chain = await this.findOne(id);

    chain.name = dto.name;

    return await this.cexChainsRepository.save(chain);
  }

  async remove(id: number) {
    const result = await this.cexChainsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CexChain ${id} not found`);
    }
    return { deleted: true };
  }
}
