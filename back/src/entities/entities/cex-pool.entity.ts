import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CexChain } from './cex-chain.entity';
import { CexJob } from './cex-job.entity';

@Entity('cex_pools')
export class CexPool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'source' })
  source: number;

  @Column({ length: 255 })
  token0: string;

  @Column({ length: 255 })
  token1: string;

  @ManyToOne(() => CexChain, (chain) => chain.pools, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'source' })
  chain: CexChain;

  @OneToMany(() => CexJob, (job) => job.pool)
  jobs: CexJob[];
}
