import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("arb_evals_pkey", ["id"], { unique: true })
@Index("arb_evals_quote_id_uq", ["quoteId"], { unique: true })
@Entity("arb_evals", { schema: "public" })
export class ArbEvals {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "quote_id", unique: true })
  quoteId: string;

  @Column("numeric", { name: "best_buy", precision: 38, scale: 0 })
  bestBuy: string;

  @Column("numeric", { name: "best_sell", precision: 38, scale: 0 })
  bestSell: string;

  @Column("bigint", { name: "dex_id_buy" })
  dexIdBuy: string;

  @Column("bigint", { name: "dex_id_sell" })
  dexIdSell: string;

  @Column("numeric", { name: "gross_quote", precision: 38, scale: 0 })
  grossQuote: string;

  @Column("numeric", { name: "gas_cost", precision: 38, scale: 0 })
  gasCost: string;

  @Column("numeric", { name: "net_profit", precision: 38, scale: 0 })
  netProfit: string;

  @Column("numeric", {
    name: "spread_pct",
    nullable: true,
    precision: 12,
    scale: 6,
  })
  spreadPct: string | null;

  @Column("boolean", {
    name: "should_trade",
    nullable: true,
    default: () => "false",
  })
  shouldTrade: boolean | null;

  @Column("timestamp with time zone", {
    name: "created_ts",
    nullable: true,
    default: () => "now()",
  })
  createdTs: Date | null;
}
