import { Injectable } from '@nestjs/common';
import { ChainDto } from '../dtos/chains-dto/chain.dto';
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

  async update(id: number, updateChainDto: ChainDto) {
    const chain = await this.chainsRepository.findOne({
      where: { chainId: id },
    });
    if (!chain) {
      throw new Error(`Chain с id ${updateChainDto.chainId} не найден`);
    }

    chain.chainId = updateChainDto.chainId;
    chain.name = updateChainDto.name;

    return await this.chainsRepository.save(chain);
  }

  async remove(id: number) {
    return await this.chainsRepository.delete(id);
  }
}
