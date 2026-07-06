import { ArrowLeft, BookOpen, Users, Code2 } from 'lucide-react';

type Lang = 'en' | 'ru';

type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; lines: string[] };

interface Section {
  id: string;
  icon: React.ReactNode;
  title: { en: string; ru: string };
  blocks: { en: Block[]; ru: Block[] };
}

const sections: Section[] = [
  {
    id: 'overview',
    icon: <BookOpen className="w-4 h-4" />,
    title: { en: 'Overview', ru: 'Обзор' },
    blocks: {
      en: [
        {
          type: 'p',
          text: 'This panel manages the configuration of the crypto-arbitrage system. You describe where and what to watch (chains, pairs, pools, jobs) and who executes it (bots on servers). The backend reads this configuration and runs the arbitrage logic.',
        },
        {
          type: 'p',
          text: 'Everything is split into two markets — CEX (centralized exchanges) and DEX (on-chain exchanges) — plus shared Bots and Servers.',
        },
      ],
      ru: [
        {
          type: 'p',
          text: 'Панель управляет конфигурацией системы крипто-арбитража. Вы описываете, где и что отслеживать (сети, пары, пулы, задачи) и кто это исполняет (боты на серверах). Бэкенд читает эту конфигурацию и запускает логику арбитража.',
        },
        {
          type: 'p',
          text: 'Всё разделено на два рынка — CEX (централизованные биржи) и DEX (ончейн-биржи) — плюс общие Боты и Серверы.',
        },
      ],
    },
  },
  {
    id: 'entities',
    icon: <BookOpen className="w-4 h-4" />,
    title: { en: 'Entities', ru: 'Сущности' },
    blocks: {
      en: [
        {
          type: 'ul',
          items: [
            'Chains (CEX / DEX) — networks / blockchains the system works with.',
            'RPC URLs (DEX) — node endpoints used to read data from a chain.',
            'Tokens (DEX) — tokens within a chain.',
            'DEXes — on-chain exchanges (Uniswap-like).',
            'Pools (DEX) — liquidity pools (token pairs on a DEX).',
            'Pairs (CEX) — trading pairs on centralized exchanges.',
            'Jobs (CEX / DEX) — monitoring tasks: what to observe and how.',
            'Bots — executors bound to a Job and running on a Server.',
            'Servers — machines that host bots.',
          ],
        },
        {
          type: 'p',
          text: 'Key relations: a Job has Bots and (for DEX) Pools; a Bot belongs to one Server and one Job. From a Job you can open its bots and pools; from a Bot you can jump to its Job and Server.',
        },
      ],
      ru: [
        {
          type: 'ul',
          items: [
            'Сети / Chains (CEX / DEX) — сети / блокчейны, с которыми работает система.',
            'RPC URLs (DEX) — адреса узлов для чтения данных из сети.',
            'Токены / Tokens (DEX) — токены внутри сети.',
            'DEX / DEXes — ончейн-биржи (типа Uniswap).',
            'Пулы / Pools (DEX) — пулы ликвидности (пары токенов на DEX).',
            'Пары / Pairs (CEX) — торговые пары на централизованных биржах.',
            'Задачи / Jobs (CEX / DEX) — задачи мониторинга: что и как отслеживать.',
            'Боты / Bots — исполнители, привязанные к Задаче и работающие на Сервере.',
            'Серверы / Servers — машины, на которых крутятся боты.',
          ],
        },
        {
          type: 'p',
          text: 'Ключевые связи: у Задачи есть Боты и (для DEX) Пулы; Бот принадлежит одному Серверу и одной Задаче. Из Задачи открываются её боты и пулы; из Бота — переход к его Задаче и Серверу.',
        },
      ],
    },
  },
  {
    id: 'workflow',
    icon: <Users className="w-4 h-4" />,
    title: { en: 'Setup order (operator)', ru: 'Порядок настройки (оператор)' },
    blocks: {
      en: [
        { type: 'p', text: 'DEX market — recommended order (each step depends on the previous):' },
        {
          type: 'ol',
          items: [
            'DEX → Chains — add the networks you need.',
            'DEX → RPC URLs — add node endpoints for those chains.',
            'DEX → Tokens — add the tokens you will trade.',
            'DEX → DEXes — add the on-chain exchanges.',
            'DEX → Pools — add liquidity pools (token pairs on a DEX).',
            'DEX → Jobs — create monitoring jobs, then attach pools to a job (job → pools).',
            'Servers — register the machines that will run bots.',
            'Bots — create bots and bind each to a Job and a Server.',
          ],
        },
        { type: 'p', text: 'CEX market — recommended order:' },
        {
          type: 'ol',
          items: [
            'CEX → Chains — add the exchanges/networks.',
            'CEX → Pairs — add trading pairs.',
            'CEX → Jobs — create monitoring jobs.',
            'Bots — you can bulk-create CEX bots from jobs, then bulk-assign a server.',
          ],
        },
      ],
      ru: [
        { type: 'p', text: 'Рынок DEX — рекомендуемый порядок (каждый шаг зависит от предыдущего):' },
        {
          type: 'ol',
          items: [
            'DEX → Сети — добавьте нужные сети.',
            'DEX → RPC URLs — добавьте адреса узлов для этих сетей.',
            'DEX → Токены — добавьте токены, которыми будете торговать.',
            'DEX → DEX-биржи — добавьте ончейн-биржи.',
            'DEX → Пулы — добавьте пулы ликвидности (пары токенов на DEX).',
            'DEX → Задачи — создайте задачи мониторинга и привяжите к задаче пулы (задача → пулы).',
            'Серверы — зарегистрируйте машины, на которых будут работать боты.',
            'Боты — создайте ботов и привяжите каждого к Задаче и Серверу.',
          ],
        },
        { type: 'p', text: 'Рынок CEX — рекомендуемый порядок:' },
        {
          type: 'ol',
          items: [
            'CEX → Сети — добавьте биржи/сети.',
            'CEX → Пары — добавьте торговые пары.',
            'CEX → Задачи — создайте задачи мониторинга.',
            'Боты — можно массово создать CEX-ботов из задач, затем массово назначить сервер.',
          ],
        },
      ],
    },
  },
  {
    id: 'ui',
    icon: <Users className="w-4 h-4" />,
    title: { en: 'Working with tables', ru: 'Работа с таблицами' },
    blocks: {
      en: [
        {
          type: 'ul',
          items: [
            'Add — the button in the table header opens a form dialog.',
            'Edit — use the row action to open the same form pre-filled.',
            'Delete — deletes with an undo toast; you can cancel before it commits.',
            'Bulk actions — select rows with checkboxes, then use the header menu (e.g. delete selected).',
            'Sort / filter — column headers support sorting and filtering.',
            'Theme & language — switch dark/light and EN/RU from the profile menu (top-right).',
          ],
        },
      ],
      ru: [
        {
          type: 'ul',
          items: [
            'Добавить — кнопка в шапке таблицы открывает форму в диалоге.',
            'Редактировать — действие в строке открывает ту же форму с заполненными полями.',
            'Удалить — удаляет с всплывающим уведомлением и возможностью отменить до подтверждения.',
            'Массовые действия — отметьте строки чекбоксами и используйте меню в шапке (например, удалить выбранные).',
            'Сортировка / фильтр — заголовки колонок поддерживают сортировку и фильтрацию.',
            'Тема и язык — тёмная/светлая и EN/RU переключаются в меню профиля (справа вверху).',
          ],
        },
      ],
    },
  },
  {
    id: 'dev',
    icon: <Code2 className="w-4 h-4" />,
    title: { en: 'For developers', ru: 'Для разработчиков' },
    blocks: {
      en: [
        {
          type: 'p',
          text: 'The active frontend is front-new: React + Vite + TypeScript, Redux Toolkit + redux-saga for state, Tailwind + shadcn/ui for UI, and a custom route parser (no <Routes>) in routing/appRoutes.ts.',
        },
        { type: 'p', text: 'Run locally (from front-new/):' },
        {
          type: 'code',
          lines: [
            'pnpm install',
            'pnpm dev      # Vite dev server → http://localhost:5173',
            'pnpm build    # production build',
            'pnpm test     # vitest',
          ],
        },
        {
          type: 'p',
          text: 'Project layout under front-new/src/app: components (shared UI), components/pages (one per screen), components/forms (create/edit dialogs), store/db-config (RTK slice + sagas + selectors + api), routing/appRoutes.ts, services/api-service.ts, utils.',
        },
        {
          type: 'p',
          text: 'API base URLs come from env vars VITE_HOST_URL and VITE_CEX_QUOTES_URL (see services/api-service.ts). Docker: `docker compose up --build -d` builds frontend-new (DockerfileFrontendReact, port 4203), backend (3001), postgres and pgadmin.',
        },
        {
          type: 'ul',
          items: [
            'i18n: every component takes a language prop and a local t = { en, ru } object — no i18n library.',
            'Styling: use semantic Tailwind tokens (bg-background, text-foreground, border-border, bg-primary…), not raw colors.',
            'State: server data lives in the dbConfig slice, loaded via sagas; read it with selectors and useAppSelector.',
            'Routing: navigate() with path helpers from appRoutes.ts; add new routes to parseAppRoute + ParsedRoute.',
            'AI agents: see the project skill at .claude/skills/arbidex-frontend for conventions before editing.',
          ],
        },
      ],
      ru: [
        {
          type: 'p',
          text: 'Актуальный фронтенд — front-new: React + Vite + TypeScript, Redux Toolkit + redux-saga для состояния, Tailwind + shadcn/ui для UI и собственный парсер маршрутов (без <Routes>) в routing/appRoutes.ts.',
        },
        { type: 'p', text: 'Запуск локально (из front-new/):' },
        {
          type: 'code',
          lines: [
            'pnpm install',
            'pnpm dev      # dev-сервер Vite → http://localhost:5173',
            'pnpm build    # продакшн-сборка',
            'pnpm test     # vitest',
          ],
        },
        {
          type: 'p',
          text: 'Структура front-new/src/app: components (общий UI), components/pages (по экрану на файл), components/forms (диалоги создания/редактирования), store/db-config (RTK-slice + саги + селекторы + api), routing/appRoutes.ts, services/api-service.ts, utils.',
        },
        {
          type: 'p',
          text: 'Базовые URL API берутся из переменных VITE_HOST_URL и VITE_CEX_QUOTES_URL (см. services/api-service.ts). Docker: `docker compose up --build -d` собирает frontend-new (DockerfileFrontendReact, порт 4203), backend (3001), postgres и pgadmin.',
        },
        {
          type: 'ul',
          items: [
            'i18n: каждый компонент принимает проп language и локальный объект t = { en, ru } — без i18n-библиотеки.',
            'Стили: используйте семантические Tailwind-токены (bg-background, text-foreground, border-border, bg-primary…), не сырые цвета.',
            'Состояние: серверные данные лежат в slice dbConfig, грузятся через саги; читаются селекторами и useAppSelector.',
            'Роутинг: navigate() с хелперами путей из appRoutes.ts; новые маршруты добавляйте в parseAppRoute + ParsedRoute.',
            'AI-агентам: перед правками смотрите проектный навык в .claude/skills/arbidex-frontend.',
          ],
        },
      ],
    },
  },
];

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case 'p':
      return (
        <p key={index} className="text-sm leading-relaxed text-muted-foreground">
          {block.text}
        </p>
      );
    case 'ul':
      return (
        <ul key={index} className="list-disc pl-5 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={index} className="list-decimal pl-5 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case 'code':
      return (
        <pre
          key={index}
          className="text-xs leading-relaxed bg-muted text-foreground rounded p-3 overflow-x-auto font-mono"
        >
          {block.lines.join('\n')}
        </pre>
      );
    default:
      return null;
  }
}

export function GuidePage({
  language,
  onBack,
}: {
  language: Lang;
  onBack: () => void;
}) {
  const t = {
    en: { title: 'Project guide', back: 'Back', subtitle: 'How to work with this project' },
    ru: { title: 'Инструкция по проекту', back: 'Назад', subtitle: 'Как работать с этим проектом' },
  }[language];

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      <div className="h-14 shrink-0 border-b border-border flex items-center gap-3 px-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-muted text-foreground hover:bg-accent transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>
        <div>
          <h1 className="text-foreground">{t.title}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          {sections.map((section) => (
            <section key={section.id} className="space-y-3">
              <div className="flex items-center gap-2 text-foreground">
                <span className="text-muted-foreground">{section.icon}</span>
                <h2 className="text-base font-semibold">{section.title[language]}</h2>
              </div>
              <div className="space-y-3">
                {section.blocks[language].map((block, i) => renderBlock(block, i))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
