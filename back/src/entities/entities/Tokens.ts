import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pools } from './Pools';
import { Chains } from './Chains';

@Index('tokens_pkey', ['tokenId'], { unique: true })
@Entity('tokens', { schema: 'public' })
export class Tokens {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'token_id' })
  tokenId: number;

  @Column('character varying', { name: 'address', length: 255 })
  address: string;

  @Column('character varying', { name: 'symbol', length: 50 })
  symbol: string;

  @Column('integer', { name: 'decimals' })
  decimals: number;

  @OneToMany(() => Pools, (pools) => pools.baseToken)
  pools: Pools[];

  @OneToMany(() => Pools, (pools) => pools.quoteToken)
  pools2: Pools[];

  @ManyToOne(() => Chains, (chains) => chains.tokens, { onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'chain_id', referencedColumnName: 'chainId' }])
  chain: Chains;
}
