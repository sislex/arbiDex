import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CexPair } from './cex-pair.entity';

@Entity('cex_jobs')
export class CexJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  job_type: string;

  @Column({ name: 'cex_pool_id' })
  cex_pool_id: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => CexPair, (pool) => pool.jobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cex_pool_id' })
  pair: CexPair;
}
