import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { FormLoader } from '../FormLoader';
import { useAppSelector } from '../../store/hooks';
import {
  selectServersDataResponse,
  selectServersMeta,
} from '../../store/db-config/dbConfig.selectors';

export interface BulkCexBotsFromJobsFormValues {
  botName: string;
  serverId: string;
  paused: boolean;
  isRepeat: boolean;
  delayBetweenRepeat: string;
  maxJobs: string;
  maxErrors: string;
  timeoutMs: string;
}

export interface BulkCexBotsJobPreview {
  id: number;
  jobType: string;
  description: string;
}

interface BulkCexBotsFromJobsFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: BulkCexBotsFromJobsFormValues) => void | Promise<void>;
  jobs: BulkCexBotsJobPreview[];
  language: 'en' | 'ru';
  isSaving?: boolean;
}

const empty: BulkCexBotsFromJobsFormValues = {
  botName: '',
  serverId: '',
  paused: false,
  isRepeat: false,
  delayBetweenRepeat: '5000',
  maxJobs: '99999999',
  maxErrors: '10',
  timeoutMs: '99999999',
};

function formatServerAddress(server: any): string {
  const ip = String(server?.ip ?? '').trim();
  const port = String(server?.port ?? '').trim();

  if (!ip) return '';
  return port ? `${ip}:${port}` : ip;
}

export function BulkCexBotsFromJobsForm({
  open,
  onClose,
  onSave,
  jobs,
  language,
  isSaving = false,
}: BulkCexBotsFromJobsFormProps) {
  const servers = useAppSelector(selectServersDataResponse);
  const serversMeta = useAppSelector(selectServersMeta);
  const [form, setForm] = useState<BulkCexBotsFromJobsFormValues>(empty);

  const isFormLoading = serversMeta.isLoading || !serversMeta.isLoaded;

  const t = {
    en: {
      title: 'Create bots from jobs',
      botName: 'Bot Name',
      server: 'Server Id',
      paused: 'is Paused',
      repeat: 'is repeat',
      delay: 'Delay between repeat',
      maxJobs: 'Max jobs',
      maxErrors: 'Max errors',
      timeout: 'Timeout ms',
      jobsPreview: 'Jobs (description from each job)',
      back: 'BACK',
      save: 'CREATE',
      loading: 'Loading...',
      jobLine: (job: BulkCexBotsJobPreview) =>
        `#${job.id} ${job.jobType}${job.description ? ` — ${job.description}` : ''}`,
    },
    ru: {
      title: 'Создать ботов из джоб',
      botName: 'Имя бота',
      server: 'ID сервера',
      paused: 'На паузе',
      repeat: 'Повторять',
      delay: 'Задержка между повторами',
      maxJobs: 'Макс. задач',
      maxErrors: 'Макс. ошибок',
      timeout: 'Таймаут, мс',
      jobsPreview: 'Джобы (описание из каждой джобы)',
      back: 'НАЗАД',
      save: 'СОЗДАТЬ',
      loading: 'Загрузка...',
      jobLine: (job: BulkCexBotsJobPreview) =>
        `#${job.id} ${job.jobType}${job.description ? ` — ${job.description}` : ''}`,
    },
  };

  useEffect(() => {
    if (open) {
      setForm(empty);
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

  const isValid = Boolean(form.botName.trim() && form.serverId && jobs.length > 0);
  const saveDisabled = !isValid || isFormLoading || isSaving;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saveDisabled) return;
    await onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} title={t[language].title}>
      <form onSubmit={handleSubmit} className="relative flex flex-col">
        {isFormLoading ? <FormLoader text={t[language].loading} /> : null}

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].jobsPreview}</label>
            <ul className="max-h-32 overflow-y-auto rounded border border-border bg-muted/30 px-3 py-2 text-sm text-foreground space-y-1">
              {jobs.map((job) => (
                <li key={job.id} className="text-xs text-muted-foreground">
                  {t[language].jobLine(job)}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].botName}</label>
            <input
              type="text"
              value={form.botName}
              onChange={(e) => setForm((current) => ({ ...current, botName: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Autocomplete
            label={t[language].server}
            options={serverOptions}
            value={form.serverId}
            onChange={(serverId) => setForm((current) => ({ ...current, serverId }))}
            placeholder={language === 'ru' ? 'Выберите ID сервера' : 'Server Id'}
            required
          />

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.paused}
                onChange={(e) => setForm((current) => ({ ...current, paused: e.target.checked }))}
                className="w-4 h-4 rounded border-input bg-input accent-primary"
              />
              {t[language].paused}
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.isRepeat}
                onChange={(e) => setForm((current) => ({ ...current, isRepeat: e.target.checked }))}
                className="w-4 h-4 rounded border-input bg-input accent-primary"
              />
              {t[language].repeat}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">{t[language].delay}</label>
              <input
                type="number"
                value={form.delayBetweenRepeat}
                onChange={(e) =>
                  setForm((current) => ({ ...current, delayBetweenRepeat: e.target.value }))
                }
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">{t[language].maxJobs}</label>
              <input
                type="number"
                value={form.maxJobs}
                onChange={(e) => setForm((current) => ({ ...current, maxJobs: e.target.value }))}
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">{t[language].maxErrors}</label>
              <input
                type="number"
                value={form.maxErrors}
                onChange={(e) => setForm((current) => ({ ...current, maxErrors: e.target.value }))}
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">{t[language].timeout}</label>
              <input
                type="number"
                value={form.timeoutMs}
                onChange={(e) => setForm((current) => ({ ...current, timeoutMs: e.target.value }))}
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
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
            {isSaving ? '...' : t[language].save}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
