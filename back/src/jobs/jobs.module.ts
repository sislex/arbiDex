import { forwardRef, Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from '../entities/entities/Jobs';
import { ChainsModule } from '../chains/chains.module';
import { RpcUrlsModule } from '../rpc-urls/rpc-urls.module';
import { PoolJobRelationsModule } from '../pool-job-relations/pool-job-relations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jobs]),
    forwardRef(() => PoolJobRelationsModule),
    ChainsModule,
    RpcUrlsModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
