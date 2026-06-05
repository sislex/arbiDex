import { Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { useEffect, useState } from 'react';
import { showDeleteToast } from '../../utils/toast';
import { cancelPendingDelete, schedulePendingDelete } from '../../utils/pendingDeleteScheduler';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectChainsMeta,
  selectTokensFullDataResponse,
  selectTokensMeta,
} from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';
import { DexTokenForm } from '../forms/DexTokenForm';

const TOKENS_DELETE_SCOPE = 'tokens';

export function TokensPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const tokensFromStore = useAppSelector(selectTokensFullDataResponse);
  const tokensMeta = useAppSelector(selectTokensMeta);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTokenRaw, setEditingTokenRaw] = useState<any>(null);
  const [pendingDeleteTokenIds, setPendingDeleteTokenIds] = useState<Set<number>>(new Set());
  useEffect(() => {
    if ((!tokensMeta.isLoaded || tokensMeta.error) && !tokensMeta.isLoading) {
      dispatch(dbConfigActions.initTokensListPage());
    }
  }, [dispatch, tokensMeta.error, tokensMeta.isLoaded, tokensMeta.isLoading]);

  useEffect(() => {
    const mappedTokens = tokensFromStore.map((token: any) => ({
      id: token.tokenId,
      name: token.tokenName,
      chainName: token.chainName ?? token.chainId ?? '',
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      isActive: token.isActive,
      isChecked: token.isChecked ?? token.is_checked ?? token.checked ?? false,
      balance: token.balance ?? '',
    }));
    setTokens(mappedTokens);
  }, [tokensFromStore]);

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
      back: 'BACK',
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
      back: 'НАЗАД',
    },
  };

  const renderBoolean = (value: boolean) => (
    <span
      className={`px-2 py-0.5 rounded text-xs ${
        value
          ? 'bg-success/20 text-success'
          : 'bg-destructive/20 text-destructive'
      }`}
    >
      {value ? 'true' : 'false'}
    </span>
  );

  const columns: Column[] = [
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
        }
        columns={columns}
        data={tokens.filter((token) => !pendingDeleteTokenIds.has(token.id))}
        language={language}
        isLoading={tokensMeta.isLoading || chainsMeta.isLoading}
        loadingText={language === 'ru' ? 'Загрузка токенов…' : 'Loading Tokens…'}
        onEdit={(row) => {
          setEditingTokenRaw(
            tokensFromStore.find((token: any) => Number(token.tokenId ?? token.id) === Number(row.id)) ?? null,
          );
          setFormOpen(true);
        }}
        onDelete={(row) => {
          setPendingDeleteTokenIds((prev) => new Set(prev).add(row.id));
          const deleteKey = `${TOKENS_DELETE_SCOPE}:${row.id}`;

          schedulePendingDelete(deleteKey, async () => {
            await apiService.deletingToken(row.id);
            dispatch(dbConfigActions.refetchTokensListPageResources());
            setPendingDeleteTokenIds((prev) => {
              const next = new Set(prev);
              next.delete(row.id);
              return next;
            });
          });

          showDeleteToast({
            itemName: row.symbol,
            itemType: language === 'en' ? 'Token' : 'Токен',
            onUndo: () => {
              cancelPendingDelete(deleteKey);
              setPendingDeleteTokenIds((prev) => {
                const next = new Set(prev);
                next.delete(row.id);
                return next;
              });
            },
            language,
          });
        }}
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

          if (editingTokenRaw) {
            const id = Number(editingTokenRaw.tokenId ?? editingTokenRaw.id);
            await apiService.editToken(id, payload);
          } else {
            await apiService.createToken(payload);
          }
          dispatch(dbConfigActions.refetchTokensListPageResources());
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
