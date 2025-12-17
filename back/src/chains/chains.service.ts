import { Injectable } from '@nestjs/common';
import { ChainDto } from '../dtos/chains-dto/chain.dto';
import { UpdateChainDto } from '../dtos/chains-dto/update-chain.dto';
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
    return await this.chainsRepository.find();
  }

  update(id: number, updateChainDto: UpdateChainDto) {
    return `This action updates a #${id} chain`;
  }

  async remove(id: number) {
    return await this.chainsRepository.delete(id);
  }
}
