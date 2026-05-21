import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '../Dialog';
import { Autocomplete } from '../Autocomplete';
import { useAppSelector } from '../../store/hooks';
import {
  selectCexJobsDataResponse,
  selectJobsDataResponse,
  selectServersDataResponse,
} from '../../store/db-config/dbConfig.selectors';

export interface BotFormValues {
  botName: string;
  description: string;
  mode: 'DEX' | 'CEX';
  dexJobId: string;
  cexJobId: string;
  serverId: string;
  paused: boolean;
  isRepeat: boolean;
  delayBetweenRepeat: string;
  maxJobs: string;
  maxErrors: string;
  timeoutMs: string;
}

interface BotFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: BotFormValues) => void;
  initialData?: BotFormValues;
  language: 'en' | 'ru';
}

const empty: BotFormValues = {
  botName: '',
  description: '',
  mode: 'DEX',
  dexJobId: '',
  cexJobId: '',
  serverId: '',
  paused: false,
  isRepeat: false,
  delayBetweenRepeat: '5000',
  maxJobs: '99999999',
  maxErrors: '10',
  timeoutMs: '99999999',
};

export function BotForm({ open, onClose, onSave, initialData, language }: BotFormProps) {
  const jobs = useAppSelector(selectJobsDataResponse);
  const cexJobs = useAppSelector(selectCexJobsDataResponse);
  const servers = useAppSelector(selectServersDataResponse);
  const [form, setForm] = useState<BotFormValues>(empty);

  const t = {
    en: {
      title: initialData ? 'Edit Bot' : 'Add Bot',
      botName: 'Bot Name',
      description: 'Description',
      mode: 'Mode',
      dexJob: 'Dex Job Id',
      cexJob: 'Cex Job Id',
      server: 'Server Id',
      paused: 'is Paused',
      repeat: 'is repeat',
      delay: 'Delay between repeat',
      maxJobs: 'Max jobs',
      maxErrors: 'Max errors',
      timeout: 'Timeout ms',
      back: 'BACK',
      save: initialData ? 'SAVE' : 'ADD',
    },
    ru: {
      title: initialData ? 'Редактировать бота' : 'Добавить бота',
      botName: 'Имя бота',
      description: 'Описание',
      mode: 'Режим',
      dexJob: 'ID DEX-задачи',
      cexJob: 'ID CEX-задачи',
      server: 'ID сервера',
      paused: 'На паузе',
      repeat: 'Повторять',
      delay: 'Задержка между повторами',
      maxJobs: 'Макс. задач',
      maxErrors: 'Макс. ошибок',
      timeout: 'Таймаут, мс',
      back: 'НАЗАД',
      save: initialData ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ',
    },
  };

  useEffect(() => {
    setForm(initialData ?? empty);
  }, [open, initialData]);

  const modeOptions = useMemo(
    () => [
      { value: 'DEX', label: 'DEX' },
      { value: 'CEX', label: 'CEX' },
    ],
    [],
  );

  const dexJobOptions = useMemo(
    () =>
      (jobs ?? []).map((job: any) => ({
        value: String(job.jobId ?? job.id ?? ''),
        label: `${job.jobType ?? job.job_type ?? 'job'} (${job.description ?? ''})`,
      })),
    [jobs],
  );

  const cexJobOptions = useMemo(
    () =>
      (cexJobs ?? []).map((job: any) => ({
        value: String(job.id ?? job.cexJobId ?? ''),
        label: `${job.job_type ?? job.jobType ?? 'job'} (${job.description ?? ''})`,
      })),
    [cexJobs],
  );

  const serverOptions = useMemo(
    () =>
      (servers ?? []).map((server: any) => ({
        value: String(server.serverId ?? server.id ?? ''),
        label: server.serverName ?? server.name ?? `Server ${server.serverId ?? server.id ?? ''}`,
      })),
    [servers],
  );

  const handleModeChange = (value: string) => {
    const mode = value === 'CEX' ? 'CEX' : 'DEX';
    setForm((current) => ({
      ...current,
      mode,
      dexJobId: mode === 'DEX' ? current.dexJobId : '',
      cexJobId: mode === 'CEX' ? current.cexJobId : '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title={t[language].title}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{t[language].description}</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Autocomplete
            label={t[language].mode}
            options={modeOptions}
            value={form.mode}
            onChange={handleModeChange}
            placeholder={language === 'ru' ? 'Выберите DEX или CEX' : 'Select Dex or Cex'}
            required
          />

          {form.mode === 'DEX' ? (
            <Autocomplete
              label={t[language].dexJob}
              options={dexJobOptions}
              value={form.dexJobId}
              onChange={(dexJobId) => setForm((current) => ({ ...current, dexJobId }))}
              placeholder={language === 'ru' ? 'Выберите ID задачи' : 'job id'}
              required
            />
          ) : (
            <Autocomplete
              label={t[language].cexJob}
              options={cexJobOptions}
              value={form.cexJobId}
              onChange={(cexJobId) => setForm((current) => ({ ...current, cexJobId }))}
              placeholder={language === 'ru' ? 'Выберите ID задачи' : 'job id'}
              required
            />
          )}

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
                onChange={(e) => setForm((current) => ({ ...current, delayBetweenRepeat: e.target.value }))}
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
