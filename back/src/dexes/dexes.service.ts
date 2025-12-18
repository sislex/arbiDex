import { Injectable } from '@nestjs/common';
import { DexDto } from '../dtos/dexes-dto/dex.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dexes } from '../entities/entities/Dexes';

@Injectable()
export class DexesService {
  constructor(
    @InjectRepository(Dexes)
    private dexesRepository: Repository<Dexes>,
  ) {}

  async create(dexDto: DexDto) {
    const chain = this.dexesRepository.create({
      dexId: dexDto.dexId,
      name: dexDto.name,
    });

    return await this.dexesRepository.save(chain);
  }

  async findAll() {
    return await this.dexesRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async update(id: number, updateDexDto: DexDto) {
    const dex = await this.dexesRepository.findOne({
      where: { dexId: id },
    });
    if (!dex) {
      throw new Error(`Chain с id ${updateDexDto.dexId} не найден`);
    }

    dex.dexId = updateDexDto.dexId;
    dex.name = updateDexDto.name;

    return await this.dexesRepository.save(dex);
  }

  async remove(id: number) {
    return await this.dexesRepository.delete(id);
  }
}
