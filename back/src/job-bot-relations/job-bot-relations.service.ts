import { Injectable } from '@nestjs/common';
import { JobBotRelationsDto } from '../dtos/job-bot-relations-dto/job-bot-relations.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobBotRelations } from '../entities/entities/JobBotRelations';
import { Repository } from 'typeorm';

@Injectable()
export class JobBotRelationsService {
  constructor(
    @InjectRepository(JobBotRelations)
    private jobBotRelationsRepository: Repository<JobBotRelations>,
  ) {}
  create(createJobBotRelationDto: JobBotRelationsDto) {
    return 'This action adds a new jobBotRelation';
  }

  findAll() {
    return `This action returns all jobBotRelations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobBotRelation`;
  }

  update(id: number, updateJobBotRelationDto: JobBotRelationsDto) {
    return `This action updates a #${id} jobBotRelation`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobBotRelation`;
  }
}
