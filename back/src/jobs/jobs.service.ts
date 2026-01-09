import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobs } from '../entities/entities/Jobs';
import { Repository } from 'typeorm';
import { JobDto } from '../dtos/jobs-dto/job.dto';
import { QuoteJobRelationsService } from '../quote-job-relations/quote-job-relations.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Jobs)
    private jobRepository: Repository<Jobs>,
    @Inject(forwardRef(() => QuoteJobRelationsService))
    private quoteJobRelationsService: QuoteJobRelationsService,
  ) {}

  async create(createJobDto: JobDto) {
    const job = this.jobRepository.create({
      jobType: createJobDto.jobType,
    });
    return await this.jobRepository.save(job);
  }

  async findAll() {
    const jobData = await this.jobRepository.find({
      relations: ['chain', 'rpcUrl'],
      order: { jobId: 'DESC' },
    });

    if (jobData && jobData.length > 0) {
      return Promise.all(
        jobData.map(async (item) => {
          const relations = await this.quoteJobRelationsService.findByJobId(
            item.jobId,
          );
          return {
            ...item,
            pairsCount: relations.length,
          };
        }),
      );
    }

    return [];
  }

  async findOne(id: number) {
    const job = await this.jobRepository.findOne({
      where: { jobId: id.toString() },
    });
    if (!job) {
      throw new Error(`Job with id ${id} not found`);
    }
    return job;
  }

  async findOneWithPairs(id: number) {
    const job = await this.jobRepository.findOne({
      where: { jobId: id.toString() },
      relations: ['chain', 'rpcUrl'],
    });

    const relations = await this.quoteJobRelationsService.findByJobId(
      job!.jobId,
    );

    return {
      ...job,
      pairsCount: relations.length,
    };
  }

  async update(id: number, updateJobDto: JobDto) {
    const job = await this.findOne(id);

    job.jobType = updateJobDto.jobType;

    return await this.jobRepository.save(job);
  }
  async remove(id: number) {
    return await this.jobRepository.delete(id);
  }
}
