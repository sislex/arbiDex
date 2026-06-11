const AUTH_SESSION_KEY = 'arbiDex.authSession';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type StoredAuthSession = {
  login: string;
  password: string;
  expiresAt: number;
};

export function saveAuthSession(login: string, password: string): void {
  const session: StoredAuthSession = {
    login,
    password,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };

  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

export function getAuthSession(): { login: string; password: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as StoredAuthSession;
    if (!session.expiresAt || Date.now() > session.expiresAt) {
      clearAuthSession();
      return null;
    }

    return { login: session.login, password: session.password };
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch {
    // ignore storage errors
  }
}
