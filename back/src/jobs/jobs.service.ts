import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobs } from '../entities/entities/Jobs';
import { Repository } from 'typeorm';
import { JobDto } from '../dtos/jobs-dto/job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Jobs)
    private jobRepository: Repository<Jobs>,
  ) {}

  async create(createJobDto: JobDto) {
    const job = this.jobRepository.create({
      jobType: createJobDto.jobType,
    });
    return await this.jobRepository.save(job);
  }

  async findAll() {
    return await this.jobRepository.find({
      order: {
        jobId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const job = await this.jobRepository.findOne({
      where: { jobId: id.toString() },
    });
    if (!job) {
      throw new Error(`Job с id ${id} не найден`);
    }
    return job;
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
