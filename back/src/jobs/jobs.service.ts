import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobs } from '../entities/entities/Jobs';
import { Repository } from 'typeorm';
import { JobDto } from '../dtos/jobs-dto/job.dto';
import { PoolJobRelationsService } from '../pool-job-relations/pool-job-relations.service';
import { ChainsService } from '../chains/chains.service';
import { RpcUrlsService } from '../rpc-urls/rpc-urls.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Jobs)
    private jobRepository: Repository<Jobs>,
    @Inject(forwardRef(() => PoolJobRelationsService))
    private poolJobRelationsService: PoolJobRelationsService,
    private chainsService: ChainsService,
    private rpcUrlsService: RpcUrlsService,
  ) {}

  async create(createJobDto: JobDto) {
    const chain = await this.chainsService.findOne(createJobDto.chainId);
    const rpcUrl = await this.rpcUrlsService.findOne(createJobDto.rpcUrlId);

    const job = this.jobRepository.create({
      jobType: createJobDto.jobType,
      description: createJobDto.description,
      extraSettings: createJobDto.extraSettings,
      chain,
      rpcUrl,
    });
    return await this.jobRepository.save(job);
  }

  async findAll() {
    const jobData = await this.jobRepository.find({
      relations: {
        chain: true,
        rpcUrl: true,
        poolsJobRelations: true,
      },
      select: {
        jobId: true,
        jobType: true,
        description: true,
        extraSettings: true,
        chain: {
          chainId: true,
        },
        poolsJobRelations: {
          poolsJobRelationId: true,
        },
        rpcUrl: {
          rpcUrlId: true,
        },
      },
      order: { jobId: 'DESC' },
    });

    return jobData.map((item) => ({
      ...item,
      poolsCount: item.poolsJobRelations?.length ?? 0,
    }));
  }

  private async findEntity(id: number): Promise<Jobs> {
    const job = await this.jobRepository.findOne({
      where: { jobId: id.toString() },
      relations: ['chain', 'rpcUrl'],
    });
    if (!job) {
      throw new Error(`Job with id ${id} not found`);
    }
    return job;
  }

  async findOne(id: number) {
    const job = await this.findEntity(id);
    const relations = await this.poolJobRelationsService.findByJobId(job.jobId);
    return {
      ...job,
      poolsCount: relations.length,
    };
  }

  async findOneWithPairs(id: number) {
    return this.findOne(id);
  }

  async update(id: number, updateJobDto: JobDto) {
    const job = await this.findEntity(id);
    const chain = await this.chainsService.findOne(updateJobDto.chainId);
    const rpcUrl = await this.rpcUrlsService.findOne(updateJobDto.rpcUrlId);

    job.jobType = updateJobDto.jobType;
    job.description = updateJobDto.description;
    job.extraSettings = updateJobDto.extraSettings;
    job.chain = chain;
    job.rpcUrl = rpcUrl;

    return await this.jobRepository.save(job);
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
      await this.findEntity(id);
    }

    const result = await this.jobRepository.delete(uniqueIds);
    if ((result.affected ?? 0) === 0) {
      throw new Error('No jobs were deleted');
    }

    return { success: true as const, deletedIds: uniqueIds };
  }
}
