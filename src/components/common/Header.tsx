import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  LogOut,
  Settings,
  ChevronDown,
  Sparkles,
  Type,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCulto } from '../../context/CultoContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { getCargoLabel } from '../../utils/formatters';

interface HeaderProps {
  onNavigateHome?: () => void;
  onOpenIniciarCultoModal?: () => void;
  onOpenSettingsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onOpenIniciarCultoModal,
  onOpenSettingsModal,
}) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { isDirigente, cultoAtivo } = useCulto();
  const {
    isPulpitMode,
    soundEnabled,
    setSoundEnabled,
    fontScale,
  } = useAccessibility();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const cultoEmAndamento = Boolean(cultoAtivo && cultoAtivo.status === 'em_andamento');

  return (
    <header
      className={`${
        isPulpitMode
          ? 'bg-[#040B16] border-[#1C3559]'
          : 'bg-[#062552] border-[#03589E]'
      } text-white border-b-2 sticky top-0 z-40 shadow-md w-full max-w-full shrink-0`}
    >
      <div className="w-full max-w-3xl mx-auto px-3 py-2 flex items-center justify-between gap-1.5">
        {/* Identidade Oficial IPRA / IPRB */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2 min-w-0 text-left active:scale-[0.98] transition-transform py-0.5"
        >
          <div className="w-9 h-9 rounded-full bg-white p-0.5 border-2 border-[#03589E] flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
            <img
              src="/logo-ipra-emblem.png"
              alt="Logo IPRB Auriflama"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 leading-tight">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white truncate">
                IPRA Auriflama
              </span>
            </div>
            <div className="text-xs text-sky-100/90 flex items-center gap-1.5 mt-0.5 truncate">
              {cultoEmAndamento && cultoAtivo ? (
                <>
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBB016] opacity-80"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E85D04]"></span>
                  </span>
                  <span className="truncate font-semibold text-[#FBB016]">
                    {cultoAtivo.nomeCulto}
                  </span>
                </>
              ) : (
                <span className="truncate text-sky-200/80 font-medium">
                  Nenhum culto aberto
                </span>
              )}
            </div>
          </div>
        </button>

        {/* Controles do Topo (Acessibilidade, Ajustes e Perfil) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Botão rápido de Ajustes / Letra */}
          <button
            type="button"
            onClick={onOpenSettingsModal}
            className="min-h-[44px] px-2.5 rounded-xl bg-[#0A356B] hover:bg-[#03589E] active:scale-95 border border-sky-300/25 text-white flex items-center gap-1.5 transition-all shadow-sm text-xs font-bold"
            title="Ajustes, Letra e Tema"
          >
            <Settings className="w-4 h-4 text-[#FBB016] shrink-0" />
            <span className="hidden sm:inline">Ajustes</span>
          </button>

          {/* Perfil do Usuário */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="min-h-[44px] flex items-center gap-1.5 pl-3 pr-2.5 rounded-xl bg-[#03589E] hover:bg-[#0A6AC0] transition-all border border-sky-300/35 text-xs sm:text-sm font-bold text-white active:scale-95 shadow-sm"
            >
              <span className="truncate max-w-[85px] sm:max-w-[130px]">
                {currentUser?.nome.split(' ')[0]}
              </span>
              <ChevronDown className="w-4 h-4 text-sky-100 shrink-0" />
            </button>

            {/* Menu Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#081529] rounded-2xl shadow-2xl border border-[#D5E2F0] dark:border-[#1C3559] py-2 text-[#0D213A] dark:text-white z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16]">
                    <div className="font-extrabold text-base text-[#062552] dark:text-white truncate">
                      {currentUser?.nome}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-1 flex-wrap font-semibold">
                      <span>{getCargoLabel(currentUser?.cargo)}</span>
                      {isDirigente && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-[#FFF4E5] text-[#B45309] border border-[#F59E0B]/40">
                          Dirigente
                        </span>
                      )}
                      {isAdmin && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-[#E8F2FC] text-[#03589E] border border-[#03589E]/30">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1.5 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setSoundEnabled(!soundEnabled);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[#F4F7FB] dark:hover:bg-[#0D1E38] flex items-center justify-between gap-2 font-semibold transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        {soundEnabled ? (
                          <Volume2 className="w-5 h-5 text-[#03589E] dark:text-sky-400 shrink-0" />
                        ) : (
                          <VolumeX className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                        <span>Sons de Aviso</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        soundEnabled
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {soundEnabled ? 'Ligado' : 'Mudo'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenSettingsModal();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[#F4F7FB] dark:hover:bg-[#0D1E38] flex items-center justify-between gap-2 font-semibold transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <Type className="w-5 h-5 text-[#03589E] dark:text-sky-400 shrink-0" />
                        <span>Ajustes e Fonte</span>
                      </span>
                      <span className="text-xs font-bold text-[#03589E] dark:text-sky-300">
                        {Math.round(fontScale * 100)}%
                      </span>
                    </button>

                    {isAdmin && onOpenIniciarCultoModal && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenIniciarCultoModal();
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-[#E8F2FC] dark:hover:bg-[#0D1E38] flex items-center gap-2.5 text-[#03589E] dark:text-[#FBB016] font-bold transition-colors"
                      >
                        <Sparkles className="w-5 h-5 shrink-0" />
                        <span>Iniciar Novo Culto</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-3 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 border-t border-[#D5E2F0] dark:border-[#1C3559] mt-1 transition-colors font-bold"
                    >
                      <LogOut className="w-5 h-5 shrink-0" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
