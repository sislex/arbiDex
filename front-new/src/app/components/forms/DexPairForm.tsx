import { useState, useEffect, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { useAppSelector } from '../../store/hooks';
import { selectPoolsDataResponse, selectTokensDataResponse } from '../../store/db-config/dbConfig.selectors';

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

const mockPools: MockPool[] = [];

const empty: DexPairFormData = { poolId: '', tokenIn: '', tokenOut: '' };

export function DexPairForm({ open, onClose, onSave, initialData, language }: DexPairFormProps) {
  const poolsFromStore = useAppSelector(selectPoolsDataResponse);
  const tokens = useAppSelector(selectTokensDataResponse);
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

  const tokenById = useMemo(() => new Map(tokens.map((t: any) => [t.tokenId ?? t.id, t])), [tokens]);

  const pools: MockPool[] = useMemo(() => {
    return poolsFromStore.map((p: any) => {
      const id = String(p.poolId ?? p.id);
      const t0 = tokenById.get(p.token0Id);
      const t1 = tokenById.get(p.token1Id);
      const tokenIn = { symbol: t0?.symbol ?? 'Token0', name: t0?.tokenName ?? t0?.symbol ?? 'Token0' };
      const tokenOut = { symbol: t1?.symbol ?? 'Token1', name: t1?.tokenName ?? t1?.symbol ?? 'Token1' };
      const label = p.poolAddress ? `${String(p.poolAddress).slice(0, 10)}…${String(p.poolAddress).slice(-8)}` : id;
      return { id, label, tokenIn, tokenOut };
    });
  }, [poolsFromStore, tokenById]);

  const poolOptions = useMemo(() => pools.map((p) => ({ value: p.id, label: p.label })), [pools]);

  const selectedPool = useMemo(() =>
    pools.find((p) => p.id === form.poolId) ?? null,
    [form.poolId, pools]
  );

  const handlePoolChange = (poolId: string) => {
    const pool = pools.find((p) => p.id === poolId);
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
