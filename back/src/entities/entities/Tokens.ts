import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pairs } from './Pairs';
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

  @Column('character varying', { name: 'token_name', nullable: true })
  tokenName: string | null;

  @OneToMany(() => Pairs, (pairs) => pairs.tokenIn)
  pairs: Pairs[];

  @OneToMany(() => Pairs, (pairs) => pairs.tokenOut)
  pairs2: Pairs[];

  @OneToMany(() => Pools, (pools) => pools.token)
  pools: Pools[];

  @OneToMany(() => Pools, (pools) => pools.token2)
  pools2: Pools[];

  @ManyToOne(() => Chains, (chains) => chains.tokens, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'chain_id', referencedColumnName: 'chainId' }])
  chain: Chains;
}
