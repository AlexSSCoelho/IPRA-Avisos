import React, { useState } from 'react';
import {
  Church,
  UserPlus,
  HeartHandshake,
  Calendar,
  Megaphone,
  Mic,
  History,
  Crown,
  ArrowRight,
  Flag,
  AlertTriangle,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCulto } from '../../context/CultoContext';
import { useAvisos } from '../../context/AvisosContext';
import { getCargoLabel } from '../../utils/formatters';
import type { AppTabType } from '../common/BottomNav';
import type { TipoAviso } from '../../types';

interface HomeScreenProps {
  onNavigate: (tab: AppTabType, category?: TipoAviso) => void;
  onOpenIniciarCulto: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenIniciarCulto,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { cultoAtivo, isDirigente, dirigenteAtualNome, finalizarCulto } = useCulto();
  const {
    avisosPendentes,
    totalVisitantes,
    totalOracoes,
    totalReunioes,
    totalGerais,
  } = useAvisos();

  const [confirmEndCulto, setConfirmEndCulto] = useState(false);

  const countVisitantes = totalVisitantes;
  const countOracoes = totalOracoes;
  const countReunioes = totalReunioes;
  const countGerais = totalGerais;

  const primeiroNome = currentUser?.nome.split(' ')[0] || 'Irmão(ã)';
  const cargoLabel = getCargoLabel(currentUser?.cargo);

  const canManageCulto = isDirigente || isAdmin;

  const summaryItems: {
    tipo: TipoAviso;
    label: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
  }[] = [
    {
      tipo: 'visitante',
      label: 'Visitantes',
      count: countVisitantes,
      icon: UserPlus,
      iconBg: 'bg-[#03589E] text-white',
    },
    {
      tipo: 'oracao',
      label: 'Orações',
      count: countOracoes,
      icon: HeartHandshake,
      iconBg: 'bg-[#E85D04] text-white',
    },
    {
      tipo: 'reuniao',
      label: 'Reuniões',
      count: countReunioes,
      icon: Calendar,
      iconBg: 'bg-emerald-700 text-white',
    },
    {
      tipo: 'geral',
      label: 'Comunicados',
      count: countGerais,
      icon: Megaphone,
      iconBg: 'bg-[#062552] dark:bg-sky-700 text-white',
    },
  ];

  const handleConfirmEnd = () => {
    const res = finalizarCulto();
    if (res.success) {
      setConfirmEndCulto(false);
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Saudação simples */}
      <section className="bg-white dark:bg-[#081529] rounded-3xl border border-[#D5E2F0] dark:border-[#1C3559] p-4 shadow-card flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-extrabold text-[#062552] dark:text-white leading-tight">
            A paz do Senhor, {primeiroNome}
          </h1>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#E8F2FC] dark:bg-[#0D1E38] text-[#03589E] dark:text-sky-300 border border-[#D5E2F0] dark:border-[#1C3559]">
              {cargoLabel}
            </span>
            {isDirigente && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#FFF4E5] dark:bg-amber-950/60 text-[#9A3412] dark:text-[#FBB016] border border-[#F59E0B]/40">
                <Crown className="w-3.5 h-3.5" />
                <span>Dirigente</span>
              </span>
            )}
          </div>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-white border border-[#D5E2F0] dark:border-[#1C3559] p-1 shrink-0 shadow-sm flex items-center justify-center">
          <img
            src="/logo-ipra-emblem.png"
            alt="IPRA"
            className="w-full h-full object-contain"
          />
        </div>
      </section>

      {/* Card do Culto Atual */}
      {cultoAtivo ? (
        <section className="bg-white dark:bg-[#081529] rounded-3xl border border-[#D5E2F0] dark:border-[#1C3559] p-4 shadow-card space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Culto ao Vivo</span>
              </div>
              <h2 className="text-lg font-extrabold text-[#062552] dark:text-white leading-snug">
                {cultoAtivo.nomeCulto}
              </h2>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                Dirigente: <strong className="text-[#062552] dark:text-white">{dirigenteAtualNome}</strong>
                {cultoAtivo.horarioInicio ? ` • ${cultoAtivo.horarioInicio}` : ''}
              </p>
            </div>

            {avisosPendentes.length > 0 && (
              <div className="shrink-0 bg-[#FFF4E5] dark:bg-amber-950/50 border border-[#F59E0B]/50 rounded-2xl px-3 py-2 text-center">
                <span className="block text-xl font-black text-[#E85D04] dark:text-[#FBB016] leading-none">
                  {avisosPendentes.length}
                </span>
                <span className="block text-[11px] font-bold text-[#9A3412] dark:text-[#FCD34D] mt-0.5">
                  para ler
                </span>
              </div>
            )}
          </div>

          {/* Contadores 2x2 limpos, sem subtítulo e sem corte */}
          <div className="grid grid-cols-2 gap-2.5">
            {summaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.tipo}
                  type="button"
                  onClick={() => onNavigate(canManageCulto ? 'pulpito' : 'diacono', item.tipo)}
                  className="p-3.5 rounded-2xl border border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] hover:border-[#03589E] text-left transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className={`p-2 rounded-xl ${item.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-[#062552] dark:text-white leading-none">
                      {item.count}
                    </span>
                  </div>
                  <p className="font-bold text-sm text-[#062552] dark:text-white leading-tight">
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Botões principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {canManageCulto ? (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('pulpito')}
                  className="py-3.5 px-4 rounded-2xl bg-[#03589E] hover:bg-[#062552] text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 transition-all min-h-[52px]"
                >
                  <Mic className="w-5 h-5 shrink-0" />
                  <span>Abrir Púlpito</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('diacono')}
                  className="py-3.5 px-4 rounded-2xl border-2 border-[#03589E] text-[#03589E] dark:text-sky-300 dark:border-sky-400 bg-white dark:bg-[#040B16] font-extrabold text-base flex items-center justify-center gap-2 transition-all min-h-[52px]"
                >
                  <PlusCircle className="w-5 h-5 shrink-0" />
                  <span>Enviar Aviso</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('diacono')}
                  className="py-3.5 px-4 rounded-2xl bg-[#03589E] hover:bg-[#062552] text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 transition-all min-h-[52px]"
                >
                  <PlusCircle className="w-5 h-5 shrink-0" />
                  <span>Enviar Aviso</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('pulpito')}
                  className="py-3.5 px-4 rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#062552] dark:text-white font-bold text-base flex items-center justify-center gap-2 transition-all min-h-[52px]"
                >
                  <Mic className="w-5 h-5 text-[#03589E] dark:text-sky-400 shrink-0" />
                  <span>Ver Púlpito</span>
                </button>
              </>
            )}
          </div>
        </section>
      ) : (
        <section className="bg-white dark:bg-[#081529] rounded-3xl border border-[#D5E2F0] dark:border-[#1C3559] p-6 text-center shadow-card space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E8F2FC] dark:bg-[#0D1E38] flex items-center justify-center border border-[#D5E2F0] dark:border-[#1C3559]">
            <Church className="w-8 h-8 text-[#03589E] dark:text-[#60A5FA]" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#062552] dark:text-white">
              Nenhum culto aberto
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {isAdmin
                ? 'Inicie o culto para receber e ler avisos.'
                : 'Aguarde a abertura do culto para enviar avisos.'}
            </p>
          </div>
          {isAdmin ? (
            <button
              type="button"
              onClick={onOpenIniciarCulto}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#03589E] hover:bg-[#062552] text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 transition-all min-h-[52px]"
            >
              <Church className="w-5 h-5 shrink-0" />
              <span>Iniciar Culto</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('historico')}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#F4F7FB] dark:bg-[#040B16] border border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-white font-bold text-base flex items-center justify-center gap-2 min-h-[52px]"
            >
              <History className="w-5 h-5 text-[#03589E]" />
              <span>Ver Histórico</span>
            </button>
          )}
        </section>
      )}

      {/* Ações secundárias */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onNavigate('historico')}
          className="p-4 rounded-2xl bg-white dark:bg-[#081529] border border-[#D5E2F0] dark:border-[#1C3559] hover:border-[#03589E] flex items-center justify-between gap-3 text-left shadow-subtle min-h-[56px]"
        >
          <span className="flex items-center gap-2.5 font-bold text-sm text-[#062552] dark:text-white">
            <History className="w-5 h-5 text-[#03589E] dark:text-sky-400 shrink-0" />
            <span>Histórico de Cultos</span>
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {cultoAtivo && canManageCulto && (
          <button
            type="button"
            onClick={() => setConfirmEndCulto(true)}
            className="p-4 rounded-2xl bg-white dark:bg-[#081529] border border-[#D5E2F0] dark:border-[#1C3559] hover:border-rose-400 flex items-center justify-between gap-3 text-left shadow-subtle min-h-[56px]"
          >
            <span className="flex items-center gap-2.5 font-bold text-sm text-rose-700 dark:text-rose-400">
              <Flag className="w-5 h-5 shrink-0" />
              <span>Encerrar Culto</span>
            </span>
            <ArrowRight className="w-4 h-4 text-rose-400 shrink-0" />
          </button>
        )}
      </section>

      {/* Confirmação de encerramento */}
      {confirmEndCulto && (
        <section className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-700 space-y-3">
          <div className="flex items-start gap-2.5 text-rose-900 dark:text-rose-100">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-extrabold">Encerrar culto agora?</p>
              {avisosPendentes.length > 0 && (
                <p className="mt-0.5 font-medium">
                  Ainda há {avisosPendentes.length} aviso(s) para ler.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setConfirmEndCulto(false)}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-[#081529] border border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-white font-bold text-sm min-h-[46px]"
            >
              Continuar
            </button>
            <button
              type="button"
              onClick={handleConfirmEnd}
              className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm min-h-[46px]"
            >
              Encerrar
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
