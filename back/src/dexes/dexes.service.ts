import { Injectable } from '@nestjs/common';
import { DexDto } from '../dtos/dexes-dto/dex.dto';
import { UpdateDexDto } from '../dtos/dexes-dto/update-dex.dto';

@Injectable()
export class DexesService {
  create(createDexDto: DexDto) {
    return 'This action adds a new dex';
  }

  findAll() {
    return `This action returns all dexes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dex`;
  }

  update(id: number, updateDexDto: UpdateDexDto) {
    return `This action updates a #${id} dex`;
  }

  remove(id: number) {
    return `This action removes a #${id} dex`;
  }
}
