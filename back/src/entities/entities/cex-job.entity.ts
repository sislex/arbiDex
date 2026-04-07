import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CexPair } from './cex-pair.entity';

@Entity('cex_jobs')
export class CexJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  job_type: string;

  @Column({ name: 'cex_pair_id' })
  cex_pair_id: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', nullable: true, default: null })
  checked: boolean | null;

  @ManyToOne(() => CexPair, (pair) => pair.jobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cex_pair_id' })
  pair: CexPair;
}
