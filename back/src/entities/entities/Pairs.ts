import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PairQuoteRelations } from './PairQuoteRelations';

@Index('pairs_pkey', ['pairId'], { unique: true })
@Entity('pairs', { schema: 'public' })
export class Pairs {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pair_id' })
  pairId: string;

  @Column('bigint', { name: 'pool_id' })
  poolId: string;

  @Column('bigint', { name: 'token_in' })
  tokenIn: string;

  @Column('bigint', { name: 'token_out' })
  tokenOut: string;

  @OneToMany(
    () => PairQuoteRelations,
    (pairQuoteRelations) => pairQuoteRelations.pair,
  )
  pairQuoteRelations: PairQuoteRelations[];
}
