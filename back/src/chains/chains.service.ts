import { Injectable, NotFoundException } from '@nestjs/common';
import { ChainDto, UpdateChainDto } from '../dtos/chains-dto/chain.dto';
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
      chainId: chainDto.newChainId,
      name: chainDto.name,
    });

    return await this.chainsRepository.save(chain);
  }

  async findAll() {
    return await this.chainsRepository.find({
      select: {
        name: true,
        chainId: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const chain = await this.chainsRepository.findOne({
      where: { chainId: id },
    });

    if (!chain) {
      throw new Error(`Chain with id ${id} not found`);
    }

    return chain;
  }

  async update(id: number, updateChainDto: UpdateChainDto) {
    await this.findOne(id);

    await this.chainsRepository.update(
      { chainId: id },
      {
        chainId: updateChainDto.newChainId,
        name: updateChainDto.name,
      },
    );

    return this.findOne(updateChainDto.newChainId);
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

    const result = await this.chainsRepository.delete(uniqueIds);
    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('No DEX chains were deleted');
    }

    return { success: true as const, deletedIds: uniqueIds };
  }
}
