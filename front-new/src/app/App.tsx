import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { LoginForm } from './components/LoginForm';
import { TokensPage } from './components/pages/TokensPage';
import { BotsPage } from './components/pages/BotsPage';
import { BotDetailsPage } from './components/pages/BotDetailsPage';
import { ServersPage } from './components/pages/ServersPage';
import { ServerDetailsPage } from './components/pages/ServerDetailsPage';
import { ChainsPage } from './components/pages/ChainsPage';
import { PoolsPage } from './components/pages/PoolsPage';
import { PairsPage } from './components/pages/PairsPage';
import { JobsPage } from './components/pages/JobsPage';
import { JobBotsPage } from './components/pages/JobBotsPage';
import { RpcUrlsPage } from './components/pages/RpcUrlsPage';
import { DexesPage } from './components/pages/DexesPage';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [activePage, setActivePage] = useState('dex-chains');
  const [selectedBot, setSelectedBot] = useState<{ id: number; name: string } | null>(null);
  const [selectedServer, setSelectedServer] = useState<{
    id: number;
    name: string;
    highlightBotId?: number;
  } | null>(null);
  const [selectedDexJob, setSelectedDexJob] = useState<{ id: number; name: string } | null>(null);
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
    setSelectedBot(null);
    setSelectedServer(null);
    setSelectedDexJob(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserLogin('');
    setActivePage('dex-chains');
    setSelectedBot(null);
    setSelectedServer(null);
    setSelectedDexJob(null);
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
      'cex-pairs': 'CEX Pairs',
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
      'cex-pairs': 'CEX-пары',
      'dex-jobs': 'DEX-задачи',
      'cex-jobs': 'CEX-задачи',
      bots: 'Боты',
      servers: 'Серверы',
    },
  };

  const openBotServer = (bot: {
    id: number;
    name: string;
    serverId: number;
    serverName: string;
  }) => {
    setSelectedDexJob(null);
    setSelectedBot(null);
    setActivePage('servers');
    setSelectedServer({
      id: bot.serverId,
      name: bot.serverName,
      highlightBotId: bot.id,
    });
  };

  const renderPage = () => {
    if (activePage === 'dex-jobs' && selectedDexJob && selectedBot) {
      return (
        <BotDetailsPage
          botId={selectedBot.id}
          botName={selectedBot.name}
          language={language}
          onBack={() => setSelectedBot(null)}
        />
      );
    }

    if (activePage === 'dex-jobs' && selectedDexJob) {
      return (
        <JobBotsPage
          jobId={Number(selectedDexJob.id)}
          language={language}
          onBack={() => setSelectedDexJob(null)}
          onBotClick={(bot) => setSelectedBot(bot)}
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

    if (activePage === 'servers' && selectedServer) {
      return (
        <ServerDetailsPage
          serverId={selectedServer.id}
          serverName={selectedServer.name}
          language={language}
          onBack={() => setSelectedServer(null)}
          highlightBotId={selectedServer.highlightBotId}
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
      case 'cex-pairs':
        return <PairsPage language={language} />;
      case 'dex-jobs':
        return (
          <JobsPage
            language={language}
            type="dex"
            onDexJobClick={(jobId, jobName) =>
              setSelectedDexJob({ id: Number(jobId), name: jobName })
            }
          />
        );
      case 'cex-jobs':
        return <JobsPage language={language} type="cex" />;
      case 'dex-rpc-urls':
        return <RpcUrlsPage language={language} />;
      case 'dexes':
        return <DexesPage language={language} />;
      case 'bots':
        return (
          <BotsPage
            language={language}
            onBotClick={(bot) => setSelectedBot({ id: bot.id, name: bot.name })}
            onBotServerClick={openBotServer}
          />
        );
      case 'servers':
        return (
          <ServersPage
            language={language}
            onServerClick={(server) => setSelectedServer({ id: server.id, name: server.name })}
          />
        );
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
          selectedBot
            ? selectedBot.name
            : selectedDexJob
            ? language === 'ru'
              ? `Job ID: ${selectedDexJob.id} — связи`
              : `Job ID: ${selectedDexJob.id} — relations`
            : selectedServer
            ? selectedServer.name
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
              setSelectedBot(null);
              setSelectedServer(null);
              setSelectedDexJob(null);
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
