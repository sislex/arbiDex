import { useState, useEffect, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';

interface DexPairFormData {
  poolId: string;
  tokenIn: string;
  tokenOut: string;
}

interface DexPairFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DexPairFormData) => void;
  initialData?: DexPairFormData;
  language: 'en' | 'ru';
}

interface MockPool {
  id: string;
  label: string;
  tokenIn: { symbol: string; name: string };
  tokenOut: { symbol: string; name: string };
}

const mockPools: MockPool[] = [
  {
    id: '0xae521238b37748be7df516416d3b5b60011e7064',
    label: '0xae521238...11e7064',
    tokenIn: { symbol: 'ETH', name: 'Ether' },
    tokenOut: { symbol: 'WETH', name: 'Wrapped Ether' },
  },
  {
    id: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
    label: '0x88e6a0c2...3f5640',
    tokenIn: { symbol: 'USDC', name: 'USD Coin' },
    tokenOut: { symbol: 'WETH', name: 'Wrapped Ether' },
  },
  {
    id: '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed',
    label: '0xcbcdf962...d62ed',
    tokenIn: { symbol: 'WBTC', name: 'Wrapped Bitcoin' },
    tokenOut: { symbol: 'WETH', name: 'Wrapped Ether' },
  },
  {
    id: '0x5777d92f208679db4b9778590fa3cab3ac9e2168',
    label: '0x5777d92f...e2168',
    tokenIn: { symbol: 'DAI', name: 'Dai Stablecoin' },
    tokenOut: { symbol: 'USDC', name: 'USD Coin' },
  },
  {
    id: '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36',
    label: '0x4e68ccd3...dfa36',
    tokenIn: { symbol: 'WETH', name: 'Wrapped Ether' },
    tokenOut: { symbol: 'USDT', name: 'Tether USD' },
  },
];

const empty: DexPairFormData = { poolId: '', tokenIn: '', tokenOut: '' };

export function DexPairForm({ open, onClose, onSave, initialData, language }: DexPairFormProps) {
  const [form, setForm] = useState<DexPairFormData>(empty);

  const t = {
    en: {
      title: initialData ? 'Edit pair' : 'Add new pair',
      poolId: 'Pool Id',
      tokenIn: 'Token In',
      tokenOut: 'Token Out',
      add: 'ADD',
      cancel: 'CANCEL',
    },
    ru: {
      title: initialData ? 'Редактировать пару' : 'Добавить пару',
      poolId: 'ID пула',
      tokenIn: 'Токен входа',
      tokenOut: 'Токен выхода',
      add: 'ДОБАВИТЬ',
      cancel: 'ОТМЕНА',
    },
  };

  useEffect(() => {
    setForm(initialData ?? empty);
  }, [open, initialData]);

  const poolOptions = useMemo(() =>
    mockPools.map((p) => ({ value: p.id, label: p.id })),
    []
  );

  const selectedPool = useMemo(() =>
    mockPools.find((p) => p.id === form.poolId) ?? null,
    [form.poolId]
  );

  const handlePoolChange = (poolId: string) => {
    const pool = mockPools.find((p) => p.id === poolId);
    setForm({
      poolId,
      tokenIn: pool ? pool.tokenIn.name : '',
      tokenOut: pool ? pool.tokenOut.name : '',
    });
  };

  const handleSwap = () => {
    setForm((f) => ({ ...f, tokenIn: f.tokenOut, tokenOut: f.tokenIn }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title={t[language].title}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="p-6 space-y-4">
          <Autocomplete
            label={t[language].poolId}
            options={poolOptions}
            value={form.poolId}
            onChange={handlePoolChange}
            placeholder="Select pool..."
            required
          />

          <div className="flex items-end gap-2">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">{t[language].tokenIn}</label>
              <input
                type="text"
                value={form.tokenIn}
                readOnly
                disabled={!selectedPool}
                placeholder={t[language].tokenIn}
                className={`w-full px-3 py-2 bg-input border border-border rounded text-sm transition-colors ${
                  selectedPool
                    ? 'text-foreground'
                    : 'text-muted-foreground opacity-50 cursor-not-allowed'
                } focus:outline-none`}
              />
            </div>

            <button
              type="button"
              onClick={handleSwap}
              disabled={!selectedPool}
              title="Swap tokens"
              className={`mb-0.5 p-2 rounded-full border border-border transition-colors ${
                selectedPool
                  ? 'bg-muted hover:bg-accent hover:text-accent-foreground text-muted-foreground cursor-pointer'
                  : 'bg-muted text-muted-foreground opacity-30 cursor-not-allowed'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">{t[language].tokenOut}</label>
              <input
                type="text"
                value={form.tokenOut}
                readOnly
                disabled={!selectedPool}
                placeholder={t[language].tokenOut}
                className={`w-full px-3 py-2 bg-input border border-border rounded text-sm transition-colors ${
                  selectedPool
                    ? 'text-foreground'
                    : 'text-muted-foreground opacity-50 cursor-not-allowed'
                } focus:outline-none`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            type="submit"
            disabled={!form.poolId}
            className="px-5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold tracking-widest rounded hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t[language].add}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 bg-muted text-muted-foreground text-xs font-semibold tracking-widest rounded hover:bg-accent hover:text-foreground transition-colors"
          >
            {t[language].cancel}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
