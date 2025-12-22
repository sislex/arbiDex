import { Injectable } from '@nestjs/common';
import { PairDto } from '../dtos/pairs-dto/pair.dto';

@Injectable()
export class PairsService {
  create(createPairDto: PairDto) {
    return 'This action adds a new pair';
  }

  findAll() {
    return `This action returns all pairs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pair`;
  }

  update(id: number, updatePairDto: PairDto) {
    return `This action updates a #${id} pair`;
  }

  remove(id: number) {
    return `This action removes a #${id} pair`;
  }
}
