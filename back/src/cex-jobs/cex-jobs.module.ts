import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CexJobsService } from './cex-jobs.service';
import { CexJobsController } from './cex-jobs.controller';
import { CexPoolsModule } from '../cex-pools/cex-pools.module';
import { CexJob } from '../entities/entities/cex-job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CexJob]),
    CexPoolsModule
  ],
  controllers: [CexJobsController],
  providers: [CexJobsService],
})
export class CexJobsModule {}
