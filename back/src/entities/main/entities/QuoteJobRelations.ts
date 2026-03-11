import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Jobs } from './Jobs';
import { PairQuoteRelations } from './PairQuoteRelations';

@Index('unique_quote_job_link', ['jobId', 'quoteRelationId'], { unique: true })
@Index('idx_quote_job_relations_job_id', ['jobId'], {})
@Index('quote_job_relations_pkey', ['quoteJobRelationId'], { unique: true })
@Index('idx_quote_job_relations_quote_rel_id', ['quoteRelationId'], {})
@Entity('quote_job_relations', { schema: 'public' })
export class QuoteJobRelations {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'quote_job_relation_id' })
  quoteJobRelationId: string;

  @Column({ type: 'bigint', name: 'quote_relation_id' })
  quoteRelationId: string;

  @Column({ type: 'bigint', name: 'job_id' })
  jobId: string;

  @ManyToOne(() => Jobs, (jobs) => jobs.quoteJobRelations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'job_id', referencedColumnName: 'jobId' }])
  job: Jobs;

  @ManyToOne(
    () => PairQuoteRelations,
    (pairQuoteRelations) => pairQuoteRelations.quoteJobRelations,
    { onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
  )
  @JoinColumn([
    { name: 'quote_relation_id', referencedColumnName: 'pairQuoteRelationId' },
  ])
  quoteRelation: PairQuoteRelations;
}
