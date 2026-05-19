import { useMemo, useState, useEffect } from 'react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { useAppSelector } from '../../store/hooks';
import {
  selectChainsDataResponse,
  selectDexesDataResponse,
  selectTokensDataResponse,
} from '../../store/db-config/dbConfig.selectors';

interface PoolFormData {
  chainId: string;
  token0Id: string;
  token1Id: string;
  dexId: string;
  version: string;
  fee: string;
  poolAddress: string;
}

interface PoolFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PoolFormData) => void;
  initialData?: any;
  language: 'en' | 'ru';
}

export function PoolForm({ open, onClose, onSave, initialData, language }: PoolFormProps) {
  const chains = useAppSelector(selectChainsDataResponse);
  const tokens = useAppSelector(selectTokensDataResponse);
  const dexes = useAppSelector(selectDexesDataResponse);

  const [formData, setFormData] = useState<PoolFormData>({
    chainId: '',
    token0Id: '',
    token1Id: '',
    dexId: '',
    version: 'v3',
    fee: '',
    poolAddress: '',
  });

  const t = {
    en: {
      title: initialData ? 'Edit Pool' : 'Add Pool',
      chain: 'Chain',
      token0: 'Token 0',
      token1: 'Token 1',
      dex: 'DEX',
      version: 'Pool version',
      fee: 'Fee',
      poolAddress: 'Pool Address',
      cancel: 'Cancel',
      save: 'Save',
    },
    ru: {
      title: initialData ? 'Редактировать пул' : 'Добавить пул',
      chain: 'Сеть',
      token0: 'Токен 0',
      token1: 'Токен 1',
      dex: 'DEX-биржа',
      version: 'Версия пула',
      fee: 'Комиссия',
      poolAddress: 'Адрес пула',
      cancel: 'Отмена',
      save: 'Сохранить',
    },
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        chainId: String(initialData.chainId ?? initialData.chain_id ?? ''),
        token0Id: String(initialData.token0Id ?? initialData.token0_id ?? initialData.token0 ?? ''),
        token1Id: String(initialData.token1Id ?? initialData.token1_id ?? initialData.token1 ?? ''),
        dexId: String(initialData.dexId ?? initialData.dex_id ?? ''),
        version: String(initialData.version ?? 'v3'),
        fee: String(initialData.fee ?? ''),
        poolAddress: String(initialData.poolAddress ?? initialData.pool_address ?? initialData.address ?? ''),
      });
    } else {
      setFormData({
        chainId: '',
        token0Id: '',
        token1Id: '',
        dexId: '',
        version: 'v3',
        fee: '',
        poolAddress: '',
      });
    }
  }, [initialData, open]);

  const chainOptions = useMemo(
    () =>
      chains.map((c: any) => ({
        value: String(c.chainId ?? c.id),
        label: c.name ?? c.chainName ?? String(c.chainId ?? c.id),
      })),
    [chains],
  );

  const dexOptions = useMemo(
    () =>
      dexes.map((d: any) => ({
        value: String(d.dexId ?? d.id),
        label: d.name ?? d.dexName ?? String(d.dexId ?? d.id),
      })),
    [dexes],
  );

  const tokenOptions = useMemo(() => {
    const chainId = Number(formData.chainId);
    const list = Number.isFinite(chainId)
      ? tokens.filter((t: any) => Number(t.chainId) === chainId)
      : tokens;

    return list.map((t: any) => ({
      value: String(t.tokenId ?? t.id),
      label: `${t.symbol ?? t.tokenSymbol ?? t.tokenName ?? 'Token'} (${String(t.address ?? '').slice(0, 8)}…)`,
    }));
  }, [formData.chainId, tokens]);

  const handleChainChange = (chainId: string) => {
    setFormData({
      ...formData,
      chainId,
      token0Id: '',
      token1Id: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title={t[language].title}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 p-6 space-y-4">
          <Autocomplete
            label={t[language].chain}
            required
            options={chainOptions}
            value={formData.chainId}
            onChange={handleChainChange}
            placeholder={language === 'ru' ? 'Выберите сеть...' : 'Select chain...'}
          />

          <Autocomplete
            label={t[language].token0}
            required
            options={tokenOptions}
            value={formData.token0Id}
            onChange={(value) => setFormData({ ...formData, token0Id: value })}
            placeholder={language === 'ru' ? 'Выберите токен 0...' : 'Select token 0...'}
            disabled={!formData.chainId}
          />

          <Autocomplete
            label={t[language].token1}
            required
            options={tokenOptions}
            value={formData.token1Id}
            onChange={(value) => setFormData({ ...formData, token1Id: value })}
            placeholder={language === 'ru' ? 'Выберите токен 1...' : 'Select token 1...'}
            disabled={!formData.chainId}
          />

          <Autocomplete
            label={t[language].dex}
            required
            options={dexOptions}
            value={formData.dexId}
            onChange={(value) => setFormData({ ...formData, dexId: value })}
            placeholder={language === 'ru' ? 'Выберите DEX-биржу...' : 'Select DEX...'}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground">
              {t[language].version}
              <span className="text-destructive ml-1">*</span>
            </label>
            <select
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              required
              className="px-3 py-2 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="v2">v2</option>
              <option value="v3">v3</option>
              <option value="v4">v4</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground">
              {t[language].fee}
              <span className="text-destructive ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.fee}
              onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
              placeholder={language === 'ru' ? 'например, 3000 (уровень комиссии Uniswap v3)' : 'e.g. 3000 (Uniswap v3 fee tier)'}
              required
              className="px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground">
              {t[language].poolAddress}
              <span className="text-destructive ml-1">*</span>
            </label>
            <textarea
              value={formData.poolAddress}
              onChange={(e) => setFormData({ ...formData, poolAddress: e.target.value })}
              placeholder="0x..."
              required
              rows={3}
              className="px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-muted text-foreground rounded hover:bg-accent transition-colors text-sm"
          >
            {t[language].cancel}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity text-sm"
          >
            {t[language].save}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
