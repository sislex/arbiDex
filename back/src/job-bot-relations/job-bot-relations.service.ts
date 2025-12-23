import { Injectable } from '@nestjs/common';
import { JobBotRelationsDto } from '../dtos/job-bot-relations-dto/job-bot-relations.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobBotRelations } from '../entities/entities/JobBotRelations';
import { Repository } from 'typeorm';
import { JobsService } from '../jobs/jobs.service';
import { BotsService } from '../bots/bots.service';

@Injectable()
export class JobBotRelationsService {
  constructor(
    @InjectRepository(JobBotRelations)
    private jobBotRelationsRepository: Repository<JobBotRelations>,
    private jobsService: JobsService,
    private botsService: BotsService,
  ) {}

  async create(createJobBotRelationDto: JobBotRelationsDto) {
    const job = await this.jobsService.findOne(createJobBotRelationDto.jobId);
    const bot = await this.botsService.findOne(createJobBotRelationDto.botId);

    const jobBotRelation = this.jobBotRelationsRepository.create({
      job,
      bot,
    });

    return await this.jobBotRelationsRepository.save(jobBotRelation);
  }

  async findAll() {
    return await this.jobBotRelationsRepository.find({
      relations: ['job', 'bot'],
      order: {
        jobBotRelationId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const item = await this.jobBotRelationsRepository.findOne({
      where: { jobBotRelationId: id.toString() },
      relations: ['job', 'bot'],
    });
    if (!item) {
      throw new Error(`Job-Bot Relation with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, updateJobBotRelationDto: JobBotRelationsDto) {
    const jobBotRelation = await this.findOne(id);

    jobBotRelation.job = await this.jobsService.findOne(
      updateJobBotRelationDto.jobId,
    );
    jobBotRelation.bot = await this.botsService.findOne(
      updateJobBotRelationDto.botId,
    );

    return await this.jobBotRelationsRepository.save(jobBotRelation);
  }

  async remove(id: number) {
    return await this.jobBotRelationsRepository.delete(id);
  }
}
