import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pairs } from "./Pairs";
import { Pools } from "./Pools";
import { SwapRate } from "./SwapRate";
import { Chains } from "./Chains";

@Index("unique_token_address", ["address"], { unique: true })
@Index("tokens_pkey", ["tokenId"], { unique: true })
@Entity("tokens", { schema: "public" })
export class Tokens {
  @PrimaryGeneratedColumn({ type: "integer", name: "token_id" })
  tokenId: number;

  @Column("character varying", { name: "address", unique: true, length: 255 })
  address: string;

  @Column("character varying", { name: "symbol", length: 50 })
  symbol: string;

  @Column("integer", { name: "decimals" })
  decimals: number;

  @Column("character varying", { name: "token_name", nullable: true })
  tokenName: string | null;

  @Column("boolean", { name: "is_active", nullable: true })
  isActive: boolean | null;

  @Column("boolean", { name: "is_checked", nullable: true })
  isChecked: boolean | null;

  @Column("boolean", { name: "balance", nullable: true })
  balance: boolean | null;

  @OneToMany(() => Pairs, (pairs) => pairs.tokenIn)
  pairs: Pairs[];

  @OneToMany(() => Pairs, (pairs) => pairs.tokenOut)
  pairs2: Pairs[];

  @OneToMany(() => Pools, (pools) => pools.token)
  pools: Pools[];

  @OneToMany(() => Pools, (pools) => pools.token2)
  pools2: Pools[];

  @OneToMany(() => SwapRate, (swapRate) => swapRate.swapRateToken)
  swapRates: SwapRate[];

  @OneToMany(() => SwapRate, (swapRate) => swapRate.swapRateToken2)
  swapRates2: SwapRate[];

  @ManyToOne(() => Chains, (chains) => chains.tokens, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "chain_id", referencedColumnName: "chainId" }])
  chain: Chains;
}
