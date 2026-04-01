import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CexPool } from './cex-pool.entity';

@Entity('cex_chains')
export class CexChain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => CexPool, (pool) => pool.chain)
  pools: CexPool[];
}
