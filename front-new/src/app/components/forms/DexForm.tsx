import { useEffect, useState } from 'react';
import { Dialog } from '../Dialog';

export interface DexFormValues {
  name: string;
}

interface DexFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DexFormValues) => void;
  initialData?: DexFormValues;
  language: 'en' | 'ru';
}

const empty: DexFormValues = { name: '' };

export function DexForm({ open, onClose, onSave, initialData, language }: DexFormProps) {
  const [form, setForm] = useState<DexFormValues>(empty);

  const t = {
    en: {
      title: initialData ? 'Edit DEX' : 'Add DEX',
      name: 'Name',
      back: 'BACK',
      save: initialData ? 'SAVE' : 'ADD',
    },
    ru: {
      title: initialData ? 'Редактировать DEX' : 'Добавить DEX',
      name: 'Название',
      back: 'НАЗАД',
      save: initialData ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ',
    },
  };

  useEffect(() => {
    setForm(initialData ?? empty);
  }, [open, initialData]);

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
            <label className="text-sm text-muted-foreground">{t[language].name}</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
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
