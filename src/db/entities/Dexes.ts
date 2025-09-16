import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArbEvals } from './ArbEvals';
import { Quotes } from './Quotes';

@Index('dexes_chain_id_name_key', ['chainId', 'name'], { unique: true })
@Index('dexes_pkey', ['dexId'], { unique: true })
@Entity('dexes', { schema: 'public' })
export class Dexes {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'dex_id' })
  dexId: string;

  @Column('text', { name: 'name', unique: true })
  name: string;

  @Column('enum', {
    name: 'type',
    enum: ['univ2', 'univ3', 'balancer', 'solidly', 'other'],
  })
  type: 'univ2' | 'univ3' | 'balancer' | 'solidly' | 'other';

  @Column('integer', { name: 'chain_id', unique: true })
  chainId: number;

  @Column('text', { name: 'version', nullable: true })
  version: string | null;

  @Column('text', { name: 'router_addr', nullable: true })
  routerAddr: string | null;

  @Column('text', { name: 'quoter_addr', nullable: true })
  quoterAddr: string | null;

  @Column('text', { name: 'factory_addr', nullable: true })
  factoryAddr: string | null;

  @OneToMany(() => ArbEvals, (arbEvals) => arbEvals.dexBuy)
  arbEvals: ArbEvals[];

  @OneToMany(() => ArbEvals, (arbEvals) => arbEvals.dexSell)
  arbEvals2: ArbEvals[];

  @OneToMany(() => Quotes, (quotes) => quotes.dex)
  quotes: Quotes[];
}
