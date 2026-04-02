import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CexPair } from './cex-pair.entity';

@Entity('cex_chains')
export class CexChain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => CexPair, (pool) => pool.chain)
  pairs: CexPair[];
}
