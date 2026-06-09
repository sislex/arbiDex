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

  async findOne(id: number) {
    const dex = await this.dexesRepository.findOne({
      where: { dexId: id },
    });
    if (!dex) throw new Error(`Dex with id ${id} not found`);

    return dex;
  }

  async update(id: number, updateDexDto: DexDto) {
    const dex = await this.dexesRepository.findOne({
      where: { dexId: id },
    });
    if (!dex) {
      throw new Error(`Dex с id ${id} не найден`);
    }

    // Keep primary key immutable on update; route param identifies the row.
    dex.name = updateDexDto.name;

    return await this.dexesRepository.save(dex);
  }

  async remove(id: number) {
    const result = await this.removeMany([id]);
    return { deleted: true, deletedIds: result.deletedIds };
  }

  async removeMany(ids: number[]) {
    const uniqueIds = [
      ...new Set(
        (ids ?? [])
          .map((id) => Number(id))
          .filter((id) => Number.isFinite(id) && id > 0),
      ),
    ];

    if (uniqueIds.length === 0) {
      return { success: true as const, deletedIds: [] as number[] };
    }

    for (const id of uniqueIds) {
      await this.findOne(id);
    }

    const result = await this.dexesRepository.delete(uniqueIds);
    if ((result.affected ?? 0) === 0) {
      throw new Error('No dexes were deleted');
    }

    return { success: true as const, deletedIds: uniqueIds };
  }
}
