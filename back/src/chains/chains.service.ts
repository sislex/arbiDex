import { Injectable } from '@nestjs/common';
import { ChainDto, UpdateChainDto } from '../dtos/chains-dto/chain.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chains } from '../entities/entities/Chains';

@Injectable()
export class ChainsService {
  constructor(
    @InjectRepository(Chains)
    private chainsRepository: Repository<Chains>,
  ) {}
  async create(chainDto: ChainDto) {
    const chain = this.chainsRepository.create({
      chainId: chainDto.chainId,
      name: chainDto.name,
    });

    return await this.chainsRepository.save(chain);
  }

  async findAll() {
    return await this.chainsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const chain = await this.chainsRepository.findOne({
      where: { chainId: id },
    });

    if (!chain) {
      throw new Error(`Chain with id ${id} not found`);
    }

    return chain;
  }

  async update(id: number, updateChainDto: UpdateChainDto) {
    await this.findOne(id);

    await this.chainsRepository.update(
      { chainId: id },
      {
        chainId: updateChainDto.newChainId,
        name: updateChainDto.name,
      },
    );

    return this.findOne(updateChainDto.newChainId);
  }

  async remove(id: number) {
    return await this.chainsRepository.delete(id);
  }
}
