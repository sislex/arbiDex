import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Jobs } from './Jobs';
import { Pools } from './Pools';

@Index('unique_pool_job_link', ['jobId', 'poolId'], { unique: true })
@Index('idx_pools_job_relations_job_id', ['jobId'], {})
@Index('idx_pools_job_relations_pool_id', ['poolId'], {})
@Index('pools_job_relations_pkey', ['poolsJobRelationId'], { unique: true })
@Entity('pools_job_relations', { schema: 'public' })
export class PoolsJobRelations {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pools_job_relation_id' })
  poolsJobRelationId: string;

  @Column('integer', { name: 'pool_id' })
  poolId: number;

  @Column('bigint', { name: 'job_id' })
  jobId: string;

  @ManyToOne(() => Jobs, (jobs) => jobs.poolsJobRelations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'job_id', referencedColumnName: 'jobId' }])
  job: Jobs;

  @ManyToOne(() => Pools, (pools) => pools.poolsJobRelations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'pool_id', referencedColumnName: 'poolId' }])
  pool: Pools;
}
