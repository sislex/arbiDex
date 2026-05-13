import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { useAppSelector } from '../../store/hooks';
import {
  selectCexChainsDataResponse,
  selectCexPairsDataResponse,
} from '../../store/db-config/dbConfig.selectors';
import { buildCexChainNameById, resolveCexPairSourceLabel } from '../../utils/cexPairSource';

export interface CexJobFormValues {
  cexPairId: string;
  jobType: string;
  description: string;
}

interface CexJobFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CexJobFormValues) => void;
  initialData?: CexJobFormValues;
  language: 'en' | 'ru';
}

const empty: CexJobFormValues = { cexPairId: '', jobType: '', description: '' };

export function CexJobForm({ open, onClose, onSave, initialData, language }: CexJobFormProps) {
  const cexPairsFromStore = useAppSelector(selectCexPairsDataResponse);
  const cexChainsFromStore = useAppSelector(selectCexChainsDataResponse);
  const [form, setForm] = useState<CexJobFormValues>(empty);

  const cexChainNameById = useMemo(() => buildCexChainNameById(cexChainsFromStore), [cexChainsFromStore]);

  const t = {
    en: {
      title: initialData ? 'Edit job' : 'Add job',
      selectPool: 'Select cex pool',
      type: 'Type',
      description: 'Description',
      submit: initialData ? 'SAVE' : 'ADD',
      cancel: 'CANCEL',
    },
    ru: {
      title: initialData ? 'Изменить джобу' : 'Добавить джобу',
      selectPool: 'Выберите CEX pool',
      type: 'Тип',
      description: 'Описание',
      submit: initialData ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ',
      cancel: 'ОТМЕНА',
    },
  };

  useEffect(() => {
    setForm(initialData ?? empty);
  }, [open, initialData]);

  const pairOptions = (cexPairsFromStore ?? []).map((pair: any) => {
    const id = pair.id ?? pair.pairId ?? pair.cexPairId ?? pair.cex_pair_id;
    const token0 = pair.token0 ?? pair.token0Symbol ?? '';
    const token1 = pair.token1 ?? pair.token1Symbol ?? '';
    const src = resolveCexPairSourceLabel(pair, cexChainNameById);
    return {
      value: String(id ?? ''),
      label: `${token0}/${token1} · ${src} (#${id})`,
    };
  });

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
            label={t[language].selectPool}
            options={pairOptions}
            value={form.cexPairId}
            onChange={(v) => setForm({ ...form, cexPairId: v })}
            placeholder="pool"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].type}</label>
            <div className="relative">
              <input
                type="text"
                value={form.jobType}
                onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                required
                className="w-full px-3 py-2 pr-8 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {form.jobType && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, jobType: '' })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].description}</label>
            <div className="relative">
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 pr-8 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {form.description && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, description: '' })}
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
            {t[language].submit}
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
