import { User, Moon, Sun, Globe, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ProfileMenuProps {
  login: string;
  role: string;
  isDark: boolean;
  language: 'en' | 'ru';
  onThemeToggle: () => void;
  onLanguageChange: (lang: 'en' | 'ru') => void;
  onLogout: () => void;
}

export function ProfileMenu({ login, role, isDark, language, onThemeToggle, onLanguageChange, onLogout }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      login: 'Login',
      role: 'Role',
      theme: 'Theme',
      language: 'Language',
      dark: 'Dark',
      light: 'Light',
      admin: 'Administrator',
      trader: 'Trader',
      viewer: 'Viewer',
      logout: 'Log Out',
    },
    ru: {
      login: 'Логин',
      role: 'Роль',
      theme: 'Тема',
      language: 'Язык',
      dark: 'Темная',
      light: 'Светлая',
      admin: 'Администратор',
      trader: 'Трейдер',
      viewer: 'Наблюдатель',
      logout: 'Выйти',
    },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getRoleTranslation = (roleKey: string) => {
    const roleMap: { [key: string]: keyof typeof t.en } = {
      'admin': 'admin',
      'trader': 'trader',
      'viewer': 'viewer',
    };
    return t[language][roleMap[roleKey] || 'viewer'];
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors"
        title="Profile"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded shadow-lg z-50">
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">{t[language].login}</span>
                <span className="text-sm text-foreground font-medium">{login}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">{t[language].role}</span>
                <span className="text-sm text-foreground font-medium">{getRoleTranslation(role)}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">{t[language].theme}</span>
                <button
                  onClick={onThemeToggle}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-muted hover:bg-accent transition-colors text-sm"
                >
                  {isDark ? (
                    <>
                      <Moon className="w-4 h-4" />
                      <span>{t[language].dark}</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      <span>{t[language].light}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">{t[language].language}</span>
                <button
                  onClick={() => onLanguageChange(language === 'en' ? 'ru' : 'en')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-muted hover:bg-accent transition-colors text-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === 'en' ? 'EN' : 'RU'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  {t[language].logout}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
