import { Module } from '@nestjs/common';
import { JobBotRelationsService } from './job-bot-relations.service';
import { JobBotRelationsController } from './job-bot-relations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobBotRelations } from '../entities/entities/JobBotRelations';

@Module({
  imports: [TypeOrmModule.forFeature([JobBotRelations])],
  controllers: [JobBotRelationsController],
  providers: [JobBotRelationsService],
})
export class JobBotRelationsModule {}
