import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '../Dialog';
import { hasFormChanges, isSubmitDisabled } from '../../utils/form-utils';

export interface ServerFormValues {
  ip: string;
  port: string;
  serverName: string;
}

interface ServerFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ServerFormValues) => void;
  initialData?: ServerFormValues;
  language: 'en' | 'ru';
}

const empty: ServerFormValues = {
  ip: '',
  port: '',
  serverName: '',
};

export function ServerForm({ open, onClose, onSave, initialData, language }: ServerFormProps) {
  const [form, setForm] = useState<ServerFormValues>(empty);

  const isEdit = Boolean(initialData);

  const t = {
    en: {
      title: initialData ? 'Edit Server' : 'Add Server',
      ip: 'Ip',
      port: 'Port',
      serverName: 'Server Name',
      back: 'BACK',
      save: initialData ? 'SAVE' : 'ADD',
    },
    ru: {
      title: initialData ? 'Редактировать сервер' : 'Добавить сервер',
      ip: 'IP',
      port: 'Порт',
      serverName: 'Имя сервера',
      back: 'НАЗАД',
      save: initialData ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ',
    },
  };

  useEffect(() => {
    setForm(initialData ?? empty);
  }, [open, initialData]);

  const hasChanges = useMemo(
    () => hasFormChanges(form, initialData),
    [form, initialData],
  );

  const isValid = Boolean(form.ip.trim() && form.port.trim() && form.serverName.trim());

  const saveDisabled = isSubmitDisabled({
    isEdit,
    hasChanges,
    isValid,
    isLoading: false,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (saveDisabled) return;
    onSave({
      ip: form.ip.trim(),
      port: form.port.trim(),
      serverName: form.serverName.trim(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title={t[language].title}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].ip}</label>
            <input
              type="text"
              value={form.ip}
              onChange={(event) => setForm((current) => ({ ...current, ip: event.target.value }))}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].port}</label>
            <input
              type="text"
              value={form.port}
              onChange={(event) => setForm((current) => ({ ...current, port: event.target.value }))}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].serverName}</label>
            <input
              type="text"
              value={form.serverName}
              onChange={(event) => setForm((current) => ({ ...current, serverName: event.target.value }))}
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
            disabled={saveDisabled}
            className="px-5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold tracking-widest rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t[language].save}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
