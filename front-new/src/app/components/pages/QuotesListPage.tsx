import { ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectPairsMeta,
  selectPairsDataResponse,
  selectQuotesMeta,
  selectQuotesDataResponse,
  selectTokensDataResponse,
} from '../../store/db-config/dbConfig.selectors';
import { showDeleteToast } from '../../utils/toast';

interface QuotesListPageProps {
  language: 'en' | 'ru';
  onQuoteClick: (quoteId: number, quoteName: string) => void;
}

export function QuotesListPage({ language, onQuoteClick }: QuotesListPageProps) {
  const dispatch = useAppDispatch();
  const quotesFromStore = useAppSelector(selectQuotesDataResponse);
  const quotesMeta = useAppSelector(selectQuotesMeta);
  const pairsMeta = useAppSelector(selectPairsMeta);
  const tokens = useAppSelector(selectTokensDataResponse);
  const pairs = useAppSelector(selectPairsDataResponse);
  const [deletedQuoteIds, setDeletedQuoteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if ((!quotesMeta.isLoaded || quotesMeta.error) && !quotesMeta.isLoading) {
      dispatch(dbConfigActions.initQuotesListPage());
    }

    if ((!pairsMeta.isLoaded || pairsMeta.error) && !pairsMeta.isLoading) {
      dispatch(dbConfigActions.setPairsData());
    }
  }, [dispatch, pairsMeta.error, pairsMeta.isLoaded, pairsMeta.isLoading, quotesMeta.error, quotesMeta.isLoaded, quotesMeta.isLoading]);

  const tokenById = useMemo(() => {
    return new Map(tokens.map((token: any) => [token.tokenId ?? token.id, token]));
  }, [tokens]);

  const pairCountByQuoteId = useMemo(() => {
    const counts = new Map<number, number>();
    pairs.forEach((pair: any) => {
      const quoteId = pair.quoteId ?? pair.quote_id;
      if (quoteId !== undefined && quoteId !== null) {
        counts.set(quoteId, (counts.get(quoteId) ?? 0) + 1);
      }
    });
    return counts;
  }, [pairs]);

  const quotes = useMemo(() => {
    return quotesFromStore
      .map((quote: any) => {
        const id = quote.quoteId ?? quote.id;
        const token = tokenById.get(quote.tokenId ?? quote.quoteTokenId ?? quote.quote_token_id);

        return {
          id,
          amount: quote.amount ?? '',
          side: quote.side ?? '',
          blockTag: quote.blockTag ?? quote.block_tag ?? '',
          quoteSource: quote.quoteSource ?? quote.quote_source ?? quote.source ?? quote.quoteName ?? '',
          quoteToken: quote.quoteToken ?? quote.quote_token ?? token?.symbol ?? token?.tokenName ?? '',
          pairsCount: quote.pairsCount ?? quote.pairs_count ?? pairCountByQuoteId.get(id) ?? 0,
          raw: quote,
        };
      })
      .filter((quote) => !deletedQuoteIds.has(quote.id));
  }, [deletedQuoteIds, pairCountByQuoteId, quotesFromStore, tokenById]);

  const t = {
    en: {
      id: 'ID',
      amount: 'Amount',
      side: 'Side',
      blockTag: 'Block Tag',
      quoteSource: 'Quote source',
      quoteToken: 'Qouote Token',
      pairsCount: 'Pairs count',
    },
    ru: {
      id: 'ID',
      amount: 'Amount',
      side: 'Side',
      blockTag: 'Block Tag',
      quoteSource: 'Quote source',
      quoteToken: 'Qouote Token',
      pairsCount: 'Pairs count',
    },
  };

  const columns: Column[] = [
    { key: 'id', label: t[language].id, sortable: true, filterable: true },
    { key: 'amount', label: t[language].amount, sortable: true, filterable: true },
    { key: 'side', label: t[language].side, sortable: true, filterable: true },
    { key: 'blockTag', label: t[language].blockTag, sortable: true, filterable: true },
    { key: 'quoteSource', label: t[language].quoteSource, sortable: true, filterable: true },
    { key: 'quoteToken', label: t[language].quoteToken, sortable: true, filterable: true },
    { key: 'pairsCount', label: t[language].pairsCount, sortable: true, filterable: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title="Quotes"
        columns={columns}
        data={quotes}
        onEdit={(row) => console.log('Edit', row)}
        onDelete={(row) => {
          setDeletedQuoteIds(new Set([...deletedQuoteIds, row.id]));
          showDeleteToast({
            itemName: row.quoteSource || String(row.id),
            itemType: language === 'en' ? 'Quote' : 'Quote',
            onUndo: () => {
              const next = new Set(deletedQuoteIds);
              next.delete(row.id);
              setDeletedQuoteIds(next);
            },
            language,
          });
        }}
        extraActions={(row) => (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onQuoteClick(row.id, row.quoteSource || String(row.id));
            }}
            className="p-1.5 hover:bg-accent rounded transition-colors"
            title="Edit Relations"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        onRowClick={(row) => onQuoteClick(row.id, row.quoteSource || String(row.id))}
      />
    </div>
  );
}
