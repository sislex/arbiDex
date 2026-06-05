import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CexPairsService } from '../cex-pairs/cex-pairs.service';
import { CexJob } from '../entities/entities/cex-job.entity';
import { CexJobDto } from '../dtos/cex-jobs-dto/cex-job.dto';

@Injectable()
export class CexJobsService {
  constructor(
    @InjectRepository(CexJob)
    private readonly cexJobRepository: Repository<CexJob>,
    private readonly cexPairsService: CexPairsService,
  ) {}

  async create(dto: CexJobDto) {
    const pair = await this.cexPairsService.findOne(dto.cex_pair_id);

    const job = this.cexJobRepository.create({
      job_type: dto.job_type,
      description: dto.description,
      cex_pair_id: pair.id,
      checked: null,
    });

    return await this.cexJobRepository.save(job);
  }

  async findAll() {
    return await this.cexJobRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const job = await this.cexJobRepository.findOne({
      where: { id },
      relations: ['pair'],
    });

    if (!job) {
      throw new NotFoundException(`CexJob with id ${id} not found`);
    }
    return job;
  }

  async update(jobId: number, dto: CexJobDto) {
    const updateJob = {
      id: jobId,
      job_type: dto.job_type,
      description: dto.description || '',
      cex_pair_id: dto.cex_pair_id,
      checked: dto.checked
    }
    return await this.cexJobRepository.save(updateJob);
  }

  async setCheckedStatus(id: number, status: boolean | null) {
    await this.cexJobRepository.update(id, { checked: status });
    return this.findOne(id);
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

    const result = await this.cexJobRepository.delete(uniqueIds);
    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('No CEX jobs were deleted');
    }

    return { success: true as const, deletedIds: uniqueIds };
  }
}
