import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CexChain } from './cex-chain.entity';
import { CexJob } from './cex-job.entity';

@Entity('cex_pairs')
export class CexPair {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'source' })
  source: number;

  @Column({ length: 255 })
  token0: string;

  @Column({ length: 255 })
  token1: string;

  @ManyToOne(() => CexChain, (chain) => chain.pairs, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'source' })
  chain: CexChain;

  @OneToMany(() => CexJob, (job) => job.pair)
  jobs: CexJob[];
}
