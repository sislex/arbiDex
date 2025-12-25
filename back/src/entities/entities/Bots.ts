import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Jobs } from './Jobs';
import { Servers } from './Servers';
import { JobBotRelations } from './JobBotRelations';

@Index('bots_pkey', ['botId'], { unique: true })
@Entity('bots', { schema: 'public' })
export class Bots {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'bot_id' })
  botId: string;

  @Column('character varying', {
    name: 'bot_name',
    nullable: true,
    length: 255,
  })
  botName: string | null;

  @Column('character varying', {
    name: 'description',
    nullable: true,
    length: 255,
  })
  description: string | null;

  @ManyToOne(() => Jobs, (jobs) => jobs.bots, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'job_id', referencedColumnName: 'jobId' }])
  job: Jobs;

  @ManyToOne(() => Servers, (servers) => servers.bots, { onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'server_id', referencedColumnName: 'serverId' }])
  server: Servers;

  @OneToMany(() => JobBotRelations, (jobBotRelations) => jobBotRelations.bot)
  jobBotRelations: JobBotRelations[];
}
