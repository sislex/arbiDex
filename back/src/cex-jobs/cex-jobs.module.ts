import { Module } from '@nestjs/common';
import { CexJobsService } from './cex-jobs.service';
import { CexJobsController } from './cex-jobs.controller';

@Module({
  controllers: [CexJobsController],
  providers: [CexJobsService],
})
export class CexJobsModule {}
