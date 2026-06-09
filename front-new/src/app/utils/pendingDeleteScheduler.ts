import { toast } from 'sonner';

export const DELETE_UNDO_MS = 5000;

const scheduled = new Map<string, ReturnType<typeof setTimeout>>();

export function schedulePendingDelete(
  key: string,
  execute: () => void | Promise<void>,
  delayMs = DELETE_UNDO_MS,
): void {
  cancelPendingDelete(key);

  const timeoutId = setTimeout(() => {
    scheduled.delete(key);
    void Promise.resolve(execute()).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    });
  }, delayMs);

  scheduled.set(key, timeoutId);
}

export function cancelPendingDelete(key: string): boolean {
  const timeoutId = scheduled.get(key);
  if (!timeoutId) return false;
  clearTimeout(timeoutId);
  scheduled.delete(key);
  return true;
}

export function buildBulkDeleteKey(scope: string, ids: number[]): string {
  return `${scope}:bulk:${[...ids].sort((a, b) => a - b).join(',')}`;
}
