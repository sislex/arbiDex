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
    private readonly cexPoolsService: CexPairsService,
  ) {}

  async create(dto: CexJobDto) {
    const pool = await this.cexPoolsService.findOne(dto.cex_pool_id);

    const job = this.cexJobRepository.create({
      job_type: dto.jobType,
      description: dto.description,
      cex_pool_id: pool.id,
    });

    return await this.cexJobRepository.save(job);
  }

  async findAll() {
    return await this.cexJobRepository.find({
      relations: {
        pair: {
          chain: true,
        },
      },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const job = await this.cexJobRepository.findOne({
      where: { id },
      relations: ['pool', 'pool.chain'],
    });

    if (!job) {
      throw new NotFoundException(`CexJob with id ${id} not found`);
    }
    return job;
  }

  async update(id: number, dto: CexJobDto) {
    const job = await this.findOne(id);
    const pool = await this.cexPoolsService.findOne(dto.cex_pool_id);

    job.job_type = dto.jobType;
    job.description = dto.description || '';
    job.cex_pool_id = pool.id;

    return await this.cexJobRepository.save(job);
  }

  async remove(id: number) {
    const result = await this.cexJobRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job ${id} not found`);
    }
    return { deleted: true };
  }
}
