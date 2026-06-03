import { forwardRef, Module } from '@nestjs/common';
import { PoolJobRelationsService } from './pool-job-relations.service';
import { PoolJobRelationsController } from './pool-job-relations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoolsJobRelations } from '../entities/entities/PoolsJobRelations';
import { Jobs } from '../entities/entities/Jobs';
import { JobsModule } from '../jobs/jobs.module';
import { PoolsModule } from '../pools/pools.module';
import { Pools } from '../entities/entities/Pools';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jobs, Pools, PoolsJobRelations]),
    forwardRef(() => JobsModule),
    PoolsModule,
  ],
  controllers: [PoolJobRelationsController],
  providers: [PoolJobRelationsService],
  exports: [PoolJobRelationsService],
})
export class PoolJobRelationsModule {}
