import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PairQuoteRelations } from './PairQuoteRelations';
import { Tokens } from './Tokens';

@Index('quotes_pkey', ['quoteId'], { unique: true })
@Index('idx_quotes_source', ['quoteSource'], {})
@Index('idx_quotes_token_side', ['side', 'tokenId'], {})
@Index('idx_quotes_token_id', ['tokenId'], {})
@Entity('quotes', { schema: 'public' })
export class Quotes {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'quote_id' })
  quoteId: string;

  @Column('bigint', { name: 'amount', nullable: true })
  amount: string | null;

  @Column('character varying', { name: 'side', nullable: true, length: 255 })
  side: string | null;

  @Column('character varying', {
    name: 'block_tag',
    nullable: true,
    length: 255,
  })
  blockTag: string | null;

  @Column('character varying', {
    name: 'quote_source',
    nullable: true,
    length: 255,
  })
  quoteSource: string | null;

  @Column('integer', { name: 'token_id', nullable: true })
  tokenId: number | null;

  @OneToMany(
    () => PairQuoteRelations,
    (pairQuoteRelations) => pairQuoteRelations.quote,
  )
  pairQuoteRelations: PairQuoteRelations[];

  @ManyToOne(() => Tokens, (tokens) => tokens.quotes, { onDelete: 'RESTRICT' })
  @JoinColumn([{ name: 'token_id', referencedColumnName: 'tokenId' }])
  token: Tokens;
}
