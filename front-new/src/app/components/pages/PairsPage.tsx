import { Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Tabs } from '../Tabs';
import { DataTable, Column } from '../DataTable';
import { Autocomplete } from '../Autocomplete';
import { showDeleteToast } from '../../utils/toast';
import { CexPairForm } from '../forms/CexPairForm';
import { DexPairForm } from '../forms/DexPairForm';

interface Pair {
  id: number;
  tokenInSymbol: string;
  tokenOutSymbol: string;
  tokenInAddress: string;
  tokenOutAddress: string;
}

const mockPairs: Pair[] = [
  {
    id: 1,
    tokenInSymbol: 'ETH',
    tokenOutSymbol: 'USDT',
    tokenInAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    tokenOutAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  {
    id: 2,
    tokenInSymbol: 'WBTC',
    tokenOutSymbol: 'ETH',
    tokenInAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    tokenOutAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  {
    id: 3,
    tokenInSymbol: 'USDC',
    tokenOutSymbol: 'DAI',
    tokenInAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    tokenOutAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  {
    id: 4,
    tokenInSymbol: 'ETH',
    tokenOutSymbol: 'USDC',
    tokenInAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    tokenOutAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  {
    id: 5,
    tokenInSymbol: 'ETH',
    tokenOutSymbol: 'DAI',
    tokenInAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    tokenOutAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
];

interface PairsPageProps {
  language: 'en' | 'ru';
  type: 'dex' | 'cex';
}

export function PairsPage({ language, type }: PairsPageProps) {
  const [activeTab, setActiveTab] = useState('pairs');
  const [pairs] = useState(mockPairs);
  const [selectedTokenIn, setSelectedTokenIn] = useState('');
  const [filteredCount, setFilteredCount] = useState(mockPairs.length);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

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
    const uniqueTokens = new Map<string, { symbol: string; address: string }>();
    pairs.forEach((pair) => {
      if (!uniqueTokens.has(pair.tokenInAddress)) {
        uniqueTokens.set(pair.tokenInAddress, {
          symbol: pair.tokenInSymbol,
          address: pair.tokenInAddress,
        });
      }
      if (!uniqueTokens.has(pair.tokenOutAddress)) {
        uniqueTokens.set(pair.tokenOutAddress, {
          symbol: pair.tokenOutSymbol,
          address: pair.tokenOutAddress,
        });
      }
    });

    return Array.from(uniqueTokens.values()).map((token) => ({
      value: token.address,
      label: `${token.symbol} (${token.address.slice(0, 6)}...${token.address.slice(-4)})`,
    }));
  }, [pairs]);

  const pairRatingData = useMemo(() => {
    if (!selectedTokenIn) return [];

    const tokenInPairs = pairs.filter((p) => p.tokenInAddress === selectedTokenIn);
    const ratingMap = new Map<string, number>();

    tokenInPairs.forEach((pair) => {
      const key = `${pair.tokenOutSymbol}|${pair.tokenOutAddress}`;
      ratingMap.set(key, (ratingMap.get(key) || 0) + 1);
    });

    const selectedToken = pairs.find((p) => p.tokenInAddress === selectedTokenIn);
    const tokenInSymbol = selectedToken?.tokenInSymbol || '';

    return Array.from(ratingMap.entries()).map(([key, count]) => {
      const [tokenOutSymbol, tokenOutAddress] = key.split('|');
      return {
        tokenInSymbol,
        tokenInAddress: selectedTokenIn,
        tokenOutSymbol,
        tokenOutAddress,
        count,
      };
    });
  }, [selectedTokenIn, pairs]);

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
                onChange={setSelectedTokenIn}
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
