import { Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { useEffect, useState } from 'react';
import { showDeleteToast } from '../../utils/toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { selectTokensFullDataResponse } from '../../store/db-config/dbConfig.selectors';

export function TokensPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const tokensFromStore = useAppSelector(selectTokensFullDataResponse);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    dispatch(dbConfigActions.initTokensListPage());
  }, [dispatch]);

  useEffect(() => {
    const mappedTokens = tokensFromStore.map((token: any) => ({
      id: token.tokenId,
      symbol: token.symbol,
      name: token.tokenName,
      address: token.address,
      decimals: token.decimals,
      active: token.isActive,
    }));
    setTokens(mappedTokens);
  }, [tokensFromStore]);

  const t = {
    en: {
      title: 'Tokens',
      add: 'Add Token',
      symbol: 'Symbol',
      name: 'Name',
      address: 'Address',
      decimals: 'Decimals',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
    },
    ru: {
      title: 'Токены',
      add: 'Добавить токен',
      symbol: 'Символ',
      name: 'Название',
      address: 'Адрес',
      decimals: 'Decimals',
      status: 'Статус',
      active: 'Активен',
      inactive: 'Неактивен',
    },
  };

  const columns: Column[] = [
    { key: 'symbol', label: t[language].symbol, sortable: true, filterable: true },
    { key: 'name', label: t[language].name, sortable: true, filterable: true },
    {
      key: 'address',
      label: t[language].address,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    { key: 'decimals', label: t[language].decimals, sortable: true },
    {
      key: 'active',
      label: t[language].status,
      render: (value) => (
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            value
              ? 'bg-success/20 text-success'
              : 'bg-destructive/20 text-destructive'
          }`}
        >
          {value ? t[language].active : t[language].inactive}
        </span>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-14 border-b border-border flex items-center justify-end px-4">
        <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          <span className="text-sm">{t[language].add}</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={tokens}
        onEdit={(row) => console.log('Edit', row)}
        onDelete={(row) => {
          const deletedToken = { ...row };
          setTokens(tokens.filter((t) => t.id !== row.id));
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
    </div>
  );
}
