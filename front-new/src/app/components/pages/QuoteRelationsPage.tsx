import { useState, useMemo } from 'react';
import { ArrowLeft, Trash2, Plus, Save, Columns2, Rows2 } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { DataTable, Column } from '../DataTable';

interface QuoteInfo {
  sourceId: string;
  process: string;
  type: string;
  baseFee: string;
  serverName: string;
  serverType: string;
  poolCount: number;
}

interface Pair {
  id: number;
  dexName: string;
  dexVersion: string;
  type: string;
  shareId: string;
  tokenIn: string;
  tokenOut: string;
  tokenInAddress: string;
  tokenOutAddress: string;
}

const mockQuoteInfo: QuoteInfo = {
  sourceId: 'binance-spot-001',
  process: 'Active',
  type: 'CEX',
  baseFee: '0.1%',
  serverName: 'binance-server-1',
  serverType: 'Production',
  poolCount: 5,
};

const mockInRelations: Pair[] = [
  {
    id: 1,
    dexName: 'Binance',
    dexVersion: 'v1',
    type: 'CEX',
    shareId: '12',
    tokenIn: 'BTC',
    tokenOut: 'USDT',
    tokenInAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    tokenOutAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  {
    id: 2,
    dexName: 'Kraken',
    dexVersion: 'v2',
    type: 'CEX',
    shareId: '8',
    tokenIn: 'ETH',
    tokenOut: 'USDT',
    tokenInAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    tokenOutAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
];

const mockNotInRelations: Pair[] = [
  {
    id: 3,
    dexName: 'Uniswap',
    dexVersion: 'v3',
    type: 'DEX',
    shareId: '15',
    tokenIn: 'WBTC',
    tokenOut: 'USDC',
    tokenInAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    tokenOutAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  {
    id: 4,
    dexName: 'PancakeSwap',
    dexVersion: 'v2',
    type: 'DEX',
    shareId: '20',
    tokenIn: 'BNB',
    tokenOut: 'BUSD',
    tokenInAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    tokenOutAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  },
];

interface QuoteRelationsPageProps {
  quoteName: string;
  language: 'en' | 'ru';
  onBack: () => void;
}

export function QuoteRelationsPage({ quoteName, language, onBack }: QuoteRelationsPageProps) {
  const [inRelations, setInRelations] = useState(mockInRelations);
  const [notInRelations, setNotInRelations] = useState(mockNotInRelations);
  const [selectedInRelations, setSelectedInRelations] = useState<Set<number>>(new Set());
  const [selectedNotInRelations, setSelectedNotInRelations] = useState<Set<number>>(new Set());
  const [filteredInCount, setFilteredInCount] = useState(mockInRelations.length);
  const [filteredNotCount, setFilteredNotCount] = useState(mockNotInRelations.length);
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');

  const t = {
    en: {
      back: 'Back to Quotes',
      quoteInfo: 'Quote info',
      sourceId: 'Source Id',
      process: 'Process',
      type: 'Type',
      baseFee: 'Base fee',
      serverName: 'Server Name',
      serverType: 'Server Type',
      poolCount: 'Pool count',
      inRelations: 'In relations',
      notInRelations: 'Is not relations',
      dexName: 'Dex name',
      dexVersion: 'Dex Version',
      shareId: 'Share Id',
      tokenIn: 'Token in',
      tokenOut: 'Token out',
      tokenInAddress: 'Token In Address',
      tokenOutAddress: 'Token Out Address',
      addSelected: 'Add Selected',
      removeSelected: 'Remove Selected',
      saveChanges: 'Save Changes',
    },
    ru: {
      back: 'К списку котировок',
      quoteInfo: 'Информация о котировке',
      sourceId: 'ID источника',
      process: 'Процесс',
      type: 'Тип',
      baseFee: 'Базовая комиссия',
      serverName: 'Сервер',
      serverType: 'Тип сервера',
      poolCount: 'Кол-во пулов',
      inRelations: 'В связях',
      notInRelations: 'Не в связях',
      dexName: 'Биржа',
      dexVersion: 'Версия',
      shareId: 'Share ID',
      tokenIn: 'Токен входа',
      tokenOut: 'Токен выхода',
      tokenInAddress: 'Адрес входа',
      tokenOutAddress: 'Адрес выхода',
      addSelected: 'Добавить выбранные',
      removeSelected: 'Удалить выбранные',
      saveChanges: 'Сохранить',
    },
  };

  const relationsColumns: Column[] = [
    {
      key: 'dexName',
      label: t[language].dexName,
      sortable: true,
      filterable: true,
    },
    {
      key: 'dexVersion',
      label: t[language].dexVersion,
      sortable: true,
      filterable: true,
    },
    {
      key: 'type',
      label: t[language].type,
      sortable: true,
      filterable: true,
    },
    {
      key: 'shareId',
      label: t[language].shareId,
      sortable: true,
      filterable: true,
    },
    {
      key: 'tokenIn',
      label: t[language].tokenIn,
      sortable: true,
      filterable: true,
    },
    {
      key: 'tokenOut',
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
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'tokenOutAddress',
      label: t[language].tokenOutAddress,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
  ];

  const handleRemoveSelected = () => {
    const toRemove = inRelations.filter(p => selectedInRelations.has(p.id));
    setInRelations(inRelations.filter(p => !selectedInRelations.has(p.id)));
    setNotInRelations([...notInRelations, ...toRemove]);
    setSelectedInRelations(new Set());
  };

  const handleAddSelected = () => {
    const toAdd = notInRelations.filter(p => selectedNotInRelations.has(p.id));
    setNotInRelations(notInRelations.filter(p => !selectedNotInRelations.has(p.id)));
    setInRelations([...inRelations, ...toAdd]);
    setSelectedNotInRelations(new Set());
  };

  const renderTableWithCheckbox = (
    data: any[],
    selectedSet: Set<number>,
    onToggle: (id: number) => void,
    columns: Column[],
    title: string,
    showActions: 'add' | 'remove',
    onFilteredDataChange: (filtered: any[]) => void
  ) => {
    const columnsWithCheckbox: Column[] = [
      {
        key: 'checkbox',
        label: '',
        render: (_, row) => (
          <input
            type="checkbox"
            checked={selectedSet.has(row.id)}
            onChange={() => onToggle(row.id)}
            className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      ...columns,
      {
        key: 'actions',
        label: '',
        render: (_, row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (showActions === 'remove') {
                const itemToMove = inRelations.find(p => p.id === row.id);
                if (itemToMove) {
                  setInRelations(inRelations.filter(p => p.id !== row.id));
                  setNotInRelations([...notInRelations, itemToMove]);
                }
              } else {
                const itemToMove = notInRelations.find(p => p.id === row.id);
                if (itemToMove) {
                  setNotInRelations(notInRelations.filter(p => p.id !== row.id));
                  setInRelations([...inRelations, itemToMove]);
                }
              }
            }}
            className={`p-1.5 rounded transition-colors ${
              showActions === 'remove'
                ? 'hover:bg-destructive/10 text-destructive'
                : 'hover:bg-success/10 text-success'
            }`}
          >
            {showActions === 'remove' ? <Trash2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        ),
      },
    ];

    return (
      <DataTable
        title={title}
        columns={columnsWithCheckbox}
        data={data}
        onFilteredDataChange={onFilteredDataChange}
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-14 border-b border-border flex items-center px-4 gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t[language].back}
        </button>
        <div className="h-6 w-px bg-border" />
        <h2 className="text-foreground">{quoteName}</h2>
        <div className="flex-1" />
        <button
          onClick={() => setLayoutMode(layoutMode === 'vertical' ? 'horizontal' : 'vertical')}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
          title={layoutMode === 'vertical' ? 'Switch to horizontal layout' : 'Switch to vertical layout'}
        >
          {layoutMode === 'vertical' ? <Columns2 className="w-4 h-4" /> : <Rows2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-4 border-b border-border bg-card">
        <div className="grid grid-cols-7 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">{t[language].sourceId}</div>
            <div className="text-sm text-foreground">{mockQuoteInfo.sourceId}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">{t[language].process}</div>
            <div className="text-sm text-foreground">{mockQuoteInfo.process}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">{t[language].type}</div>
            <div className="text-sm text-foreground">{mockQuoteInfo.type}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">{t[language].baseFee}</div>
            <div className="text-sm text-foreground">{mockQuoteInfo.baseFee}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">{t[language].serverName}</div>
            <div className="text-sm text-foreground">{mockQuoteInfo.serverName}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">{t[language].serverType}</div>
            <div className="text-sm text-foreground">{mockQuoteInfo.serverType}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">{t[language].poolCount}</div>
            <div className="text-sm text-foreground">{mockQuoteInfo.poolCount}</div>
          </div>
        </div>
      </div>

      <PanelGroup direction={layoutMode} className="flex-1">
        <Panel defaultSize={50} minSize={20}>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              {renderTableWithCheckbox(
                inRelations,
                selectedInRelations,
                (id) => {
                  const newSet = new Set(selectedInRelations);
                  if (newSet.has(id)) newSet.delete(id);
                  else newSet.add(id);
                  setSelectedInRelations(newSet);
                },
                relationsColumns,
                t[language].inRelations,
                'remove',
                (filtered) => setFilteredInCount(filtered.length)
              )}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className={`${layoutMode === 'vertical' ? 'h-1 cursor-row-resize' : 'w-1 cursor-col-resize'} bg-border hover:bg-primary transition-colors`} />

        <Panel defaultSize={50} minSize={20}>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              {renderTableWithCheckbox(
                notInRelations,
                selectedNotInRelations,
                (id) => {
                  const newSet = new Set(selectedNotInRelations);
                  if (newSet.has(id)) newSet.delete(id);
                  else newSet.add(id);
                  setSelectedNotInRelations(newSet);
                },
                relationsColumns,
                t[language].notInRelations,
                'add',
                (filtered) => setFilteredNotCount(filtered.length)
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>

      <div className="h-16 border-t border-border bg-card flex items-center justify-end gap-3 px-4">
        <button
          disabled={selectedInRelations.size === 0}
          onClick={handleRemoveSelected}
          className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <Trash2 className="w-4 h-4" />
          {t[language].removeSelected} ({selectedInRelations.size})
        </button>
        <button
          disabled={selectedNotInRelations.size === 0}
          onClick={handleAddSelected}
          className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <Plus className="w-4 h-4" />
          {t[language].addSelected} ({selectedNotInRelations.size})
        </button>
        <button className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity text-sm">
          <Save className="w-4 h-4" />
          {t[language].saveChanges}
        </button>
      </div>
    </div>
  );
}
