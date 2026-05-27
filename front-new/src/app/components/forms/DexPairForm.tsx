import { useState, useEffect, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { FormLoader } from '../FormLoader';
import { useAppSelector } from '../../store/hooks';
import {
  selectPoolsDataResponse,
  selectPoolsMeta,
  selectTokensDataResponse,
  selectTokensMeta,
} from '../../store/db-config/dbConfig.selectors';
import { hasFormChanges, isSubmitDisabled } from '../../utils/form-utils';

/** Submitted to API as PairDto: poolId, tokenIn, tokenOut (token IDs). */
export interface DexPairFormData {
  poolId: string;
  tokenInId: string;
  tokenOutId: string;
}

interface DexPairFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DexPairFormData) => void;
  initialData?: DexPairFormData;
  language: 'en' | 'ru';
}

interface PoolOptionRow {
  id: string;
  label: string;
  token0Id: number;
  token1Id: number;
  tokenInLabel: string;
  tokenOutLabel: string;
}

const empty: DexPairFormData = { poolId: '', tokenInId: '', tokenOutId: '' };

export function DexPairForm({ open, onClose, onSave, initialData, language }: DexPairFormProps) {
  const poolsFromStore = useAppSelector(selectPoolsDataResponse);
  const tokens = useAppSelector(selectTokensDataResponse);
  const poolsMeta = useAppSelector(selectPoolsMeta);
  const tokensMeta = useAppSelector(selectTokensMeta);
  const [form, setForm] = useState<DexPairFormData>(empty);

  const isEdit = Boolean(initialData);
  const isFormLoading =
    poolsMeta.isLoading || tokensMeta.isLoading || !poolsMeta.isLoaded || !tokensMeta.isLoaded;

  const t = {
    en: {
      title: initialData ? 'Edit pair' : 'Add new pair',
      poolId: 'Pool Id',
      tokenIn: 'Token In',
      tokenOut: 'Token Out',
      submit: initialData ? 'SAVE' : 'ADD',
      cancel: 'CANCEL',
      loading: 'Loading...',
    },
    ru: {
      title: initialData ? 'Редактировать пару' : 'Добавить пару',
      poolId: 'ID пула',
      tokenIn: 'Токен входа',
      tokenOut: 'Токен выхода',
      submit: initialData ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ',
      cancel: 'ОТМЕНА',
      loading: 'Загрузка...',
    },
  };

  useEffect(() => {
    setForm(initialData ?? empty);
  }, [open, initialData]);

  const tokenById = useMemo(() => new Map(tokens.map((x: any) => [x.tokenId ?? x.id, x])), [tokens]);

  const pools: PoolOptionRow[] = useMemo(() => {
    return poolsFromStore.map((p: any) => {
      const id = String(p.poolId ?? p.id);
      const t0 = tokenById.get(p.token0Id);
      const t1 = tokenById.get(p.token1Id);
      const token0Id = Number(p.token0Id);
      const token1Id = Number(p.token1Id);
      const tokenInLabel = t0 ? `${t0.symbol ?? ''} (${String(t0.address ?? '').slice(0, 8)}…)` : String(token0Id);
      const tokenOutLabel = t1 ? `${t1.symbol ?? ''} (${String(t1.address ?? '').slice(0, 8)}…)` : String(token1Id);
      const label = p.poolAddress ? `${String(p.poolAddress).slice(0, 10)}…${String(p.poolAddress).slice(-8)}` : id;
      return { id, label, token0Id, token1Id, tokenInLabel, tokenOutLabel };
    });
  }, [poolsFromStore, tokenById]);

  const poolOptions = useMemo(() => pools.map((p) => ({ value: p.id, label: p.label })), [pools]);

  const selectedPool = useMemo(
    () => pools.find((p) => p.id === form.poolId) ?? null,
    [form.poolId, pools],
  );

  const handlePoolChange = (poolId: string) => {
    const pool = pools.find((p) => p.id === poolId);
    setForm({
      poolId,
      tokenInId: pool ? String(pool.token0Id) : '',
      tokenOutId: pool ? String(pool.token1Id) : '',
    });
  };

  const handleSwap = () => {
    setForm((f) => ({ ...f, tokenInId: f.tokenOutId, tokenOutId: f.tokenInId }));
  };

  const tokenInDisplay = selectedPool
    ? tokenById.get(Number(form.tokenInId))?.symbol ??
      selectedPool.tokenInLabel
    : '';
  const tokenOutDisplay = selectedPool
    ? tokenById.get(Number(form.tokenOutId))?.symbol ??
      selectedPool.tokenOutLabel
    : '';

  const hasChanges = useMemo(
    () => hasFormChanges(form, initialData),
    [form, initialData],
  );

  const isValid = Boolean(form.poolId && form.tokenInId && form.tokenOutId);

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
            label={t[language].poolId}
            options={poolOptions}
            value={form.poolId}
            onChange={handlePoolChange}
            placeholder="Select pool..."
            required
            disabled={isFormLoading}
          />

          <div className="flex items-end gap-2">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">{t[language].tokenIn}</label>
              <input
                type="text"
                value={tokenInDisplay}
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
                value={tokenOutDisplay}
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
