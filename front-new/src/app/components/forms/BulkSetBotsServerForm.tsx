import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { FormLoader } from '../FormLoader';
import { useAppSelector } from '../../store/hooks';
import {
  selectServersDataResponse,
  selectServersMeta,
} from '../../store/db-config/dbConfig.selectors';

export interface BulkSetBotsServerFormValues {
  serverId: string;
}

export interface BulkSetBotsServerPreview {
  id: number;
  name: string;
}

interface BulkSetBotsServerFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: BulkSetBotsServerFormValues) => void | Promise<void>;
  bots: BulkSetBotsServerPreview[];
  language: 'en' | 'ru';
  isSaving?: boolean;
}

function formatServerAddress(server: any): string {
  const ip = String(server?.ip ?? '').trim();
  const port = String(server?.port ?? '').trim();

  if (!ip) return '';
  return port ? `${ip}:${port}` : ip;
}

export function BulkSetBotsServerForm({
  open,
  onClose,
  onSave,
  bots,
  language,
  isSaving = false,
}: BulkSetBotsServerFormProps) {
  const servers = useAppSelector(selectServersDataResponse);
  const serversMeta = useAppSelector(selectServersMeta);
  const [serverId, setServerId] = useState('');

  const isFormLoading = serversMeta.isLoading || !serversMeta.isLoaded;

  const t = {
    en: {
      title: 'Set server for bots',
      server: 'Server',
      botsPreview: 'Selected bots',
      back: 'BACK',
      save: 'SAVE',
      loading: 'Loading...',
      serverPlaceholder: 'Select server',
    },
    ru: {
      title: 'Задать сервер для ботов',
      server: 'Сервер',
      botsPreview: 'Выбранные боты',
      back: 'НАЗАД',
      save: 'СОХРАНИТЬ',
      loading: 'Загрузка...',
      serverPlaceholder: 'Выберите сервер',
    },
  };

  useEffect(() => {
    if (open) {
      setServerId('');
    }
  }, [open]);

  const serverOptions = useMemo(
    () =>
      (servers ?? []).map((server: any) => ({
        value: String(server.serverId ?? server.id ?? ''),
        label:
          server.serverName?.trim() ||
          server.name?.trim() ||
          formatServerAddress(server) ||
          `Server ${server.serverId ?? server.id ?? ''}`,
      })),
    [servers],
  );

  const saveDisabled = !serverId || bots.length === 0 || isFormLoading || isSaving;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saveDisabled) return;
    try {
      await onSave({ serverId });
      onClose();
    } catch {
      // Parent shows error toast; keep form open for retry.
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title={t[language].title}>
      <form onSubmit={handleSubmit} className="relative flex flex-col">
        {isFormLoading ? <FormLoader text={t[language].loading} /> : null}

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">
              {t[language].botsPreview} ({bots.length})
            </label>
            <ul className="max-h-32 overflow-y-auto rounded border border-border bg-muted/30 px-3 py-2 text-sm text-foreground space-y-1">
              {bots.map((bot) => (
                <li key={bot.id} className="text-xs text-muted-foreground">
                  #{bot.id} {bot.name}
                </li>
              ))}
            </ul>
          </div>

          <Autocomplete
            label={t[language].server}
            options={serverOptions}
            value={serverId}
            onChange={setServerId}
            placeholder={t[language].serverPlaceholder}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-1.5 bg-muted text-muted-foreground text-xs font-semibold tracking-widest rounded hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
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
