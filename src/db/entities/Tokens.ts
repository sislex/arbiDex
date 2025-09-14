import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Markets } from './Markets';

@Index('tokens_chain_id_address_key', ['address', 'chainId'], { unique: true })
@Index('tokens_pkey', ['tokenId'], { unique: true })
@Entity('tokens', { schema: 'public' })
export class Tokens {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'token_id' })
  tokenId: string;

  @Column('integer', { name: 'chain_id', unique: true })
  chainId: number;

  @Column('text', { name: 'address', unique: true })
  address: string;

  @Column('text', { name: 'symbol' })
  symbol: string;

  @Column('smallint', { name: 'decimals' })
  decimals: number;

  @OneToMany(() => Markets, (markets) => markets.baseToken)
  markets: Markets[];

  @OneToMany(() => Markets, (markets) => markets.quoteToken)
  markets2: Markets[];
}
