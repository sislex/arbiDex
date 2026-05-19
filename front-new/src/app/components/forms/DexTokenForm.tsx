import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { useAppSelector } from '../../store/hooks';
import { selectChainsDataResponse } from '../../store/db-config/dbConfig.selectors';

export interface DexTokenFormValues {
  chainId: string;
  address: string;
  symbol: string;
  tokenName: string;
  decimals: string;
}

interface DexTokenFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DexTokenFormValues) => void;
  initialData?: DexTokenFormValues;
  language: 'en' | 'ru';
}

const empty: DexTokenFormValues = {
  chainId: '',
  address: '',
  symbol: '',
  tokenName: '',
  decimals: '',
};

export function DexTokenForm({ open, onClose, onSave, initialData, language }: DexTokenFormProps) {
  const chains = useAppSelector(selectChainsDataResponse);
  const [form, setForm] = useState<DexTokenFormValues>(empty);

  const t = {
    en: {
      title: initialData ? 'Edit token' : 'Add token',
      chain: 'Chain',
      address: 'Address',
      symbol: 'Symbol',
      tokenName: 'Token name',
      decimals: 'Decimal',
      back: 'BACK',
      save: initialData ? 'SAVE' : 'ADD',
    },
    ru: {
      title: initialData ? 'Редактировать токен' : 'Добавить токен',
      chain: 'Сеть',
      address: 'Адрес',
      symbol: 'Символ',
      tokenName: 'Название токена',
      decimals: 'Десятичные',
      back: 'НАЗАД',
      save: initialData ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ',
    },
  };

  useEffect(() => {
    setForm(initialData ?? empty);
  }, [open, initialData]);

  const chainOptions = useMemo(
    () =>
      (chains ?? []).map((chain: any) => ({
        value: String(chain.chainId ?? chain.id ?? ''),
        label: chain.name ?? chain.chainName ?? String(chain.chainId ?? chain.id ?? ''),
      })),
    [chains],
  );

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
            label={t[language].chain}
            options={chainOptions}
            value={form.chainId}
            onChange={(chainId) => setForm((current) => ({ ...current, chainId }))}
            placeholder={language === 'ru' ? 'Выберите сеть...' : 'Select chain...'}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].address}</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">{t[language].symbol}</label>
              <input
                type="text"
                value={form.symbol}
                onChange={(e) => setForm((current) => ({ ...current, symbol: e.target.value }))}
                required
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">{t[language].decimals}</label>
              <input
                type="number"
                min={0}
                step={1}
                value={form.decimals}
                onChange={(e) => setForm((current) => ({ ...current, decimals: e.target.value }))}
                required
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].tokenName}</label>
            <input
              type="text"
              value={form.tokenName}
              onChange={(e) => setForm((current) => ({ ...current, tokenName: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 bg-muted text-muted-foreground text-xs font-semibold tracking-widest rounded hover:bg-accent hover:text-foreground transition-colors"
          >
            {t[language].back}
          </button>
          <button
            type="submit"
            className="px-5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold tracking-widest rounded hover:opacity-90 transition-opacity"
          >
            {t[language].save}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
