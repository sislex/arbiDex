import { Injectable } from '@nestjs/common';
import { CexPoolDto } from '../dtos/cex-pools-dto/cex-pool.dto';

@Injectable()
export class CexPoolsService {
  create(createCexPoolDto: CexPoolDto) {
    return 'This action adds a new cexPool';
  }

  findAll() {
    return `This action returns all cexPools`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cexPool`;
  }

  update(id: number, updateCexPoolDto: CexPoolDto) {
    return `This action updates a #${id} cexPool`;
  }

  remove(id: number) {
    return `This action removes a #${id} cexPool`;
  }
}
