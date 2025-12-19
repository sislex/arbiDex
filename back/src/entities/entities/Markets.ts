import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MarketJobRelations } from './MarketJobRelations';
import { Pools } from './Pools';

@Index('markets_pkey', ['marketId'], { unique: true })
@Entity('markets', { schema: 'public' })
export class Markets {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'market_id' })
  marketId: number;

  @Column('bigint', { name: 'amount', default: () => '0' })
  amount: string;

  @OneToMany(
    () => MarketJobRelations,
    (marketJobRelations) => marketJobRelations.market,
  )
  marketJobRelations: MarketJobRelations[];

  @ManyToOne(() => Pools, (pools) => pools.markets, { onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'pool_id', referencedColumnName: 'poolId' }])
  pool: Pools;
}
