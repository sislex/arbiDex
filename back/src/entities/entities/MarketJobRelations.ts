import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Jobs } from './Jobs';
import { Markets } from './Markets';

@Index('market_job_relations_pkey', ['marketJobRelationId'], { unique: true })
@Entity('market_job_relations', { schema: 'public' })
export class MarketJobRelations {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'market_job_relation_id' })
  marketJobRelationId: string;

  @ManyToOne(() => Jobs, (jobs) => jobs.marketJobRelations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'job_id', referencedColumnName: 'jobId' }])
  job: Jobs;

  @ManyToOne(() => Markets, (markets) => markets.marketJobRelations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'market_id', referencedColumnName: 'marketId' }])
  market: Markets;
}
