import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobsService } from '../jobs/jobs.service';
import { PoolsJobRelations } from '../entities/entities/PoolsJobRelations';
import { PoolJobRelationDto } from '../dtos/pool-job-relations-dto/pool-job-relation.dto';
import { PoolsService } from '../pools/pools.service';

@Injectable()
export class PoolJobRelationsService {
  constructor(
    @InjectRepository(PoolsJobRelations)
    private poolsJobRelationsRepository: Repository<PoolsJobRelations>,
    @Inject(forwardRef(() => JobsService))
    private jobsService: JobsService,
    private poolsService: PoolsService,
  ) {}

  async createMany(poolJobRelationDto: PoolJobRelationDto[]) {
    const data = await Promise.all(
      poolJobRelationDto.map(async (dto) => {
        const job = await this.jobsService.findOne(dto.jobId);
        const pool = await this.poolsService.findOne(dto.poolId);
        return { job, pool };
      }),
    );

    return await this.poolsJobRelationsRepository.save(data);
  }

  async findByJobId(id: string) {
    return await this.poolsJobRelationsRepository.find({
      where: {
        job: {
          jobId: id,
        },
      },
      relations: {
        job: true,
        pool: {
          dex: true,
          chain: true,
          token0: true,
          token1: true,
        },
      },
    });
  }

  async remove(id: string[] | number[]) {
    return await this.poolsJobRelationsRepository.delete(id);
  }
}
