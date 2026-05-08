import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';

interface CexPairFormData {
  chain: string;
  token0Symbol: string;
  token1Symbol: string;
}

interface CexPairFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CexPairFormData) => void;
  initialData?: CexPairFormData;
  language: 'en' | 'ru';
}

const mockCexChains = [
  { value: 'gateio', label: 'gateio' },
  { value: 'binance', label: 'binance' },
  { value: 'okx', label: 'okx' },
  { value: 'bybit', label: 'bybit' },
  { value: 'kucoin', label: 'kucoin' },
  { value: 'huobi', label: 'huobi' },
  { value: 'kraken', label: 'kraken' },
  { value: 'coinbase', label: 'coinbase' },
];

const empty: CexPairFormData = { chain: '', token0Symbol: '', token1Symbol: '' };

export function CexPairForm({ open, onClose, onSave, initialData, language }: CexPairFormProps) {
  const [form, setForm] = useState<CexPairFormData>(empty);

  const t = {
    en: {
      title: initialData ? 'Edit pair' : 'Add new pair',
      selectChain: 'Select chain',
      token0: 'Token 0 symbol',
      token1: 'Token 1 symbol',
      add: 'ADD',
      cancel: 'CANCEL',
    },
    ru: {
      title: initialData ? 'Редактировать пару' : 'Добавить пару',
      selectChain: 'Выберите биржу',
      token0: 'Символ токена 0',
      token1: 'Символ токена 1',
      add: 'ДОБАВИТЬ',
      cancel: 'ОТМЕНА',
    },
  };

  useEffect(() => {
    setForm(initialData ?? empty);
  }, [open, initialData]);

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
            label={t[language].selectChain}
            options={mockCexChains}
            value={form.chain}
            onChange={(v) => setForm({ ...form, chain: v })}
            placeholder="Select chain..."
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].token0}</label>
            <div className="relative">
              <input
                type="text"
                value={form.token0Symbol}
                onChange={(e) => setForm({ ...form, token0Symbol: e.target.value })}
                placeholder="e.g. WETH"
                required
                className="w-full px-3 py-2 pr-8 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {form.token0Symbol && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, token0Symbol: '' })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].token1}</label>
            <div className="relative">
              <input
                type="text"
                value={form.token1Symbol}
                onChange={(e) => setForm({ ...form, token1Symbol: e.target.value })}
                placeholder="e.g. USDC"
                required
                className="w-full px-3 py-2 pr-8 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {form.token1Symbol && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, token1Symbol: '' })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            type="submit"
            className="px-5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold tracking-widest rounded hover:opacity-90 transition-opacity"
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
