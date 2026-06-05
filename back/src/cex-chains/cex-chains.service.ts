import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CexChain } from '../entities/entities/cex-chain.entity';
import { CexPair } from '../entities/entities/cex-pair.entity';
import { CexChainDto } from '../dtos/cex-chains-dto/cex-chain.dto';

@Injectable()
export class CexChainsService {
  constructor(
    @InjectRepository(CexChain)
    private readonly cexChainsRepository: Repository<CexChain>,
    @InjectRepository(CexPair)
    private readonly cexPairsRepository: Repository<CexPair>,
  ) {}

  async create(dto: CexChainDto) {
    const chain = this.cexChainsRepository.create({
      name: dto.name,
    });

    return await this.cexChainsRepository.save(chain);
  }

  async findAll() {
    return await this.cexChainsRepository.find({
      select: {
        id: true,
        name: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const chain = await this.cexChainsRepository.findOne({
      where: { id },
    });

    if (!chain) {
      throw new NotFoundException(`CexChain with id ${id} not found`);
    }

    return chain;
  }

  async update(id: number, dto: CexChainDto) {
    const chain = await this.findOne(id);

    chain.name = dto.name;

    return await this.cexChainsRepository.save(chain);
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

      const pairsCount = await this.cexPairsRepository.count({
        where: { source: id },
      });

      if (pairsCount > 0) {
        throw new ConflictException(
          `Cannot delete CEX chain ${id}: ${pairsCount} CEX pair(s) still reference it. Delete or move those pairs first.`,
        );
      }
    }

    const result = await this.cexChainsRepository.delete(uniqueIds);
    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('No CEX chains were deleted');
    }

    return { success: true as const, deletedIds: uniqueIds };
  }
}
