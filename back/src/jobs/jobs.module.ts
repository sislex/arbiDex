import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from '../entities/entities/Jobs';

@Module({
  imports: [TypeOrmModule.forFeature([Jobs])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
