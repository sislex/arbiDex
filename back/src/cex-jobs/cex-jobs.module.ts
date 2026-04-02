import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CexJobsService } from './cex-jobs.service';
import { CexJobsController } from './cex-jobs.controller';
import { CexPairsModule } from '../cex-pairs/cex-pairs.module';
import { CexJob } from '../entities/entities/cex-job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CexJob]),
    CexPairsModule
  ],
  controllers: [CexJobsController],
  providers: [CexJobsService],
})
export class CexJobsModule {}
