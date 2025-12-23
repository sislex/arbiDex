import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PairQuoteRelations } from './PairQuoteRelations';
import { Pools } from './Pools';

@Index('pairs_pkey', ['pairId'], { unique: true })
@Entity('pairs', { schema: 'public' })
export class Pairs {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pair_id' })
  pairId: string;

  @Column('bigint', { name: 'token_in' })
  tokenIn: string;

  @Column('bigint', { name: 'token_out' })
  tokenOut: string;

  @OneToMany(
    () => PairQuoteRelations,
    (pairQuoteRelations) => pairQuoteRelations.pair,
  )
  pairQuoteRelations: PairQuoteRelations[];

  @ManyToOne(() => Pools, (pools) => pools.pairs, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'pool_id', referencedColumnName: 'poolId' }])
  pool: Pools;
}
