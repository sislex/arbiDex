import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Jobs } from './Jobs';
import { Chains } from './Chains';

@Index('idx_rpc_urls_chain_id', ['chainId'], {})
@Index('unique_rpc_per_chain', ['chainId', 'rpcUrl'], { unique: true })
@Index('rpc_urls_pkey', ['rpcUrlId'], { unique: true })
@Entity('rpc_urls', { schema: 'public' })
export class RpcUrls {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'rpc_url_id' })
  rpcUrlId: number;

  @Column('text', { name: 'rpc_url' })
  rpcUrl: string;

  @Column('integer', { name: 'chain_id' })
  chainId: number;

  @OneToMany(() => Jobs, (jobs) => jobs.rpcUrl)
  jobs: Jobs[];

  @ManyToOne(() => Chains, (chains) => chains.rpcUrls, { onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'chain_id', referencedColumnName: 'chainId' }])
  chain: Chains;
}
