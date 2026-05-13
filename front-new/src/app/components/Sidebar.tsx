import {
  Database,
  Link,
  Coins,
  Droplet,
  ArrowLeftRight,
  MessageSquare,
  Zap,
  Server,
  Bot,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  Activity,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SubMenuItem {
  id: string;
  label: { en: string; ru: string };
}

interface MenuItem {
  id: string;
  label: { en: string; ru: string };
  icon: React.ReactNode;
  submenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'cex',
    label: { en: 'CEX', ru: 'CEX' },
    icon: <Building2 className="w-4 h-4" />,
    submenu: [
      { id: 'cex-chains', label: { en: 'Chains', ru: 'Сети' } },
      { id: 'cex-pairs', label: { en: 'Pairs', ru: 'Пары' } },
      { id: 'cex-jobs', label: { en: 'Jobs', ru: 'Задачи' } },
    ],
  },
  {
    id: 'dex',
    label: { en: 'DEX', ru: 'DEX' },
    icon: <Activity className="w-4 h-4" />,
    submenu: [
      { id: 'dex-chains', label: { en: 'Chains', ru: 'Сети' } },
      { id: 'dex-pairs', label: { en: 'Pairs', ru: 'Пары' } },
      { id: 'dex-jobs', label: { en: 'Jobs', ru: 'Задачи' } },
      { id: 'tokens', label: { en: 'Tokens', ru: 'Токены' } },
      { id: 'pools', label: { en: 'Pools', ru: 'Пулы' } },
      { id: 'dexes', label: { en: 'DEXes', ru: 'DEX-биржи' } },
      { id: 'quotes', label: { en: 'Quotes', ru: 'Котировки' } },
      { id: 'dex-rpc-urls', label: { en: 'RPC URLs', ru: 'RPC URLs' } },
    ],
  },
  { id: 'bots', label: { en: 'Bots', ru: 'Боты' }, icon: <Bot className="w-4 h-4" /> },
  { id: 'servers', label: { en: 'Servers', ru: 'Серверы' }, icon: <Server className="w-4 h-4" /> },
];

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  language: 'en' | 'ru';
}

export function Sidebar({ activeItem, onItemClick, language }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['cex', 'dex']);
  const [showCollapseButton, setShowCollapseButton] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menuId: string) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter((id) => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };

  const isItemActive = (item: MenuItem) => {
    if (item.id === activeItem) return true;
    return item.submenu?.some((sub) => sub.id === activeItem);
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (menuContainerRef.current && sidebarRef.current) {
        const menuHeight = menuContainerRef.current.scrollHeight;
        const containerHeight = menuContainerRef.current.clientHeight;
        setShowCollapseButton(menuHeight > containerHeight);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    const timeoutId = setTimeout(checkOverflow, 100);

    return () => {
      window.removeEventListener('resize', checkOverflow);
      clearTimeout(timeoutId);
    };
  }, [expandedMenus]);

  return (
    <div
      ref={sidebarRef}
      className={`bg-sidebar border-r border-sidebar-border flex flex-col transition-all ${
        collapsed ? 'w-16' : 'w-52'
      }`}
    >
      <div ref={menuContainerRef} className="flex-1 py-2 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.submenu) {
                  toggleMenu(item.id);
                } else {
                  onItemClick(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                isItemActive(item)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
              title={collapsed ? item.label[language] : undefined}
            >
              <span className={isItemActive(item) ? 'text-primary' : 'text-muted-foreground'}>
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="text-sm flex-1 text-left">{item.label[language]}</span>
                  {item.submenu && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${
                        expandedMenus.includes(item.id) ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </>
              )}
            </button>

            {item.submenu && !collapsed && expandedMenus.includes(item.id) && (
              <div className="bg-sidebar-accent/30">
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onItemClick(subItem.id)}
                    className={`w-full flex items-center gap-3 pl-12 pr-4 py-2 transition-colors ${
                      activeItem === subItem.id
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <span className="text-sm">{subItem.label[language]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showCollapseButton && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-12 border-t border-sidebar-border flex items-center justify-center hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      )}
    </div>
  );
}
