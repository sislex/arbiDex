import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Dexes } from './Dexes';
import { Markets } from './Markets';

@Index('arb_evals_pkey', ['id'], { unique: true })
@Index('arb_mkt_ts_idx', ['marketId', 'ts'], {})
@Index('arb_evals_snapshot_id_key', ['snapshotId'], { unique: true })
@Index('arb_ts_idx', ['ts'], {})
@Entity('arb_evals', { schema: 'public' })
export class ArbEvals {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('uuid', { name: 'snapshot_id', unique: true })
  snapshotId: string;

  @Column('timestamp with time zone', { name: 'ts' })
  ts: Date;

  @Column('integer', { name: 'chain_id' })
  chainId: number;

  @Column('bigint', { name: 'market_id' })
  marketId: string;

  @Column('text', { name: 'direction' })
  direction: string;

  @Column('boolean', { name: 'should_trade' })
  shouldTrade: boolean;

  @Column('numeric', { name: 'gross_quote', precision: 38, scale: 0 })
  grossQuote: string;

  @Column('numeric', { name: 'net_quote', precision: 38, scale: 0 })
  netQuote: string;

  @Column('numeric', { name: 'gas_quote', precision: 38, scale: 0 })
  gasQuote: string;

  @Column('numeric', { name: 'min_profit_quote', precision: 38, scale: 0 })
  minProfitQuote: string;

  @Column('integer', { name: 'gross_bps' })
  grossBps: number;

  @Column('integer', { name: 'net_bps' })
  netBps: number;

  @ManyToOne(() => Dexes, (dexes) => dexes.arbEvals, { onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'dex_buy_id', referencedColumnName: 'dexId' }])
  dexBuy: Dexes;

  @ManyToOne(() => Dexes, (dexes) => dexes.arbEvals2, { onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'dex_sell_id', referencedColumnName: 'dexId' }])
  dexSell: Dexes;

  @ManyToOne(() => Markets, (markets) => markets.arbEvals, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'market_id', referencedColumnName: 'marketId' }])
  market: Markets;
}
