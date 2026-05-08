import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Tabs } from '../Tabs';
import { DataTable, Column } from '../DataTable';
import { Autocomplete } from '../Autocomplete';
import { showDeleteToast } from '../../utils/toast';
import { CexPairForm } from '../forms/CexPairForm';
import { DexPairForm } from '../forms/DexPairForm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectPairsFullData,
  selectPairsRating,
  selectTokenInList,
} from '../../store/db-config/dbConfig.selectors';

interface PairsPageProps {
  language: 'en' | 'ru';
  type: 'dex' | 'cex';
}

export function PairsPage({ language, type }: PairsPageProps) {
  const dispatch = useAppDispatch();
  const pairsFromStore = useAppSelector(selectPairsFullData);
  const pairRatingData = useAppSelector(selectPairsRating);
  const tokenInList = useAppSelector(selectTokenInList);
  const [activeTab, setActiveTab] = useState('pairs');
  const [selectedTokenIn, setSelectedTokenIn] = useState('');
  const [filteredCount, setFilteredCount] = useState(0);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(dbConfigActions.initPairsPage());
  }, [dispatch]);

  const pairs = useMemo(() => {
    return pairsFromStore.map((pair: any) => ({
      id: pair.pairId,
      tokenInId: pair.tokenInId,
      tokenOutId: pair.tokenOutId,
      tokenInSymbol: pair.tokenInSymbol,
      tokenOutSymbol: pair.tokenOutSymbol,
      tokenInAddress: pair.tokenInAddress,
      tokenOutAddress: pair.tokenOutAddress,
    }));
  }, [pairsFromStore]);

  const t = {
    en: {
      pairs: 'Pairs',
      pairRating: 'Pair Rating',
      add: type === 'dex' ? 'Add DEX Pair' : 'Add CEX Pair',
      pairId: 'Pair ID',
      tokenIn: 'Token In',
      tokenOut: 'Token Out',
      tokenInAddress: 'Token In Address',
      tokenOutAddress: 'Token Out Address',
      count: 'Count',
      selectToken: 'Select Token In...',
    },
    ru: {
      pairs: 'Пары',
      pairRating: 'Рейтинг пар',
      add: type === 'dex' ? 'Добавить DEX пару' : 'Добавить CEX пару',
      pairId: 'ID пары',
      tokenIn: 'Токен входа',
      tokenOut: 'Токен выхода',
      tokenInAddress: 'Адрес входа',
      tokenOutAddress: 'Адрес выхода',
      count: 'Кол-во',
      selectToken: 'Выберите токен входа...',
    },
  };

  const tabs = [
    { id: 'pairs', label: t[language].pairs },
    { id: 'rating', label: t[language].pairRating },
  ];

  const pairsColumns: Column[] = [
    {
      key: 'id',
      label: t[language].pairId,
      sortable: true,
      filterable: true,
    },
    {
      key: 'tokenInSymbol',
      label: t[language].tokenIn,
      sortable: true,
      filterable: true,
    },
    {
      key: 'tokenOutSymbol',
      label: t[language].tokenOut,
      sortable: true,
      filterable: true,
    },
    {
      key: 'tokenInAddress',
      label: t[language].tokenInAddress,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">
          {value.slice(0, 10)}...{value.slice(-8)}
        </span>
      ),
    },
    {
      key: 'tokenOutAddress',
      label: t[language].tokenOutAddress,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">
          {value.slice(0, 10)}...{value.slice(-8)}
        </span>
      ),
    },
  ];

  const tokenOptions = useMemo(() => {
    return tokenInList.map((token) => ({
      value: String(token.tokenInId),
      label: `${token.tokenInSymbol} (${token.tokenInAddress.slice(0, 6)}...${token.tokenInAddress.slice(-4)})`,
    }));
  }, [tokenInList]);

  const ratingColumns: Column[] = [
    {
      key: 'tokenInSymbol',
      label: t[language].tokenIn,
      sortable: true,
    },
    {
      key: 'tokenOutSymbol',
      label: t[language].tokenOut,
      sortable: true,
    },
    {
      key: 'tokenInAddress',
      label: t[language].tokenInAddress,
      sortable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'tokenOutAddress',
      label: t[language].tokenOutAddress,
      sortable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'count',
      label: t[language].count,
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm text-foreground">{value}</span>
      ),
    },
  ];

  const totalCount = pairs.length;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <h2 className="text-foreground">
          {activeTab === 'pairs'
            ? `${t[language].pairs} ${filteredCount !== totalCount ? `(${filteredCount}/${totalCount})` : `(${totalCount})`}`
            : `${t[language].pairRating} ${pairRatingData.length > 0 ? `(${pairRatingData.length})` : ''}`}
        </h2>
        {activeTab === 'pairs' && (
          <button
            onClick={() => setAddDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">{t[language].add}</span>
          </button>
        )}
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'pairs' ? (
          <DataTable
            columns={pairsColumns}
            data={pairs}
            onEdit={(row) => console.log('Edit', row)}
            onDelete={(row) => {
              showDeleteToast({
                itemName: `${row.tokenInSymbol}/${row.tokenOutSymbol}`,
                itemType: language === 'en' ? 'Pair' : 'Пара',
                onUndo: () => {},
                language,
              });
            }}
            onFilteredDataChange={(filtered) => setFilteredCount(filtered.length)}
          />
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border">
              <Autocomplete
                label={t[language].tokenIn}
                options={tokenOptions}
                value={selectedTokenIn}
                onChange={(value) => {
                  setSelectedTokenIn(value);
                  const tokenId = value ? Number(value) : null;
                  dispatch(dbConfigActions.setPairsRatingData(Number.isNaN(tokenId) ? null : tokenId));
                }}
                placeholder={t[language].selectToken}
              />
            </div>
            {pairRatingData.length > 0 ? (
              <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-muted z-10">
                    <tr>
                      {ratingColumns.map((column) => (
                        <th
                          key={column.key}
                          className="text-left px-3 py-2 border-b border-border text-xs text-muted-foreground uppercase tracking-wider"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pairRatingData.map((row, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/50">
                        {ratingColumns.map((column) => (
                          <td key={column.key} className="px-3 py-2">
                            {column.render
                              ? column.render(row[column.key as keyof typeof row], row)
                              : row[column.key as keyof typeof row]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  {selectedTokenIn
                    ? 'No pairs found for selected token'
                    : 'Select a token to view pair rating'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {type === 'cex' ? (
        <CexPairForm
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSave={(data) => console.log('CEX pair saved', data)}
          language={language}
        />
      ) : (
        <DexPairForm
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSave={(data) => console.log('DEX pair saved', data)}
          language={language}
        />
      )}
    </div>
  );
}
