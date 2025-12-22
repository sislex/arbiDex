import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobBotRelations } from './JobBotRelations';
import { MarketJobRelations } from './MarketJobRelations';

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

  @OneToMany(() => JobBotRelations, (jobBotRelations) => jobBotRelations.job)
  jobBotRelations: JobBotRelations[];

  @OneToMany(
    () => MarketJobRelations,
    (marketJobRelations) => marketJobRelations.job,
  )
  marketJobRelations: MarketJobRelations[];
}
