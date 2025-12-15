import { Injectable } from '@nestjs/common';
import { ChainDto } from '../dtos/chains-dto/chain.dto';
import { UpdateChainDto } from '../dtos/chains-dto/update-chain.dto';

@Injectable()
export class ChainsService {
  create(createChainDto: ChainDto) {
    return 'This action adds a new chain';
  }

  findAll() {
    return `This action returns all chains`;
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
