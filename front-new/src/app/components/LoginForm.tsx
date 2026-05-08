import { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginFormProps {
  onLogin: (login: string, password: string) => void;
  language: 'en' | 'ru';
  isDark: boolean;
}

export function LoginForm({ onLogin, language, isDark }: LoginFormProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const t = {
    en: {
      title: 'Crypto Arbitrage',
      subtitle: 'Admin Panel',
      login: 'Login',
      password: 'Password',
      loginButton: 'Log In',
      loginPlaceholder: 'Enter your login',
      passwordPlaceholder: 'Enter your password',
      error: 'Invalid login or password',
    },
    ru: {
      title: 'Crypto Arbitrage',
      subtitle: 'Панель администратора',
      login: 'Логин',
      password: 'Пароль',
      loginButton: 'Войти',
      loginPlaceholder: 'Введите логин',
      passwordPlaceholder: 'Введите пароль',
      error: 'Неверный логин или пароль',
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // if (!login || !password) {
    //   setError(t[language].error);
    //   return;
    // }

    // Simple validation - in production, this would be an API call
    if (login === '' && password === '') {
      onLogin(login, password);
    } else {
      setError(t[language].error);
    }
  };

  return (
    <div className="size-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-mono text-2xl">CA</span>
          </div>
          <h1 className="text-2xl text-foreground mb-1">{t[language].title}</h1>
          <p className="text-sm text-muted-foreground">{t[language].subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              {t[language].login}
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder={t[language].loginPlaceholder}
              className="w-full px-4 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              {t[language].password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t[language].passwordPlaceholder}
              className="w-full px-4 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            <LogIn className="w-4 h-4" />
            {t[language].loginButton}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Demo: admin@crypto.com / admin
        </div>
      </div>
    </div>
  );
}
