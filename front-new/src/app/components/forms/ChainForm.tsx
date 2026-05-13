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
  /** DEX chains use numeric chain id (maps to backend `newChainId`). CEX chains only use `name` on create. */
  chainKind: 'dex' | 'cex';
}

export function ChainForm({ open, onClose, onSave, initialData, language, chainKind }: ChainFormProps) {
  const [formData, setFormData] = useState<ChainFormData>({
    id: '',
    name: '',
  });

  const isEdit = Boolean(initialData?.id);

  const t = {
    en: {
      title:
        chainKind === 'cex'
          ? isEdit
            ? 'Edit CEX chain'
            : 'Add CEX chain'
          : isEdit
            ? 'Edit Chain'
            : 'Add Chain',
      id: chainKind === 'dex' ? 'Chain ID (numeric)' : 'CEX chain ID',
      name: 'Name',
      cancel: 'Cancel',
      save: 'Save',
    },
    ru: {
      title:
        chainKind === 'cex'
          ? isEdit
            ? 'Редактировать CEX-сеть'
            : 'Добавить CEX-сеть'
          : isEdit
            ? 'Редактировать сеть'
            : 'Добавить сеть',
      id: chainKind === 'dex' ? 'ID сети (число)' : 'ID CEX-сети',
      name: 'Название',
      cancel: 'Отмена',
      save: 'Сохранить',
    },
  };

  useEffect(() => {
    if (initialData) {
      setFormData({ id: initialData.id ?? '', name: initialData.name ?? '' });
    } else {
      setFormData({ id: '', name: '' });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const showChainIdField = chainKind === 'dex' || (chainKind === 'cex' && isEdit);

  return (
    <Dialog open={open} onClose={onClose} title={t[language].title}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 p-6 space-y-4">
          {showChainIdField && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-foreground">
                {t[language].id}
                {chainKind === 'dex' || !isEdit ? (
                  <span className="text-destructive ml-1">*</span>
                ) : null}
              </label>
              <input
                type="text"
                inputMode={chainKind === 'dex' ? 'numeric' : undefined}
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder={chainKind === 'dex' ? 'e.g. 1, 56, 137' : ''}
                required={chainKind === 'dex'}
                disabled={chainKind === 'cex' && isEdit}
                className="px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground">
              {t[language].name}
              <span className="text-destructive ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={chainKind === 'cex' ? 'e.g. Binance' : 'e.g. Ethereum'}
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
