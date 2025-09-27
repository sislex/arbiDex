import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DexPools } from "./DexPools";
import { Tokens } from "./Tokens";
import { Quotes } from "./Quotes";

@Index(
  "markets_chain_id_base_token_id_quote_token_id_key",
  ["baseTokenId", "chainId", "quoteTokenId"],
  { unique: true }
)
@Index("markets_pkey", ["marketId"], { unique: true })
@Entity("markets", { schema: "public" })
export class Markets {
  @PrimaryGeneratedColumn({ type: "bigint", name: "market_id" })
  marketId: string;

  @Column("integer", { name: "chain_id", unique: true })
  chainId: number;

  @Column("bigint", { name: "base_token_id", unique: true })
  baseTokenId: string;

  @Column("bigint", { name: "quote_token_id", unique: true })
  quoteTokenId: string;

  @OneToMany(() => DexPools, (dexPools) => dexPools.market)
  dexPools: DexPools[];

  @ManyToOne(() => Tokens, (tokens) => tokens.markets, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "base_token_id", referencedColumnName: "tokenId" }])
  baseToken: Tokens;

  @ManyToOne(() => Tokens, (tokens) => tokens.markets2, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "quote_token_id", referencedColumnName: "tokenId" }])
  quoteToken: Tokens;

  @OneToMany(() => Quotes, (quotes) => quotes.market)
  quotes: Quotes[];
}
