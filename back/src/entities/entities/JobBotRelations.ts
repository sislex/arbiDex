import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bots } from './Bots';
import { Jobs } from './Jobs';

@Index('job_bot_relations_pkey', ['jobBotRelationId'], { unique: true })
@Entity('job_bot_relations', { schema: 'public' })
export class JobBotRelations {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'job_bot_relation_id' })
  jobBotRelationId: string;

  @ManyToOne(() => Bots, (bots) => bots.jobBotRelations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'bot_id', referencedColumnName: 'botId' }])
  bot: Bots;

  @ManyToOne(() => Jobs, (jobs) => jobs.jobBotRelations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'job_id', referencedColumnName: 'jobId' }])
  job: Jobs;
}
