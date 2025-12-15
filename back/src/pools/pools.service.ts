import { Injectable } from '@nestjs/common';
import { PoolDto } from '../dtos/pools-dto/pool.dto';
import { UpdatePoolDto } from '../dtos/pools-dto/update-pool.dto';

@Injectable()
export class PoolsService {
  create(createPoolDto: PoolDto) {
    return 'This action adds a new pool';
  }

  findAll() {
    return `This action returns all pools`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pool`;
  }

  update(id: number, updatePoolDto: UpdatePoolDto) {
    return `This action updates a #${id} pool`;
  }

  remove(id: number) {
    return `This action removes a #${id} pool`;
  }
}
