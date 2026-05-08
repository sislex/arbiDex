import { useState, useEffect } from 'react';
import { Dialog } from '../Dialog';

interface ChainFormData {
  id: string;
  name: string;
}

interface ChainFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ChainFormData) => void;
  initialData?: ChainFormData;
  language: 'en' | 'ru';
}

export function ChainForm({ open, onClose, onSave, initialData, language }: ChainFormProps) {
  const [formData, setFormData] = useState<ChainFormData>({
    id: '',
    name: '',
  });

  const t = {
    en: {
      title: initialData ? 'Edit Chain' : 'Add Chain',
      id: 'Chain ID',
      name: 'Chain Name',
      cancel: 'Cancel',
      save: 'Save',
    },
    ru: {
      title: initialData ? 'Редактировать сеть' : 'Добавить сеть',
      id: 'ID сети',
      name: 'Название сети',
      cancel: 'Отмена',
      save: 'Сохранить',
    },
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ id: '', name: '' });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title={t[language].title}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 p-6 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground">
              {t[language].id}
              <span className="text-destructive ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="e.g., ethereum, bsc, polygon"
              required
              className="px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground">
              {t[language].name}
              <span className="text-destructive ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Ethereum, Binance Smart Chain"
              required
              className="px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
