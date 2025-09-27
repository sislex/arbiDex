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

@Index("idx_dex_pools_dex", ["dexId"], {})
@Index("dex_pools_unique", ["dexId", "feeTier", "marketId", "poolAddress"], {
  unique: true,
})
@Index("idx_dex_pools_active", ["isActive"], {})
@Index("idx_dex_pools_last_seen", ["lastSeenTs"], {})
@Index("idx_dex_pools_market", ["marketId"], {})
@Index("dex_pools_pkey", ["poolId"], { unique: true })
@Entity("dex_pools", { schema: "public" })
export class DexPools {
  @PrimaryGeneratedColumn({ type: "bigint", name: "pool_id" })
  poolId: string;

  @Column("bigint", { name: "dex_id", unique: true })
  dexId: string;

  @Column("bigint", { name: "market_id", unique: true })
  marketId: string;

  @Column("text", { name: "pool_address", unique: true })
  poolAddress: string;

  @Column("integer", { name: "fee_tier", nullable: true, unique: true })
  feeTier: number | null;

  @Column("integer", { name: "tick_spacing", nullable: true })
  tickSpacing: number | null;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true",
  })
  isActive: boolean | null;

  @Column("timestamp with time zone", {
    name: "created_ts",
    nullable: true,
    default: () => "now()",
  })
  createdTs: Date | null;

  @Column("timestamp with time zone", {
    name: "last_seen_ts",
    nullable: true,
    default: () => "now()",
  })
  lastSeenTs: Date | null;

  @Column("numeric", {
    name: "liquidity_raw",
    nullable: true,
    precision: 78,
    scale: 0,
  })
  liquidityRaw: string | null;

  @Column("numeric", {
    name: "tvl_usd",
    nullable: true,
    precision: 38,
    scale: 2,
  })
  tvlUsd: string | null;

  @Column("numeric", {
    name: "amount_base",
    nullable: true,
    default: () => "0",
  })
  amountBase: string | null;

  @ManyToOne(() => Dexes, (dexes) => dexes.dexPools, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "dex_id", referencedColumnName: "dexId" }])
  dex: Dexes;

  @ManyToOne(() => Markets, (markets) => markets.dexPools, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "market_id", referencedColumnName: "marketId" }])
  market: Markets;
}
