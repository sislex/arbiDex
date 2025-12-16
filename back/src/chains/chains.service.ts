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
  create(createChainDto: ChainDto) {
    return 'This action adds a new chain';
  }

  async findAll() {
    return await this.chainsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} chain`;
  }

  update(id: number, updateChainDto: UpdateChainDto) {
    return `This action updates a #${id} chain`;
  }

  remove(id: number) {
    return `This action removes a #${id} chain`;
  }
}
