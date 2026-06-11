const AUTH_SESSION_KEY = 'arbiDex.authSession';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type AuthLanguage = 'en' | 'ru';

type StoredAuthSession = {
  login: string;
  password: string;
  language?: AuthLanguage;
  isDark?: boolean;
  expiresAt: number;
};

export type AuthSession = {
  login: string;
  password: string;
  language: AuthLanguage;
  isDark: boolean;
};

type AuthPreferences = {
  language: AuthLanguage;
  isDark: boolean;
};

function readStoredSession(): StoredAuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuthSession;
  } catch {
    return null;
  }
}

function toAuthSession(stored: StoredAuthSession): AuthSession | null {
  if (!stored.expiresAt || Date.now() > stored.expiresAt) {
    return null;
  }

  return {
    login: stored.login,
    password: stored.password,
    language: stored.language === 'ru' ? 'ru' : 'en',
    isDark: stored.isDark ?? true,
  };
}

export function saveAuthSession(
  login: string,
  password: string,
  preferences?: Partial<AuthPreferences>,
): void {
  const stored = readStoredSession();
  const session: StoredAuthSession = {
    login,
    password,
    language: preferences?.language ?? stored?.language ?? 'en',
    isDark: preferences?.isDark ?? stored?.isDark ?? true,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };

  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

export function updateAuthSessionPreferences(preferences: AuthPreferences): void {
  const stored = readStoredSession();
  if (!stored || !stored.expiresAt || Date.now() > stored.expiresAt) {
    return;
  }

  const session: StoredAuthSession = {
    ...stored,
    language: preferences.language,
    isDark: preferences.isDark,
  };

  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore storage errors
  }
}

export function getAuthSession(): AuthSession | null {
  const stored = readStoredSession();
  if (!stored) return null;

  const session = toAuthSession(stored);
  if (!session) {
    clearAuthSession();
    return null;
  }

  return session;
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch {
    // ignore storage errors
  }
}
