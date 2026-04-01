import { Injectable } from '@nestjs/common';
import { CexChainDto } from '../dtos/cex-chains-dto/cex-chain.dto';

@Injectable()
export class CexChainsService {
  create(createCexChainDto: CexChainDto) {
    return 'This action adds a new cexChain';
  }

  findAll() {
    return `This action returns all cexChains`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cexChain`;
  }

  update(id: number, updateCexChainDto: CexChainDto) {
    return `This action updates a #${id} cexChain`;
  }

  remove(id: number) {
    return `This action removes a #${id} cexChain`;
  }
}
