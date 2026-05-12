import { Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { useEffect, useState } from 'react';
import { showDeleteToast } from '../../utils/toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { selectTokensFullDataResponse, selectTokensMeta } from '../../store/db-config/dbConfig.selectors';

export function TokensPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const tokensFromStore = useAppSelector(selectTokensFullDataResponse);
  const tokensMeta = useAppSelector(selectTokensMeta);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tokens, setTokens] = useState<any[]>([]);

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
    },
    ru: {
      add: 'Добавить токен',
      id: 'ID',
      name: 'Name',
      chainName: 'Chain Name',
      address: 'Address',
      symbol: 'Symbol',
      decimals: 'Decimals',
      isActive: 'Is Active',
      isChecked: 'Is Checked',
      balance: 'Balance',
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
      <div className="h-14 border-b border-border flex items-center justify-end px-4">
        <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          <span className="text-sm">{t[language].add}</span>
        </button>
      </div>

      {tokens && tokens.length ? (
        <DataTable
          title="Tokens"
          columns={columns}
          data={tokens}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => {
            setTokens(tokens.filter((token) => token.id !== row.id));
            showDeleteToast({
              itemName: row.symbol,
              itemType: language === 'en' ? 'Token' : 'Токен',
              onUndo: () => setTokens([...tokens]),
              language,
            });
          }}
          onRowClick={setSelectedRow}
          selectedRow={selectedRow}
        />
      ) : null}
    </div>
  );
}
