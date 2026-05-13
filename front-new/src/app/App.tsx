import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { LoginForm } from './components/LoginForm';
import { TokensPage } from './components/pages/TokensPage';
import { QuotesListPage } from './components/pages/QuotesListPage';
import { QuoteRelationsPage } from './components/pages/QuoteRelationsPage';
import { BotsPage } from './components/pages/BotsPage';
import { BotDetailsPage } from './components/pages/BotDetailsPage';
import { ServersPage } from './components/pages/ServersPage';
import { ChainsPage } from './components/pages/ChainsPage';
import { PoolsPage } from './components/pages/PoolsPage';
import { PairsPage } from './components/pages/PairsPage';
import { JobsPage } from './components/pages/JobsPage';
import { RpcUrlsPage } from './components/pages/RpcUrlsPage';
import { DexesPage } from './components/pages/DexesPage';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [activePage, setActivePage] = useState('dex-chains');
  const [selectedQuote, setSelectedQuote] = useState<{ id: number; name: string } | null>(null);
  const [selectedBot, setSelectedBot] = useState<{ id: number; name: string } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userLogin, setUserLogin] = useState('');
  const [userRole, setUserRole] = useState('admin');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogin = (login: string, password: string) => {
    setUserLogin(login);
    setIsAuthenticated(true);
    setActivePage('dex-chains');
    setSelectedQuote(null);
    setSelectedBot(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserLogin('');
    setActivePage('dex-chains');
    setSelectedQuote(null);
    setSelectedBot(null);
  };

  const pageTitles = {
    en: {
      cex: 'CEX',
      dex: 'DEX',
      dexes: 'DEXes',
      'dex-chains': 'DEX Chains',
      'cex-chains': 'CEX Chains',
      'dex-rpc-urls': 'DEX RPC URLs',
      tokens: 'Tokens',
      pools: 'Pools',
      'dex-pairs': 'DEX Pairs',
      'cex-pairs': 'CEX Pairs',
      quotes: 'Quotes',
      'dex-jobs': 'DEX Jobs',
      'cex-jobs': 'CEX Jobs',
      bots: 'Bots',
      servers: 'Servers',
    },
    ru: {
      cex: 'CEX',
      dex: 'DEX',
      dexes: 'DEX-биржи',
      'dex-chains': 'DEX-сети',
      'cex-chains': 'CEX-сети',
      'dex-rpc-urls': 'DEX RPC URLs',
      tokens: 'Токены',
      pools: 'Пулы',
      'dex-pairs': 'DEX-пары',
      'cex-pairs': 'CEX-пары',
      quotes: 'Котировки',
      'dex-jobs': 'DEX-задачи',
      'cex-jobs': 'CEX-задачи',
      bots: 'Боты',
      servers: 'Серверы',
    },
  };

  const renderPage = () => {
    if (activePage === 'quotes' && selectedQuote) {
      return (
        <QuoteRelationsPage
          quoteName={selectedQuote.name}
          language={language}
          onBack={() => setSelectedQuote(null)}
        />
      );
    }

    if (activePage === 'bots' && selectedBot) {
      return (
        <BotDetailsPage
          botId={selectedBot.id}
          botName={selectedBot.name}
          language={language}
          onBack={() => setSelectedBot(null)}
        />
      );
    }

    switch (activePage) {
      case 'tokens':
        return <TokensPage language={language} />;
      case 'pools':
        return <PoolsPage language={language} />;
      case 'dex-chains':
      case 'cex-chains':
        return <ChainsPage language={language} type={activePage === 'cex-chains' ? 'cex' : 'dex'} />;
      case 'dex-pairs':
        return <PairsPage language={language} type="dex" />;
      case 'cex-pairs':
        return <PairsPage language={language} type="cex" />;
      case 'dex-jobs':
        return <JobsPage language={language} type="dex" />;
      case 'cex-jobs':
        return <JobsPage language={language} type="cex" />;
      case 'dex-rpc-urls':
        return <RpcUrlsPage language={language} />;
      case 'dexes':
        return <DexesPage language={language} />;
      case 'quotes':
        return (
          <QuotesListPage
            language={language}
            onQuoteClick={(id, name) => setSelectedQuote({ id, name })}
          />
        );
      case 'bots':
        return <BotsPage language={language} onBotClick={(bot) => setSelectedBot({ id: bot.id, name: bot.name })} />;
      case 'servers':
        return <ServersPage language={language} />;
      default:
        return <TokensPage language={language} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="size-full flex flex-col bg-background">
        <Toaster
          theme={isDark ? 'dark' : 'light'}
          position="bottom-right"
          richColors
        />
        <LoginForm onLogin={handleLogin} language={language} isDark={isDark} />
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col bg-background">
      <Toaster
        theme={isDark ? 'dark' : 'light'}
        position="bottom-right"
        richColors
      />
      <TopBar
        pageTitle={
          selectedQuote
            ? selectedQuote.name
            : selectedBot
            ? selectedBot.name
            : pageTitles[language][activePage as keyof typeof pageTitles.en]
        }
        onThemeToggle={() => setIsDark(!isDark)}
        isDark={isDark}
        language={language}
        onLanguageChange={setLanguage}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
        login={userLogin}
        role={userRole}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex overflow-hidden">
        {!sidebarCollapsed && (
          <Sidebar
            activeItem={activePage}
            onItemClick={(page) => {
              setActivePage(page);
              setSelectedQuote(null);
              setSelectedBot(null);
            }}
            language={language}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
