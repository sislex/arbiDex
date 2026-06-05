import { Menu, Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { showBulkDeleteToast, showDeleteToast } from '../../utils/toast';
import {
  buildBulkDeleteKey,
  cancelPendingDelete,
  schedulePendingDelete,
} from '../../utils/pendingDeleteScheduler';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectChainsDataResponse,
  selectChainsMeta,
  selectTokensDataResponse,
  selectTokensMeta,
} from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';
import { normalizeDexTokenForStore } from '../../utils/dexToken';
import { DexTokenForm } from '../forms/DexTokenForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const TOKENS_DELETE_SCOPE = 'tokens';

function mapTokenRow(token: any, rawToken?: any) {
  return {
    id: token.tokenId ?? token.id,
    name: token.tokenName,
    chainName: token.chainName ?? token.chainId ?? '',
    address: token.address,
    symbol: token.symbol,
    decimals: token.decimals,
    isActive: token.isActive,
    isChecked: token.isChecked ?? token.is_checked ?? token.checked ?? false,
    balance: token.balance ?? '',
    raw: rawToken ?? token,
  };
}

export function TokensPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const tokensRaw = useAppSelector(selectTokensDataResponse);
  const chainsRaw = useAppSelector(selectChainsDataResponse);
  const tokensMeta = useAppSelector(selectTokensMeta);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTokenRaw, setEditingTokenRaw] = useState<any>(null);
  const [pendingDeleteTokenIds, setPendingDeleteTokenIds] = useState<Set<number>>(new Set());
  const [selectedTokenIds, setSelectedTokenIds] = useState<Set<number>>(new Set());
  const [tableRows, setTableRows] = useState<ReturnType<typeof mapTokenRow>[]>([]);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const tokensFromStoreRef = useRef<any[] | null>(null);

  useEffect(() => {
    if ((!tokensMeta.isLoaded || tokensMeta.error) && !tokensMeta.isLoading) {
      dispatch(dbConfigActions.initTokensListPage());
    }
  }, [dispatch, tokensMeta.error, tokensMeta.isLoaded, tokensMeta.isLoading]);

  const chainNameById = useMemo(() => {
    const map = new Map<number, string>();
    chainsRaw.forEach((chain: any) => {
      const id = Number(chain.chainId ?? chain.id);
      if (Number.isFinite(id)) {
        map.set(id, chain.name ?? chain.chainName ?? String(id));
      }
    });
    return map;
  }, [chainsRaw]);

  const enrichTokenRow = useCallback(
    (token: any) =>
      mapTokenRow(
        {
          ...token,
          chainName: chainNameById.get(Number(token.chainId)) ?? token.chainId,
        },
        token,
      ),
    [chainNameById],
  );

  useEffect(() => {
    const prevStore = tokensFromStoreRef.current;
    const nextStore = tokensRaw;
    tokensFromStoreRef.current = nextStore;

    if (!prevStore) {
      setTableRows(nextStore.map(enrichTokenRow));
      return;
    }

    const prevLen = prevStore.length;
    const nextLen = nextStore.length;

    if (prevLen > 0 && nextLen < prevLen) {
      const nextIds = new Set(nextStore.map((token: any) => Number(token.tokenId ?? token.id)));
      setTableRows((current) => current.filter((row) => nextIds.has(row.id)));
      return;
    }

    if (prevLen === nextLen && prevStore === nextStore) {
      return;
    }

    setTableRows(nextStore.map(enrichTokenRow));
  }, [enrichTokenRow, tokensRaw]);

  const visibleTokenIds = useMemo(() => {
    if (pendingDeleteTokenIds.size === 0) {
      return tableRows.map((token) => token.id);
    }
    const ids: number[] = [];
    for (const token of tableRows) {
      if (!pendingDeleteTokenIds.has(token.id)) {
        ids.push(token.id);
      }
    }
    return ids;
  }, [pendingDeleteTokenIds, tableRows]);

  const allTokenIds = visibleTokenIds;
  const allSelected = allTokenIds.length > 0 && allTokenIds.every((id) => selectedTokenIds.has(id));
  const someSelected = allTokenIds.some((id) => selectedTokenIds.has(id));

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) {
      el.indeterminate = someSelected && !allSelected;
    }
  }, [allSelected, someSelected]);

  const updatePendingDeleteTokenIds = useCallback((updater: (prev: Set<number>) => Set<number>) => {
    startTransition(() => {
      setPendingDeleteTokenIds(updater);
    });
  }, []);

  const toggleToken = useCallback((id: number) => {
    setSelectedTokenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllTokens = useCallback(() => {
    setSelectedTokenIds(allSelected ? new Set() : new Set(allTokenIds));
  }, [allSelected, allTokenIds]);

  const t = {
    en: {
      add: 'Add Token',
      id: 'ID',
      name: 'Name',
      chainName: 'Chain Name',
      address: 'Address',
      symbol: 'Symbol',
      decimals: 'Decimals',
      isActive: 'Is Active',
      isChecked: 'Is Checked',
      balance: 'Balance',
      tableTitle: 'Tokens',
      actions: 'Actions',
      deleteSelected: 'Delete selected',
      deleteFailed: 'Failed to delete tokens',
      deleteType: 'Token',
    },
    ru: {
      add: 'Добавить токен',
      id: 'ID',
      name: 'Название',
      chainName: 'Сеть',
      address: 'Адрес',
      symbol: 'Символ',
      decimals: 'Десятичные',
      isActive: 'Активен',
      isChecked: 'Проверен',
      balance: 'Баланс',
      tableTitle: 'Токены',
      actions: 'Действия',
      deleteSelected: 'Удалить выбранные',
      deleteFailed: 'Не удалось удалить токены',
      deleteType: 'Токен',
    },
  };

  const renderBoolean = (value: boolean) => (
    <span
      className={`px-2 py-0.5 rounded text-xs ${
        value ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
      }`}
    >
      {value ? 'true' : 'false'}
    </span>
  );

  const scheduleDelete = useCallback(
    (row: { id: number; symbol: string }) => {
      updatePendingDeleteTokenIds((prev) => new Set(prev).add(row.id));
      setSelectedTokenIds((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });

      const deleteKey = `${TOKENS_DELETE_SCOPE}:${row.id}`;

      schedulePendingDelete(deleteKey, async () => {
        const result = await apiService.bulkDeleteTokens([row.id]);
        dispatch(dbConfigActions.removeTokensByIds(result.deletedIds ?? [row.id]));
        updatePendingDeleteTokenIds((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      });

      showDeleteToast({
        itemName: row.symbol,
        itemType: t[language].deleteType,
        onUndo: () => {
          cancelPendingDelete(deleteKey);
          updatePendingDeleteTokenIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        },
        language,
      });
    },
    [dispatch, language, t, updatePendingDeleteTokenIds],
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedTokenIds.size === 0) return;

    const deleteIds = [...selectedTokenIds];

    updatePendingDeleteTokenIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedTokenIds(new Set());

    const bulkDeleteKey = buildBulkDeleteKey(TOKENS_DELETE_SCOPE, deleteIds);

    schedulePendingDelete(bulkDeleteKey, async () => {
      const result = await apiService.bulkDeleteTokens(deleteIds);
      if (!result?.success) {
        throw new Error(t[language].deleteFailed);
      }
      dispatch(dbConfigActions.removeTokensByIds(result.deletedIds ?? deleteIds));
      updatePendingDeleteTokenIds((prev) => {
        const next = new Set(prev);
        deleteIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    showBulkDeleteToast({
      count: deleteIds.length,
      itemType: language === 'en' ? 'tokens' : 'токенов',
      onUndo: () => {
        cancelPendingDelete(bulkDeleteKey);
        updatePendingDeleteTokenIds((prev) => {
          const next = new Set(prev);
          deleteIds.forEach((id) => next.delete(id));
          return next;
        });
      },
      language,
    });
  }, [dispatch, language, selectedTokenIds, t, updatePendingDeleteTokenIds]);

  const columns: Column[] = [
    {
      key: 'checkbox',
      label: '',
      headerRender: () => (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={toggleAllTokens}
          className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
          onClick={(event) => event.stopPropagation()}
          title={
            allSelected
              ? language === 'ru'
                ? 'Снять все'
                : 'Deselect all'
              : language === 'ru'
                ? 'Отметить все'
                : 'Select all'
          }
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedTokenIds.has(row.id)}
          onChange={() => toggleToken(row.id)}
          className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
          onClick={(event) => event.stopPropagation()}
        />
      ),
    },
    { key: 'id', label: t[language].id, sortable: true, filterable: true },
    { key: 'name', label: t[language].name, sortable: true, filterable: true },
    { key: 'chainName', label: t[language].chainName, sortable: true, filterable: true },
    {
      key: 'address',
      label: t[language].address,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    { key: 'symbol', label: t[language].symbol, sortable: true, filterable: true },
    { key: 'decimals', label: t[language].decimals, sortable: true, filterable: true },
    {
      key: 'isActive',
      label: t[language].isActive,
      sortable: true,
      filterable: true,
      render: renderBoolean,
    },
    {
      key: 'isChecked',
      label: t[language].isChecked,
      sortable: true,
      filterable: true,
      render: renderBoolean,
    },
    { key: 'balance', label: t[language].balance, sortable: true, filterable: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title={t[language].tableTitle}
        headerActions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingTokenRaw(null);
                setFormOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">{t[language].add}</span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center p-2 bg-muted text-foreground rounded hover:bg-accent transition-colors"
                  aria-label={t[language].actions}
                  title={t[language].actions}
                >
                  <Menu className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={selectedTokenIds.size === 0}
                  variant="destructive"
                  onClick={handleDeleteSelected}
                >
                  {t[language].deleteSelected}
                  {selectedTokenIds.size > 0 ? ` (${selectedTokenIds.size})` : ''}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
        columns={columns}
        data={tableRows}
        excludeRowIds={pendingDeleteTokenIds}
        getExcludeRowId={(row) => row.id}
        language={language}
        isLoading={tokensMeta.isLoading || chainsMeta.isLoading}
        loadingText={language === 'ru' ? 'Загрузка токенов…' : 'Loading Tokens…'}
        actionsColumnPosition="last"
        getRowId={(params) => String(params.data?.id ?? '')}
        onEdit={(row) => {
          setEditingTokenRaw(row.raw ?? null);
          setFormOpen(true);
        }}
        onDelete={scheduleDelete}
        onRowClick={setSelectedRow}
        selectedRow={selectedRow}
      />

      <DexTokenForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTokenRaw(null);
        }}
        onSave={async (data) => {
          const payload = {
            chainId: Number(data.chainId),
            address: data.address.trim(),
            symbol: data.symbol.trim(),
            tokenName: data.tokenName.trim(),
            decimals: Number(data.decimals),
          };

          const saved = editingTokenRaw
            ? await apiService.editToken(Number(editingTokenRaw.tokenId ?? editingTokenRaw.id), payload)
            : await apiService.createToken(payload);
          dispatch(dbConfigActions.upsertToken({ token: normalizeDexTokenForStore(saved) }));
        }}
        initialData={
          editingTokenRaw
            ? {
                chainId: String(editingTokenRaw.chainId ?? ''),
                address: editingTokenRaw.address ?? '',
                symbol: editingTokenRaw.symbol ?? '',
                tokenName: editingTokenRaw.tokenName ?? '',
                decimals: String(editingTokenRaw.decimals ?? ''),
              }
            : undefined
        }
        language={language}
      />
    </div>
  );
}
