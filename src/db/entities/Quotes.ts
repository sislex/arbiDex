import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Dexes } from "./Dexes";
import { Markets } from "./Markets";

@Index(
  "quotes_market_dex_side_kind_ts_idx",
  ["dexId", "kind", "marketId", "side", "ts"],
  {}
)
@Index("quotes_dex_ts_idx", ["dexId", "ts"], {})
@Index("quotes_snapshot_id_dex_id_side_key", ["dexId", "side", "snapshotId"], {
  unique: true,
})
@Index("quotes_pkey", ["id"], { unique: true })
@Index("quotes_mkt_ts_idx", ["marketId", "ts"], {})
@Index("quotes_ok_idx", ["ok"], {})
@Index("quotes_snapshot_idx", ["snapshotId"], {})
@Index("quotes_ts_idx", ["ts"], {})
@Entity("quotes", { schema: "public" })
export class Quotes {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("uuid", {
    name: "snapshot_id",
    unique: true,
    default: () => "gen_random_uuid()",
  })
  snapshotId: string;

  @Column("timestamp with time zone", { name: "ts", default: () => "now()" })
  ts: Date;

  @Column("integer", { name: "chain_id" })
  chainId: number;

  @Column("bigint", { name: "dex_id", unique: true })
  dexId: string;

  @Column("bigint", { name: "market_id" })
  marketId: string;

  @Column("enum", {
    name: "side",
    unique: true,
    enum: ["SELL_BASE", "BUY_BASE"],
  })
  side: "SELL_BASE" | "BUY_BASE";

  @Column("enum", { name: "kind", enum: ["EXACT_IN", "EXACT_OUT"] })
  kind: "EXACT_IN" | "EXACT_OUT";

  @Column("integer", { name: "fee_tier", nullable: true })
  feeTier: number | null;

  @Column("numeric", { name: "amount_base", precision: 78, scale: 0 })
  amountBase: string;

  @Column("numeric", { name: "amount_quote", precision: 38, scale: 0 })
  amountQuote: string;

  @Column("boolean", { name: "ok", default: () => "true" })
  ok: boolean;

  @Column("text", { name: "error_message", nullable: true })
  errorMessage: string | null;

  @Column("integer", { name: "latency_ms", nullable: true })
  latencyMs: number | null;

  @Column("numeric", {
    name: "gas_quote",
    nullable: true,
    precision: 38,
    scale: 0,
  })
  gasQuote: string | null;

  @Column("bigint", { name: "block_number", nullable: true })
  blockNumber: string | null;

  @ManyToOne(() => Dexes, (dexes) => dexes.quotes, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "dex_id", referencedColumnName: "dexId" }])
  dex: Dexes;

  @ManyToOne(() => Markets, (markets) => markets.quotes, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "market_id", referencedColumnName: "marketId" }])
  market: Markets;
}
