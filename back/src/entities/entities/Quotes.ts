import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PairQuoteRelations } from "./PairQuoteRelations";

@Index("quotes_pkey", ["quoteId"], { unique: true })
@Entity("quotes", { schema: "public" })
export class Quotes {
  @PrimaryGeneratedColumn({ type: "bigint", name: "quote_id" })
  quoteId: string;

  @Column("bigint", { name: "amount", nullable: true })
  amount: string | null;

  @Column("character varying", { name: "side", nullable: true, length: 255 })
  side: string | null;

  @Column("character varying", {
    name: "block_tag",
    nullable: true,
    length: 255,
  })
  blockTag: string | null;

  @Column("character varying", {
    name: "quote_source",
    nullable: true,
    length: 255,
  })
  quoteSource: string | null;

  @OneToMany(
    () => PairQuoteRelations,
    (pairQuoteRelations) => pairQuoteRelations.quote
  )
  pairQuoteRelations: PairQuoteRelations[];
}
