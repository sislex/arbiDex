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
    const result = await this.cexJobRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job ${id} not found`);
    }
    return { deleted: true };
  }
}
