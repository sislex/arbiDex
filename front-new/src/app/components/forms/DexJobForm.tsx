import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { FormLoader } from '../FormLoader';
import { useAppSelector } from '../../store/hooks';
import {
  selectChainsDataResponse,
  selectChainsMeta,
  selectRpcUrlDataResponse,
  selectRpcUrlsMeta,
} from '../../store/db-config/dbConfig.selectors';
import { hasFormChanges, isSubmitDisabled } from '../../utils/form-utils';

export interface DexJobFormValues {
  chainId: string;
  rpcUrlId: string;
  jobType: string;
  description: string;
  additionalData: string;
}

interface DexJobFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DexJobFormValues) => void;
  initialData?: DexJobFormValues;
  language: 'en' | 'ru';
}

const empty: DexJobFormValues = {
  chainId: '',
  rpcUrlId: '',
  jobType: '',
  description: '',
  additionalData: '',
};

export function DexJobForm({ open, onClose, onSave, initialData, language }: DexJobFormProps) {
  const chains = useAppSelector(selectChainsDataResponse);
  const rpcUrls = useAppSelector(selectRpcUrlDataResponse);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const rpcUrlsMeta = useAppSelector(selectRpcUrlsMeta);
  const [form, setForm] = useState<DexJobFormValues>(empty);

  const isEdit = Boolean(initialData);
  const isFormLoading =
    chainsMeta.isLoading ||
    rpcUrlsMeta.isLoading ||
    !chainsMeta.isLoaded ||
    !rpcUrlsMeta.isLoaded;

  const t = {
    en: {
      title: initialData ? 'Edit DEX job' : 'Add DEX job',
      chain: 'Chain',
      rpcUrl: 'Rpc Url',
      type: 'Type',
      description: 'Description',
      additionalData: 'Additional data',
      save: initialData ? 'SAVE' : 'ADD',
      back: 'BACK',
      loading: 'Loading...',
    },
    ru: {
      title: initialData ? 'Редактировать DEX джобу' : 'Добавить DEX джобу',
      chain: 'Сеть',
      rpcUrl: 'RPC URL',
      type: 'Тип',
      description: 'Описание',
      additionalData: 'Доп. данные',
      save: initialData ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ',
      back: 'НАЗАД',
      loading: 'Загрузка...',
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

  const rpcOptions = useMemo(() => {
    const selectedChainId = Number(form.chainId);
    const filtered = Number.isFinite(selectedChainId)
      ? (rpcUrls ?? []).filter((rpc: any) => Number(rpc.chainId) === selectedChainId)
      : [];

    return filtered.map((rpc: any) => ({
      value: String(rpc.rpcUrlId ?? rpc.id ?? ''),
      label: rpc.rpcUrl ?? rpc.url ?? String(rpc.rpcUrlId ?? rpc.id ?? ''),
    }));
  }, [form.chainId, rpcUrls]);

  const hasChanges = useMemo(
    () => hasFormChanges(form, initialData),
    [form, initialData],
  );

  const isValid = Boolean(form.chainId && form.rpcUrlId && form.jobType.trim());

  const saveDisabled = isSubmitDisabled({
    isEdit,
    hasChanges,
    isValid,
    isLoading: isFormLoading,
  });

  const handleChainChange = (chainId: string) => {
    setForm((current) => ({
      ...current,
      chainId,
      rpcUrlId: '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saveDisabled) return;
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title={t[language].title}>
      <form onSubmit={handleSubmit} className="relative flex flex-col">
        {isFormLoading ? <FormLoader text={t[language].loading} /> : null}

        <div className="p-6 space-y-4">
          <Autocomplete
            label={t[language].chain}
            options={chainOptions}
            value={form.chainId}
            onChange={handleChainChange}
            placeholder={language === 'ru' ? 'Выберите сеть...' : 'Select chain...'}
            required
            disabled={isFormLoading}
          />

          <Autocomplete
            label={t[language].rpcUrl}
            options={rpcOptions}
            value={form.rpcUrlId}
            onChange={(rpcUrlId) => setForm((current) => ({ ...current, rpcUrlId }))}
            placeholder={language === 'ru' ? 'Выберите RPC URL...' : 'Select rpc url...'}
            required
            disabled={!form.chainId || isFormLoading}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].type}</label>
            <div className="relative">
              <input
                type="text"
                value={form.jobType}
                onChange={(e) => setForm((current) => ({ ...current, jobType: e.target.value }))}
                required
                disabled={isFormLoading}
                className="w-full px-3 py-2 pr-8 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              {form.jobType && (
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, jobType: '' }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].description}</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              disabled={isFormLoading}
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].additionalData}</label>
            <textarea
              value={form.additionalData}
              onChange={(e) => setForm((current) => ({ ...current, additionalData: e.target.value }))}
              rows={4}
              disabled={isFormLoading}
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none font-mono disabled:opacity-50"
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
            disabled={saveDisabled}
            className="px-5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold tracking-widest rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t[language].save}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
