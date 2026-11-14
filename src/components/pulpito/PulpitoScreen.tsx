import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAvisos } from '../../context/AvisosContext';
import { useCulto } from '../../context/CultoContext';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { AvisoCardPulpito } from './AvisoCardPulpito';
import { AdminPassModal } from '../auth/AdminPassModal';
import { audioFeedback } from '../../services/audioService';
import type { TipoAviso } from '../../types';
import {
  CheckCircle2,
  ListChecks,
  History,
  Flag,
  Maximize2,
  Minimize2,
  Crown,
  Church,
  AlertTriangle,
  Lock,
  UserPlus,
  HeartHandshake,
  Calendar,
  Megaphone,
  Layers,
  MoreHorizontal,
  Type,
  X,
} from 'lucide-react';

type SubTabPulpito = 'pendentes' | 'anunciados';
type FiltroCategoria = 'todos' | TipoAviso;

const FILTROS_CATEGORIA: {
  id: FiltroCategoria;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'todos', label: 'Todos', icon: Layers },
  { id: 'visitante', label: 'Visitantes', icon: UserPlus },
  { id: 'oracao', label: 'Orações', icon: HeartHandshake },
  { id: 'reuniao', label: 'Reuniões', icon: Calendar },
  { id: 'geral', label: 'Comunicados', icon: Megaphone },
];

export const PulpitoScreen: React.FC = () => {
  const {
    avisosPendentes,
    avisosAnunciados,
    isCultoEmAndamento,
    marcarComoAnunciado,
    desmarcarComoAnunciado,
  } = useAvisos();
  const { cultoAtivo, isDirigente, dirigenteAtualNome, finalizarCulto } = useCulto();
  const { isAdmin } = useAuth();
  const {
    fontScale,
    setFontScale,
    modoFocadoPulpito,
    toggleModoFocadoPulpito,
    soundEnabled,
  } = useAccessibility();

  const [subTab, setSubTab] = useState<SubTabPulpito>('pendentes');
  const [filtroCat, setFiltroCat] = useState<FiltroCategoria>('todos');
  const [showMaisMenu, setShowMaisMenu] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [confirmEndCulto, setConfirmEndCulto] = useState(false);
  const [erroCulto, setErroCulto] = useState<string | null>(null);

  const canManagePulpito = isDirigente || isAdmin;

  // Toca som discreto quando chega um novo aviso pendente após a abertura da tela
  const prevPendentesRef = useRef<number>(avisosPendentes.length);
  useEffect(() => {
    if (avisosPendentes.length > prevPendentesRef.current && soundEnabled) {
      audioFeedback.playPulpitNotificationSound();
    }
    prevPendentesRef.current = avisosPendentes.length;
  }, [avisosPendentes.length, soundEnabled]);

  // Ordena pedidos de oração URGENTES no topo da lista pendente
  const pendentesOrdenados = useMemo(() => {
    const filtrados =
      filtroCat === 'todos'
        ? avisosPendentes
        : avisosPendentes.filter((a) => a.tipo === filtroCat);

    return [...filtrados].sort((a, b) => {
      const aUrgente = a.tipo === 'oracao' && a.oracao?.urgente ? 1 : 0;
      const bUrgente = b.tipo === 'oracao' && b.oracao?.urgente ? 1 : 0;
      if (aUrgente !== bUrgente) return bUrgente - aUrgente;
      return 0;
    });
  }, [avisosPendentes, filtroCat]);

  const anunciadosFiltrados = useMemo(() => {
    return filtroCat === 'todos'
      ? avisosAnunciados
      : avisosAnunciados.filter((a) => a.tipo === filtroCat);
  }, [avisosAnunciados, filtroCat]);

  const listaExibida = subTab === 'pendentes' ? pendentesOrdenados : anunciadosFiltrados;

  const handleFinalizarCulto = () => {
    setErroCulto(null);
    const res = finalizarCulto();
    if (!res.success) {
      setErroCulto(res.message || 'Não foi possível encerrar o culto.');
    } else {
      setConfirmEndCulto(false);
      setShowMaisMenu(false);
    }
  };

  if (!isCultoEmAndamento) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-[#081529] rounded-3xl border border-[#D5E2F0] dark:border-[#1C3559] p-8 text-center shadow-card">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E8F2FC] dark:bg-[#0D1E38] flex items-center justify-center border border-[#D5E2F0] dark:border-[#1C3559]">
            <Church className="w-8 h-8 text-[#03589E] dark:text-[#60A5FA]" />
          </div>
          <h2 className="text-lg font-extrabold text-[#062552] dark:text-white">
            Nenhum culto aberto
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Abra um culto na tela inicial para acompanhar os avisos.
          </p>
        </div>
      </div>
    );
  }

  const filtroAtualLabel = FILTROS_CATEGORIA.find((f) => f.id === filtroCat)?.label;

  return (
    <div className="space-y-3.5 pb-6">
      {/* Barra Compacta — Lei de Hick: apenas 3 ações principais visíveis */}
      <section className="bg-white dark:bg-[#081529] rounded-3xl border border-[#D5E2F0] dark:border-[#1C3559] p-3.5 sm:p-4 shadow-card space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <h2 className="text-base sm:text-lg font-extrabold text-[#062552] dark:text-white leading-snug">
                {cultoAtivo?.nomeCulto}
              </h2>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">
              Dirigente: <strong className="text-[#062552] dark:text-white">{dirigenteAtualNome}</strong>
              {cultoAtivo?.horarioInicio ? ` • ${cultoAtivo.horarioInicio}` : ''}
            </p>
          </div>

          {modoFocadoPulpito && (
            <button
              type="button"
              onClick={toggleModoFocadoPulpito}
              className="px-3 py-1.5 rounded-xl bg-[#E85D04] text-white text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          )}
        </div>

        {/* 3 Ações Principais: Para Ler | Já Lidos | Mais */}
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-stretch gap-1.5">
          <button
            type="button"
            onClick={() => setSubTab('pendentes')}
            className={`min-w-0 py-2.5 px-2 sm:px-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 flex items-center justify-center gap-1.5 transition-all min-h-[46px] ${
              subTab === 'pendentes'
                ? 'bg-[#03589E] border-[#03589E] text-white shadow-sm'
                : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-200'
            }`}
          >
            <ListChecks className="w-4 h-4 shrink-0 hidden sm:inline" />
            <span className="whitespace-nowrap">Para Ler ({avisosPendentes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('anunciados')}
            className={`min-w-0 py-2.5 px-2 sm:px-3 rounded-2xl font-extrabold text-xs sm:text-sm border-2 flex items-center justify-center gap-1.5 transition-all min-h-[46px] ${
              subTab === 'anunciados'
                ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm'
                : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-200'
            }`}
          >
            <History className="w-4 h-4 shrink-0 hidden sm:inline" />
            <span className="whitespace-nowrap">Já Lidos ({avisosAnunciados.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMaisMenu((p) => !p)}
            aria-expanded={showMaisMenu}
            className={`px-2.5 sm:px-3.5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm border-2 flex items-center justify-center gap-1 transition-all min-h-[46px] shrink-0 ${
              showMaisMenu
                ? 'bg-[#062552] border-[#062552] text-white dark:bg-[#FBB016] dark:border-[#FBB016] dark:text-[#040B16]'
                : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-4 h-4 shrink-0" />
            <span>Mais</span>
          </button>
        </div>

        {/* Chip discreto caso haja filtro ativo com o menu recolhido */}
        {filtroCat !== 'todos' && !showMaisMenu && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#E8F2FC] dark:bg-[#0D1E38] text-xs font-bold text-[#03589E] dark:text-sky-300">
            <span>Mostrando: {filtroAtualLabel}</span>
            <button
              type="button"
              onClick={() => setFiltroCat('todos')}
              className="flex items-center gap-1 underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>
        )}

        {/* Menu Secundário Recolhido ("Mais") */}
        {showMaisMenu && (
          <div className="pt-3 border-t border-[#D5E2F0] dark:border-[#1C3559] space-y-3">
            {/* Filtro por tipo */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Filtrar por tipo
              </p>
              <div className="flex flex-wrap gap-1.5">
                {FILTROS_CATEGORIA.map((cat) => {
                  const Icon = cat.icon;
                  const active = filtroCat === cat.id;
                  const baseList = subTab === 'pendentes' ? avisosPendentes : avisosAnunciados;
                  const count =
                    cat.id === 'todos'
                      ? baseList.length
                      : baseList.filter((a) => a.tipo === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFiltroCat(cat.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all min-h-[38px] ${
                        active
                          ? 'bg-[#03589E] border-[#03589E] text-white'
                          : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                      <span className="opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Letra (Padrão / Grande) */}
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#062552] dark:text-slate-200">
                <Type className="w-4 h-4 text-[#03589E] dark:text-sky-400" />
                <span>Tamanho da Letra</span>
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { scale: 1.0, label: 'Padrão' },
                  { scale: 1.25, label: 'Grande' },
                ].map((opt) => {
                  const selected = Math.abs(fontScale - opt.scale) < 0.05;
                  return (
                    <button
                      key={opt.scale}
                      type="button"
                      onClick={() => setFontScale(opt.scale)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all min-h-[36px] ${
                        selected
                          ? 'bg-[#03589E] border-[#03589E] text-white'
                          : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ações do Culto */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  toggleModoFocadoPulpito();
                  setShowMaisMenu(false);
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] ${
                  modoFocadoPulpito
                    ? 'bg-[#E85D04] border-[#E85D04] text-white'
                    : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-white'
                }`}
              >
                {modoFocadoPulpito ? (
                  <Minimize2 className="w-4 h-4 shrink-0" />
                ) : (
                  <Maximize2 className="w-4 h-4 shrink-0" />
                )}
                <span>{modoFocadoPulpito ? 'Sair Tela Cheia' : 'Tela Cheia'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMaisMenu(false);
                  setShowAdminModal(true);
                }}
                className="py-2.5 px-3 rounded-xl border border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#062552] dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Crown className="w-4 h-4 text-[#E85D04] dark:text-[#FBB016] shrink-0" />
                <span>Passar Direção</span>
              </button>
            </div>

            {canManagePulpito && (
              <div className="pt-1">
                {!confirmEndCulto ? (
                  <button
                    type="button"
                    onClick={() => setConfirmEndCulto(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <Flag className="w-4 h-4 shrink-0" />
                    <span>Encerrar Culto</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 space-y-2">
                    <div className="flex items-center gap-2 text-rose-900 dark:text-rose-100 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        {avisosPendentes.length > 0
                          ? `Ainda há ${avisosPendentes.length} aviso(s) sem leitura. Encerrar?`
                          : 'Encerrar o culto de hoje?'}
                      </span>
                    </div>
                    {erroCulto && (
                      <p className="text-xs font-bold text-rose-700 dark:text-rose-300">{erroCulto}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmEndCulto(false)}
                        className="py-2 rounded-xl bg-white dark:bg-[#081529] border border-[#D5E2F0] dark:border-[#1C3559] text-xs font-bold text-[#062552] dark:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleFinalizarCulto}
                        className="py-2 rounded-xl bg-rose-600 text-white text-xs font-extrabold"
                      >
                        Encerrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Aviso discreto quando não é dirigente/admin */}
      {!canManagePulpito && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#E8F2FC] dark:bg-[#0D1E38] border border-[#03589E]/25 text-xs font-semibold text-[#062552] dark:text-slate-200">
          <Lock className="w-4 h-4 shrink-0 text-[#03589E] dark:text-[#60A5FA]" />
          <span>Modo somente leitura</span>
        </div>
      )}

      {/* Lista de Avisos */}
      {listaExibida.length === 0 ? (
        <div className="bg-white dark:bg-[#081529] rounded-3xl border border-[#D5E2F0] dark:border-[#1C3559] p-7 text-center shadow-card">
          {subTab === 'pendentes' ? (
            <div className="space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="text-base font-extrabold text-[#062552] dark:text-white">
                {filtroCat === 'todos' ? 'Nenhum aviso na fila' : 'Nenhum aviso neste filtro'}
              </h3>
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#062552] dark:text-white">
                Nenhum aviso lido ainda
              </h3>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {listaExibida.map((aviso) => (
            <AvisoCardPulpito
              key={aviso.id}
              aviso={aviso}
              onMarcarAnunciado={marcarComoAnunciado}
              onDesmarcarAnunciado={desmarcarComoAnunciado}
              canManage={canManagePulpito}
            />
          ))}
        </div>
      )}

      <AdminPassModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        actionType="trocar_dirigente"
      />
    </div>
  );
};
