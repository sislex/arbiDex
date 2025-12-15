import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pools } from "./Pools";

@Index("markets_pkey", ["marketId"], { unique: true })
@Entity("markets", { schema: "public" })
export class Markets {
  @PrimaryGeneratedColumn({ type: "integer", name: "market_id" })
  marketId: number;

  @Column("bigint", { name: "amount", default: () => "0" })
  amount: string;

  @ManyToOne(() => Pools, (pools) => pools.markets, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "pool_id", referencedColumnName: "poolId" }])
  pool: Pools;
}
