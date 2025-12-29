import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bots } from './Bots';
import { QuoteJobRelations } from './QuoteJobRelations';

@Index('jobs_pkey', ['jobId'], { unique: true })
@Entity('jobs', { schema: 'public' })
export class Jobs {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'job_id' })
  jobId: string;

  @Column('character varying', {
    name: 'job_type',
    nullable: true,
    length: 255,
  })
  jobType: string | null;

  @OneToMany(() => Bots, (bots) => bots.job)
  bots: Bots[];

  @OneToMany(
    () => QuoteJobRelations,
    (quoteJobRelations) => quoteJobRelations.job,
  )
  quoteJobRelations: QuoteJobRelations[];
}
