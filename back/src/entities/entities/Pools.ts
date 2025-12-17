import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Markets } from './Markets';
import { Tokens } from './Tokens';
import { Chains } from './Chains';
import { Dexes } from './Dexes';

@Index('pools_pkey', ['poolId'], { unique: true })
@Entity('pools', { schema: 'public' })
export class Pools {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'pool_id' })
  poolId: number;

  @Column('integer', { name: 'fee' })
  fee: number;

  @Column('character varying', { name: 'version', nullable: true, length: 2 })
  version: string | null;

  @Column('character varying', { name: 'pool_address', nullable: true })
  poolAddress: string | null;

  @OneToMany(() => Markets, (markets) => markets.pool)
  markets: Markets[];

  @ManyToOne(() => Tokens, (tokens) => tokens.pools, { onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'base_token_id', referencedColumnName: 'tokenId' }])
  baseToken: Tokens;

  @ManyToOne(() => Chains, (chains) => chains.pools, { onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'chain_id', referencedColumnName: 'chainId' }])
  chain: Chains;

  @ManyToOne(() => Dexes, (dexes) => dexes.pools, { onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'dex_id', referencedColumnName: 'dexId' }])
  dex: Dexes;

  @ManyToOne(() => Tokens, (tokens) => tokens.pools2, { onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'quote_token_id', referencedColumnName: 'tokenId' }])
  quoteToken: Tokens;
}
