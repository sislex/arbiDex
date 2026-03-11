import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pairs } from './Pairs';
import { Quotes } from './Quotes';
import { QuoteJobRelations } from './QuoteJobRelations';

@Index('idx_pair_quote_rel_pair_id', ['pairId'], {})
@Index('unique_pair_quote_link', ['pairId', 'quoteId'], { unique: true })
@Index('pair_quote_relations_pkey', ['pairQuoteRelationId'], { unique: true })
@Index('idx_pair_quote_rel_quote_id', ['quoteId'], {})
@Entity('pair_quote_relations', { schema: 'public' })
export class PairQuoteRelations {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pair_quote_relation_id' })
  pairQuoteRelationId: string;

  @Column({ type: 'bigint', name: 'pair_id' })
  pairId: string;

  @Column({ type: 'bigint', name: 'quote_id' })
  quoteId: string;

  @ManyToOne(() => Pairs, (pairs) => pairs.pairQuoteRelations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'pair_id', referencedColumnName: 'pairId' }])
  pair: Pairs;

  @ManyToOne(() => Quotes, (quotes) => quotes.pairQuoteRelations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'quote_id', referencedColumnName: 'quoteId' }])
  quote: Quotes;

  @OneToMany(
    () => QuoteJobRelations,
    (quoteJobRelations) => quoteJobRelations.quoteRelation,
  )
  quoteJobRelations: QuoteJobRelations[];
}
