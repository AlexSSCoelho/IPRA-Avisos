import React from 'react';
import { Home, PenSquare, BookOpen, Archive } from 'lucide-react';

export type AppTabType = 'home' | 'diacono' | 'pulpito' | 'historico';

interface BottomNavProps {
  currentTab: AppTabType;
  setCurrentTab: (tab: AppTabType) => void;
  totalPendentes: number;
  isPulpitMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  totalPendentes,
  isPulpitMode,
}) => {
  const tabs: { id: AppTabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Início', icon: <Home className="w-5 h-5 shrink-0" /> },
    { id: 'diacono', label: 'Enviar Aviso', icon: <PenSquare className="w-5 h-5 shrink-0" /> },
    { id: 'pulpito', label: 'Púlpito', icon: <BookOpen className="w-5 h-5 shrink-0" />, badge: totalPendentes },
    { id: 'historico', label: 'Histórico', icon: <Archive className="w-5 h-5 shrink-0" /> },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 border-t-2 transition-colors duration-200 ${
        isPulpitMode
          ? 'bg-[#081529] border-[#1C3559] text-white'
          : 'bg-white dark:bg-[#081529] text-[#0D213A] dark:text-white border-[#D5E2F0] dark:border-[#1C3559]'
      } pb-[env(safe-area-inset-bottom,0px)] shadow-lg`}
      aria-label="Navegação principal"
    >
      <div className="w-full max-w-3xl mx-auto grid grid-cols-4 min-h-[64px]">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 transition-all duration-150 active:scale-95 relative ${
                isActive
                  ? 'text-[#03589E] dark:text-[#FBB016] font-extrabold bg-[#E8F2FC]/60 dark:bg-[#03589E]/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#062552] dark:hover:text-white font-semibold'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-3 right-3 h-1 bg-[#03589E] dark:bg-[#FBB016] rounded-b-full" />
              )}
              <div className="relative flex items-center justify-center">
                {tab.icon}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-2 -right-3.5 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-black bg-[#E85D04] text-white flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs leading-tight tracking-tight max-w-full px-0.5 text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
