type FormRecord = Record<string, unknown>;

function normalizeFormValue(value: unknown): unknown {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'boolean' || typeof value === 'number') return value;
  if (value === null || value === undefined) return value;
  return value;
}

function normalizeFormValues<T extends FormRecord>(values: T): T {
  const normalized = {} as T;

  for (const key of Object.keys(values).sort()) {
    normalized[key as keyof T] = normalizeFormValue(values[key]) as T[keyof T];
  }

  return normalized;
}

export function hasFormChanges<T extends FormRecord>(current: T, initial: T | undefined): boolean {
  if (!initial) return true;

  return JSON.stringify(normalizeFormValues(current)) !== JSON.stringify(normalizeFormValues(initial));
}

export function isSubmitDisabled(params: {
  isEdit: boolean;
  hasChanges: boolean;
  isValid: boolean;
  isLoading: boolean;
}): boolean {
  const { isEdit, hasChanges, isValid, isLoading } = params;

  if (isLoading || !isValid) return true;
  if (isEdit && !hasChanges) return true;

  return false;
}
