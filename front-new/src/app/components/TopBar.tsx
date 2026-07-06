import { Menu, X, BookOpen } from 'lucide-react';
import { ProfileMenu } from './ProfileMenu';

interface TopBarProps {
  pageTitle: string;
  onThemeToggle: () => void;
  isDark: boolean;
  language: 'en' | 'ru';
  onLanguageChange: (lang: 'en' | 'ru') => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  login: string;
  role: string;
  onLogout: () => void;
  onOpenHelp: () => void;
}

export function TopBar({ pageTitle, onThemeToggle, isDark, language, onLanguageChange, onToggleSidebar, sidebarCollapsed, login, role, onLogout, onOpenHelp }: TopBarProps) {
  return (
    <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Toggle Sidebar"
        >
          {sidebarCollapsed ? (
            <Menu className="w-4 h-4 text-muted-foreground" />
          ) : (
            <X className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span className="text-primary-foreground font-mono">CA</span>
        </div>
        <div className="text-xs text-muted-foreground">Crypto Arbitrage</div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <h1 className="text-foreground">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenHelp}
          className="p-2 rounded hover:bg-muted transition-colors"
          title={language === 'ru' ? 'Инструкция по проекту' : 'Project guide'}
          aria-label={language === 'ru' ? 'Инструкция по проекту' : 'Project guide'}
        >
          <BookOpen className="w-4 h-4 text-muted-foreground" />
        </button>
        <ProfileMenu
          login={login}
          role={role}
          isDark={isDark}
          language={language}
          onThemeToggle={onThemeToggle}
          onLanguageChange={onLanguageChange}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
}
