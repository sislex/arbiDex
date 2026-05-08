import { toast } from 'sonner';

interface DeleteToastOptions {
  itemName: string;
  itemType: string;
  onUndo: () => void;
  language: 'en' | 'ru';
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
