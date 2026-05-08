import { useState, useEffect } from 'react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';

interface PoolFormData {
  chain: string;
  token0: string;
  token1: string;
  dex: string;
  fee: string;
  poolAddress: string;
}

interface PoolFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PoolFormData) => void;
  initialData?: PoolFormData;
  language: 'en' | 'ru';
}

const mockChains = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'bsc', label: 'Binance Smart Chain' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'optimism', label: 'Optimism' },
];

const mockTokensByChain: Record<string, Array<{ value: string; label: string }>> = {
  ethereum: [
    { value: 'eth', label: 'ETH' },
    { value: 'usdt', label: 'USDT' },
    { value: 'usdc', label: 'USDC' },
    { value: 'dai', label: 'DAI' },
    { value: 'wbtc', label: 'WBTC' },
  ],
  bsc: [
    { value: 'bnb', label: 'BNB' },
    { value: 'busd', label: 'BUSD' },
    { value: 'usdt', label: 'USDT' },
    { value: 'cake', label: 'CAKE' },
  ],
  polygon: [
    { value: 'matic', label: 'MATIC' },
    { value: 'usdt', label: 'USDT' },
    { value: 'usdc', label: 'USDC' },
    { value: 'dai', label: 'DAI' },
  ],
  arbitrum: [
    { value: 'eth', label: 'ETH' },
    { value: 'usdt', label: 'USDT' },
    { value: 'usdc', label: 'USDC' },
    { value: 'arb', label: 'ARB' },
  ],
  optimism: [
    { value: 'eth', label: 'ETH' },
    { value: 'usdt', label: 'USDT' },
    { value: 'usdc', label: 'USDC' },
    { value: 'op', label: 'OP' },
  ],
};

const mockDexes = [
  { value: 'uniswap-v2', label: 'Uniswap V2' },
  { value: 'uniswap-v3', label: 'Uniswap V3' },
  { value: 'sushiswap', label: 'SushiSwap' },
  { value: 'pancakeswap', label: 'PancakeSwap' },
  { value: 'curve', label: 'Curve' },
];

export function PoolForm({ open, onClose, onSave, initialData, language }: PoolFormProps) {
  const [formData, setFormData] = useState<PoolFormData>({
    chain: '',
    token0: '',
    token1: '',
    dex: '',
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
      fee: 'Fee (%)',
      poolAddress: 'Pool Address',
      cancel: 'Cancel',
      save: 'Save',
    },
    ru: {
      title: initialData ? 'Редактировать пул' : 'Добавить пул',
      chain: 'Сеть',
      token0: 'Токен 0',
      token1: 'Токен 1',
      dex: 'DEX',
      fee: 'Комиссия (%)',
      poolAddress: 'Адрес пула',
      cancel: 'Отмена',
      save: 'Сохранить',
    },
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        chain: '',
        token0: '',
        token1: '',
        dex: '',
        fee: '',
        poolAddress: '',
      });
    }
  }, [initialData, open]);

  const handleChainChange = (chain: string) => {
    setFormData({
      ...formData,
      chain,
      token0: '',
      token1: '',
    });
  };

  const availableTokens = formData.chain ? mockTokensByChain[formData.chain] || [] : [];

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
            options={mockChains}
            value={formData.chain}
            onChange={handleChainChange}
            placeholder="Select chain..."
          />

          <Autocomplete
            label={t[language].token0}
            required
            options={availableTokens}
            value={formData.token0}
            onChange={(value) => setFormData({ ...formData, token0: value })}
            placeholder="Select token 0..."
            disabled={!formData.chain}
          />

          <Autocomplete
            label={t[language].token1}
            required
            options={availableTokens}
            value={formData.token1}
            onChange={(value) => setFormData({ ...formData, token1: value })}
            placeholder="Select token 1..."
            disabled={!formData.chain}
          />

          <Autocomplete
            label={t[language].dex}
            required
            options={mockDexes}
            value={formData.dex}
            onChange={(value) => setFormData({ ...formData, dex: value })}
            placeholder="Select DEX..."
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground">
              {t[language].fee}
              <span className="text-destructive ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.fee}
              onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
              placeholder="e.g., 0.3, 0.05, 1.0"
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
