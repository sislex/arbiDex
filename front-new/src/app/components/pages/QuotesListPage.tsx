import { ChevronRight, Copy, Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectPairsMeta,
  selectPairsDataResponse,
  selectQuotesMeta,
  selectQuotesDataResponse,
  selectTokensMeta,
  selectTokensDataResponse,
} from '../../store/db-config/dbConfig.selectors';
import { showDeleteToast } from '../../utils/toast';
import { apiService } from '../../services/api-service';
import { QuoteForm, type QuoteFormValues } from '../forms/QuoteForm';

interface QuotesListPageProps {
  language: 'en' | 'ru';
  onQuoteClick: (quoteId: number, quoteName: string) => void;
}

const DELETE_UNDO_MS = 5000;

export function QuotesListPage({ language, onQuoteClick }: QuotesListPageProps) {
  const dispatch = useAppDispatch();
  const quotesFromStore = useAppSelector(selectQuotesDataResponse);
  const quotesMeta = useAppSelector(selectQuotesMeta);
  const pairsMeta = useAppSelector(selectPairsMeta);
  const tokensMeta = useAppSelector(selectTokensMeta);
  const tokens = useAppSelector(selectTokensDataResponse);
  const pairs = useAppSelector(selectPairsDataResponse);
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuoteRaw, setEditingQuoteRaw] = useState<any>(null);
  const [copiedQuoteInitialData, setCopiedQuoteInitialData] = useState<QuoteFormValues | undefined>(undefined);
  const [pendingDeleteQuoteIds, setPendingDeleteQuoteIds] = useState<Set<number>>(new Set());
  const deleteQuoteTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const buildQuoteInitialData = (quote: any): QuoteFormValues => ({
    amount: String(quote.amount ?? ''),
    blockTag: 'latest',
    side: 'exactIn',
    quoteSource: String(quote.quoteSource ?? quote.quote_source ?? quote.source ?? ''),
    quoteTokenId: String(quote.token ?? quote.tokenId ?? quote.quoteTokenId ?? quote.quote_token_id ?? ''),
  });

  useEffect(() => {
    if ((!quotesMeta.isLoaded || quotesMeta.error) && !quotesMeta.isLoading) {
      dispatch(dbConfigActions.initQuotesListPage());
    }

    if ((!pairsMeta.isLoaded || pairsMeta.error) && !pairsMeta.isLoading) {
      dispatch(dbConfigActions.setPairsData());
    }
  }, [dispatch, pairsMeta.error, pairsMeta.isLoaded, pairsMeta.isLoading, quotesMeta.error, quotesMeta.isLoaded, quotesMeta.isLoading]);

  useEffect(() => {
    if ((!tokensMeta.isLoaded || tokensMeta.error) && !tokensMeta.isLoading) {
      dispatch(dbConfigActions.setTokensData());
    }
  }, [dispatch, tokensMeta.error, tokensMeta.isLoaded, tokensMeta.isLoading]);

  useEffect(() => {
    return () => {
      deleteQuoteTimeoutsRef.current.forEach(clearTimeout);
      deleteQuoteTimeoutsRef.current.clear();
    };
  }, []);

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
      .filter((quote) => !pendingDeleteQuoteIds.has(quote.id));
  }, [pairCountByQuoteId, pendingDeleteQuoteIds, quotesFromStore, tokenById]);

  const t = {
    en: {
      id: 'ID',
      amount: 'Amount',
      side: 'Side',
      blockTag: 'Block Tag',
      quoteSource: 'Quote source',
      quoteToken: 'Qouote Token',
      pairsCount: 'Pairs count',
      tableTitle: 'Quotes',
    },
    ru: {
      id: 'ID',
      amount: 'Сумма',
      side: 'Сторона',
      blockTag: 'Блок',
      quoteSource: 'Источник',
      quoteToken: 'Токен котировки',
      pairsCount: 'Кол-во пар',
      tableTitle: 'Котировки',
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
        title={t[language].tableTitle}
        headerActions={
          <button
            onClick={() => {
              setEditingQuoteRaw(null);
              setCopiedQuoteInitialData(undefined);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">{language === 'en' ? 'Add Quote' : 'Добавить Quote'}</span>
          </button>
        }
        columns={columns}
        data={quotes}
        language={language}
        isLoading={quotesMeta.isLoading || tokensMeta.isLoading || pairsMeta.isLoading}
        loadingText="Loading Quotes…"
        onEdit={(row) => {
          setEditingQuoteRaw(row.raw ?? row);
          setCopiedQuoteInitialData(undefined);
          setFormOpen(true);
        }}
        onDelete={(row) => {
          setPendingDeleteQuoteIds((prev) => new Set(prev).add(row.id));
          const existing = deleteQuoteTimeoutsRef.current.get(row.id);
          if (existing) clearTimeout(existing);

          const tid = setTimeout(async () => {
            deleteQuoteTimeoutsRef.current.delete(row.id);
            try {
              await apiService.deletingQuote(row.id);
              dispatch(dbConfigActions.refetchQuotesListPageResources());
            } finally {
              setPendingDeleteQuoteIds((prev) => {
                const next = new Set(prev);
                next.delete(row.id);
                return next;
              });
            }
          }, DELETE_UNDO_MS);
          deleteQuoteTimeoutsRef.current.set(row.id, tid);

          showDeleteToast({
            itemName: row.quoteSource || String(row.id),
            itemType: language === 'en' ? 'Quote' : 'Quote',
            onUndo: () => {
              const scheduled = deleteQuoteTimeoutsRef.current.get(row.id);
              if (scheduled) clearTimeout(scheduled);
              deleteQuoteTimeoutsRef.current.delete(row.id);
              setPendingDeleteQuoteIds((prev) => {
                const next = new Set(prev);
                next.delete(row.id);
                return next;
              });
            },
            language,
          });
        }}
        extraActions={(row) => (
          <>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setEditingQuoteRaw(null);
                setCopiedQuoteInitialData(buildQuoteInitialData(row.raw ?? row));
                setFormOpen(true);
              }}
              className="p-1.5 hover:bg-accent rounded transition-colors"
              title={language === 'ru' ? 'Копировать' : 'Copy'}
            >
              <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
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
          </>
        )}
        onRowDoubleClick={(row) => onQuoteClick(row.id, row.quoteSource || String(row.id))}
      />

      <QuoteForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingQuoteRaw(null);
          setCopiedQuoteInitialData(undefined);
        }}
        onSave={async (data) => {
          const payload = {
            amount: data.amount.trim(),
            blockTag: 'latest',
            side: 'exactIn',
            quoteSource: data.quoteSource.trim(),
            token: Number(data.quoteTokenId),
          };
          if (editingQuoteRaw) {
            const id = Number(editingQuoteRaw.quoteId ?? editingQuoteRaw.id);
            await apiService.editQuote(id, payload);
          } else {
            await apiService.createQuote(payload);
          }
          dispatch(dbConfigActions.refetchQuotesListPageResources());
        }}
        initialData={
          copiedQuoteInitialData ?? (editingQuoteRaw ? buildQuoteInitialData(editingQuoteRaw) : undefined)
        }
        language={language}
      />
    </div>
  );
}
