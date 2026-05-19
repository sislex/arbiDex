import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { useAppSelector } from '../../store/hooks';
import { selectChainsDataResponse } from '../../store/db-config/dbConfig.selectors';

export interface RpcUrlFormValues {
  chainId: string;
  rpcUrl: string;
}

interface RpcUrlFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: RpcUrlFormValues) => void;
  initialData?: RpcUrlFormValues;
  language: 'en' | 'ru';
}

const empty: RpcUrlFormValues = { chainId: '', rpcUrl: '' };

export function RpcUrlForm({ open, onClose, onSave, initialData, language }: RpcUrlFormProps) {
  const chains = useAppSelector(selectChainsDataResponse);
  const [form, setForm] = useState<RpcUrlFormValues>(empty);

  const t = {
    en: {
      title: initialData ? 'Edit RPC Url' : 'Add RPC Url',
      chain: 'Chain',
      rpcUrl: 'Rpc Url',
      back: 'BACK',
      save: initialData ? 'SAVE' : 'ADD',
    },
    ru: {
      title: initialData ? 'Редактировать RPC URL' : 'Добавить RPC URL',
      chain: 'Сеть',
      rpcUrl: 'RPC URL',
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
            <label className="text-sm text-muted-foreground">{t[language].rpcUrl}</label>
            <input
              type="text"
              value={form.rpcUrl}
              onChange={(e) => setForm((current) => ({ ...current, rpcUrl: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
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
