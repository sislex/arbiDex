import { Module } from '@nestjs/common';
import { JobBotRelationsService } from './job-bot-relations.service';
import { JobBotRelationsController } from './job-bot-relations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobBotRelations } from '../entities/entities/JobBotRelations';
import { Jobs } from '../entities/entities/Jobs';
import { Bots } from '../entities/entities/Bots';
import { BotsModule } from '../bots/bots.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobBotRelations, Jobs, Bots]),
    BotsModule,
    JobsModule,
  ],
  controllers: [JobBotRelationsController],
  providers: [JobBotRelationsService],
  exports: [JobBotRelationsService],
})
export class JobBotRelationsModule {}
