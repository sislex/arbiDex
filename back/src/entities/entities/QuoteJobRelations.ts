import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Jobs } from './Jobs';
import { Quotes } from './Quotes';

@Index('quote_job_relations_pkey', ['quoteJobRelarionId'], { unique: true })
@Entity('quote_job_relations', { schema: 'public' })
export class QuoteJobRelations {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'quote_job_relarion_id' })
  quoteJobRelarionId: string;

  @ManyToOne(() => Jobs, (jobs) => jobs.quoteJobRelations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'job_id', referencedColumnName: 'jobId' }])
  job: Jobs;

  @ManyToOne(() => Quotes, (quotes) => quotes.quoteJobRelations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'quote_id', referencedColumnName: 'quoteId' }])
  quote: Quotes;
}
