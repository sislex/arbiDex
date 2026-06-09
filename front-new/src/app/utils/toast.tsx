import { toast } from 'sonner';

interface DeleteToastOptions {
  itemName: string;
  itemType: string;
  onUndo: () => void;
  language: 'en' | 'ru';
}

interface BulkDeleteToastOptions {
  count: number;
  itemType: string;
  onUndo: () => void;
  language: 'en' | 'ru';
}

export function showBulkDeleteToast({ count, itemType, onUndo, language }: BulkDeleteToastOptions) {
  const t = {
    en: {
      deleted: 'Deleted',
      undo: 'Undo',
      items: (n: number, type: string) => `${n} ${type}`,
    },
    ru: {
      deleted: 'Удалено',
      undo: 'Отменить',
      items: (n: number, type: string) => `${n} ${type}`,
    },
  };

  toast.error(
    <div className="flex items-center justify-between gap-4 w-full">
      <div>
        <div className="font-medium">{t[language].deleted}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {t[language].items(count, itemType)}
        </div>
      </div>
    </div>,
    {
      action: {
        label: t[language].undo,
        onClick: onUndo,
      },
      duration: 5000,
    },
  );
}

export function showDeleteToast({ itemName, itemType, onUndo, language }: DeleteToastOptions) {
  const t = {
    en: {
      deleted: 'Deleted',
      undo: 'Undo',
    },
    ru: {
      deleted: 'Удалено',
      undo: 'Отменить',
    },
  };

  toast.error(
    <div className="flex items-center justify-between gap-4 w-full">
      <div>
        <div className="font-medium">{t[language].deleted}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {itemType}: {itemName}
        </div>
      </div>
    </div>,
    {
      action: {
        label: t[language].undo,
        onClick: onUndo,
      },
      duration: 5000,
    }
  );
}
