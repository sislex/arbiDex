import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { useAppSelector } from '../../store/hooks';
import { selectTokensDataResponse } from '../../store/db-config/dbConfig.selectors';

export interface QuoteFormValues {
  amount: string;
  blockTag: string;
  side: string;
  quoteSource: string;
  quoteTokenId: string;
}

interface QuoteFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: QuoteFormValues) => void;
  initialData?: QuoteFormValues;
  language: 'en' | 'ru';
}

const empty: QuoteFormValues = {
  amount: '',
  blockTag: 'latest',
  side: 'exactIn',
  quoteSource: '',
  quoteTokenId: '',
};

export function QuoteForm({ open, onClose, onSave, initialData, language }: QuoteFormProps) {
  const tokens = useAppSelector(selectTokensDataResponse);
  const [form, setForm] = useState<QuoteFormValues>(empty);

  const t = {
    en: {
      title: initialData ? 'Edit Quote' : 'Add Quote',
      amount: 'Amount',
      blockTag: 'Block Tag',
      side: 'Side',
      quoteSource: 'Quote Source',
      quoteToken: 'Select Quote Token',
      back: 'BACK',
      save: initialData ? 'SAVE' : 'ADD',
    },
    ru: {
      title: initialData ? 'Редактировать котировку' : 'Добавить котировку',
      amount: 'Сумма',
      blockTag: 'Тег блока',
      side: 'Сторона',
      quoteSource: 'Источник котировки',
      quoteToken: 'Токен котировки',
      back: 'НАЗАД',
      save: initialData ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ',
    },
  };

  useEffect(() => {
    setForm(initialData ?? empty);
  }, [open, initialData]);

  const tokenOptions = useMemo(
    () =>
      (tokens ?? []).map((token: any) => ({
        value: String(token.tokenId ?? token.id ?? ''),
        label: `${token.symbol ?? token.tokenName ?? 'Token'} (${String(token.address ?? '').slice(0, 8)}...)`,
      })),
    [tokens],
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
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].amount}</label>
            <input
              type="text"
              value={form.amount}
              onChange={(e) => setForm((current) => ({ ...current, amount: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">{t[language].blockTag}</label>
              <input
                type="text"
                value={form.blockTag}
                disabled
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-muted-foreground"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">{t[language].side}</label>
              <input
                type="text"
                value={form.side}
                disabled
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].quoteSource}</label>
            <input
              type="text"
              value={form.quoteSource}
              onChange={(e) => setForm((current) => ({ ...current, quoteSource: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Autocomplete
            label={t[language].quoteToken}
            options={tokenOptions}
            value={form.quoteTokenId}
            onChange={(quoteTokenId) => setForm((current) => ({ ...current, quoteTokenId }))}
            placeholder={language === 'ru' ? 'Выберите токен...' : 'Select token...'}
            required
          />
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
