import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { FormLoader } from '../FormLoader';
import { useAppSelector } from '../../store/hooks';
import {
  selectCexChainsDataResponse,
  selectCexChainsMeta,
  selectCexPairsDataResponse,
  selectCexPairsMeta,
} from '../../store/db-config/dbConfig.selectors';
import {
  buildCexChainNameById,
  buildCexJobDescriptionFromPair,
  resolveCexPairSourceLabel,
} from '../../utils/cexPairSource';
import { hasFormChanges, isSubmitDisabled } from '../../utils/form-utils';

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
  const cexPairsMeta = useAppSelector(selectCexPairsMeta);
  const cexChainsMeta = useAppSelector(selectCexChainsMeta);
  const [form, setForm] = useState<CexJobFormValues>(empty);

  const isEdit = Boolean(initialData);
  const isFormLoading =
    cexPairsMeta.isLoading ||
    cexChainsMeta.isLoading ||
    !cexPairsMeta.isLoaded ||
    !cexChainsMeta.isLoaded;

  const cexChainNameById = useMemo(() => buildCexChainNameById(cexChainsFromStore), [cexChainsFromStore]);

  const cexPairById = useMemo(() => {
    const map = new Map<string, any>();
    (cexPairsFromStore ?? []).forEach((pair: any) => {
      const id = pair.id ?? pair.pairId ?? pair.cexPairId ?? pair.cex_pair_id;
      if (id !== undefined && id !== null) {
        map.set(String(id), pair);
      }
    });
    return map;
  }, [cexPairsFromStore]);

  const t = {
    en: {
      title: initialData ? 'Edit job' : 'Add job',
      selectPool: 'Select cex pool',
      type: 'Type',
      description: 'Description',
      submit: initialData ? 'SAVE' : 'ADD',
      cancel: 'CANCEL',
      loading: 'Loading...',
    },
    ru: {
      title: initialData ? 'Изменить джобу' : 'Добавить джобу',
      selectPool: 'Выберите CEX pool',
      type: 'Тип',
      description: 'Описание',
      submit: initialData ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ',
      cancel: 'ОТМЕНА',
      loading: 'Загрузка...',
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

  const hasChanges = useMemo(
    () => hasFormChanges(form, initialData),
    [form, initialData],
  );

  const isValid = Boolean(form.cexPairId && form.jobType.trim());

  const saveDisabled = isSubmitDisabled({
    isEdit,
    hasChanges,
    isValid,
    isLoading: isFormLoading,
  });

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
            label={t[language].selectPool}
            options={pairOptions}
            value={form.cexPairId}
            onChange={(cexPairId) => {
              const pair = cexPairById.get(cexPairId);
              const description = pair
                ? buildCexJobDescriptionFromPair(pair, cexChainNameById)
                : form.description;
              setForm({ ...form, cexPairId, description });
            }}
            placeholder="pool"
            required
            disabled={isFormLoading}
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
            disabled={saveDisabled}
            className="px-5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold tracking-widest rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
