import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
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
import { DexJobRelationsPage } from './components/pages/DexJobRelationsPage';
import { RpcUrlsPage } from './components/pages/RpcUrlsPage';
import { DexesPage } from './components/pages/DexesPage';
import {
  botPath,
  jobBotPath,
  jobPath,
  jobPoolsPath,
  NavigationState,
  parseAppRoute,
  serverPath,
  sidebarIdFromRoute,
  sidebarPath,
} from './routing/appRoutes';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const route = useMemo(
    () => parseAppRoute(location.pathname, location.search),
    [location.pathname, location.search],
  );
  const navState = (location.state ?? {}) as NavigationState;

  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userLogin, setUserLogin] = useState('');
  const [userRole, setUserRole] = useState('admin');

  const activePage = sidebarIdFromRoute(route);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      navigate(sidebarPath('dex-chains'), { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const handleLogin = (_login: string, _password: string) => {
    setUserLogin(_login);
    setIsAuthenticated(true);
    navigate(sidebarPath('dex-chains'), { replace: true });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserLogin('');
    navigate(sidebarPath('dex-chains'), { replace: true });
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

  const openBotJob = (payload: { jobId: number; jobName: string; botId: number }) => {
    navigate(jobPath(payload.jobId, { highlightBot: payload.botId }), {
      state: { jobName: payload.jobName } satisfies NavigationState,
    });
  };

  const openBotServer = (bot: {
    id: number;
    name: string;
    serverId: number;
    serverName: string;
  }) => {
    const fromJob = route.kind === 'job-bot' ? route.jobId : undefined;

    navigate(
      serverPath(bot.serverId, {
        highlightBot: bot.id,
        fromBot: bot.id,
        fromJob,
      }),
      {
        state: {
          serverName: bot.serverName,
          botName: bot.name,
          ...(fromJob != null ? { jobName: navState.jobName } : {}),
        } satisfies NavigationState,
      },
    );
  };

  const handleServerBack = () => {
    if (route.kind !== 'server' || route.fromBot == null) {
      navigate(sidebarPath('servers'));
      return;
    }

    if (route.fromJob != null) {
      navigate(jobBotPath(route.fromJob, route.fromBot), {
        state: {
          botName: navState.botName,
          jobName: navState.jobName,
        } satisfies NavigationState,
      });
      return;
    }

    navigate(botPath(route.fromBot), {
      state: { botName: navState.botName } satisfies NavigationState,
    });
  };

  const pageTitle = useMemo(() => {
    switch (route.kind) {
      case 'bot':
        return navState.botName ?? `Bot #${route.botId}`;
      case 'job-bot':
        return navState.botName ?? `Bot #${route.botId}`;
      case 'job':
        return language === 'ru'
          ? `Job ID: ${route.jobId} — боты`
          : `Job ID: ${route.jobId} — bots`;
      case 'job-pools':
        return language === 'ru'
          ? `Job ID: ${route.jobId} — пулы`
          : `Job ID: ${route.jobId} — pools`;
      case 'server':
        return navState.serverName ?? `Server #${route.serverId}`;
      default:
        return pageTitles[language][route.page as keyof typeof pageTitles.en];
    }
  }, [language, navState.botName, navState.jobName, navState.serverName, pageTitles, route]);

  const renderPage = () => {
    if (route.kind === 'job-bot') {
      return (
        <BotDetailsPage
          botId={route.botId}
          botName={navState.botName ?? `Bot #${route.botId}`}
          language={language}
          backLabel={
            language === 'ru' ? `К Job:${route.jobId}` : `Back to Job:${route.jobId}`
          }
          onBack={() =>
            navigate(jobPath(route.jobId), {
              state: { jobName: navState.jobName } satisfies NavigationState,
            })
          }
          onGoToJob={openBotJob}
          onGoToServer={openBotServer}
        />
      );
    }

    if (route.kind === 'job-pools') {
      return (
        <DexJobRelationsPage
          jobId={route.jobId}
          jobName={navState.jobName ?? `Job #${route.jobId}`}
          language={language}
          onBack={() =>
            navigate(sidebarPath('dex-jobs', { highlightJob: route.jobId }))
          }
        />
      );
    }

    if (route.kind === 'job') {
      return (
        <JobBotsPage
          jobId={route.jobId}
          language={language}
          highlightBotId={route.highlightBot}
          onBack={() =>
            navigate(sidebarPath('dex-jobs', { highlightJob: route.jobId }))
          }
          onBotClick={(bot) =>
            navigate(jobBotPath(route.jobId, bot.id), {
              state: {
                botName: bot.name,
                jobName: navState.jobName,
              } satisfies NavigationState,
            })
          }
        />
      );
    }

    if (route.kind === 'bot') {
      return (
        <BotDetailsPage
          botId={route.botId}
          botName={navState.botName ?? `Bot #${route.botId}`}
          language={language}
          onBack={() => navigate(sidebarPath('bots'))}
          onGoToJob={openBotJob}
          onGoToServer={openBotServer}
        />
      );
    }

    if (route.kind === 'server') {
      return (
        <ServerDetailsPage
          serverId={route.serverId}
          serverName={navState.serverName ?? `Server #${route.serverId}`}
          language={language}
          backLabel={
            route.fromBot != null
              ? language === 'ru'
                ? `К Bot:${route.fromBot}`
                : `Back to Bot:${route.fromBot}`
              : undefined
          }
          onBack={handleServerBack}
          highlightBotId={route.highlightBot}
        />
      );
    }

    switch (route.page) {
      case 'tokens':
        return <TokensPage language={language} />;
      case 'pools':
        return <PoolsPage language={language} />;
      case 'dex-chains':
      case 'cex-chains':
        return (
          <ChainsPage
            language={language}
            type={route.page === 'cex-chains' ? 'cex' : 'dex'}
          />
        );
      case 'cex-pairs':
        return <PairsPage language={language} />;
      case 'dex-jobs':
        return (
          <JobsPage
            language={language}
            type="dex"
            highlightJobId={route.highlightJob ?? null}
            onDexJobBotsClick={(jobId, jobName) =>
              navigate(jobPath(jobId), {
                state: { jobName } satisfies NavigationState,
              })
            }
            onDexJobPoolsClick={(jobId, jobName) =>
              navigate(jobPoolsPath(jobId), {
                state: { jobName } satisfies NavigationState,
              })
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
            onBotClick={(bot) =>
              navigate(botPath(bot.id), {
                state: { botName: bot.name } satisfies NavigationState,
              })
            }
            onBotServerClick={openBotServer}
          />
        );
      case 'servers':
        return (
          <ServersPage
            language={language}
            onServerClick={(server) =>
              navigate(serverPath(server.id), {
                state: { serverName: server.name } satisfies NavigationState,
              })
            }
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
        pageTitle={pageTitle}
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
            onItemClick={(page) => navigate(sidebarPath(page as Parameters<typeof sidebarPath>[0]))}
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
