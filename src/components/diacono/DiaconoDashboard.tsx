import React, { useState } from 'react';
import {
  UserPlus,
  HeartHandshake,
  Calendar,
  Megaphone,
  AlertCircle,
  Church,
} from 'lucide-react';
import { useCulto } from '../../context/CultoContext';
import { useAvisos } from '../../context/AvisosContext';
import { FormVisitante } from './FormVisitante';
import { FormOracao } from './FormOracao';
import { FormReuniao } from './FormReuniao';
import { FormAvisoGeral } from './FormAvisoGeral';
import { MeusAvisosHoje } from './MeusAvisosHoje';
import type { TipoAviso } from '../../types';

interface DiaconoDashboardProps {
  activeCategory?: TipoAviso;
  onChangeCategory?: (category: TipoAviso) => void;
}

const CATEGORIAS: {
  id: TipoAviso;
  label: string;
  tituloForm: string;
  icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
  iconActiveClass: string;
}[] = [
  {
    id: 'visitante',
    label: 'Visitante',
    tituloForm: 'Registrar Visitante',
    icon: UserPlus,
    activeClass: 'bg-[#03589E] border-[#03589E] text-white shadow-md',
    iconActiveClass: 'bg-white/20 text-white',
  },
  {
    id: 'oracao',
    label: 'Oração',
    tituloForm: 'Pedido de Oração',
    icon: HeartHandshake,
    activeClass: 'bg-[#E85D04] border-[#E85D04] text-white shadow-md',
    iconActiveClass: 'bg-white/20 text-white',
  },
  {
    id: 'reuniao',
    label: 'Reunião',
    tituloForm: 'Aviso de Reunião',
    icon: Calendar,
    activeClass: 'bg-emerald-700 border-emerald-700 text-white shadow-md',
    iconActiveClass: 'bg-white/20 text-white',
  },
  {
    id: 'geral',
    label: 'Comunicado',
    tituloForm: 'Novo Comunicado',
    icon: Megaphone,
    activeClass: 'bg-[#062552] border-[#062552] text-white shadow-md',
    iconActiveClass: 'bg-white/20 text-white',
  },
];

export const DiaconoDashboard: React.FC<DiaconoDashboardProps> = ({
  activeCategory,
  onChangeCategory,
}) => {
  const [fallbackCategory, setFallbackCategory] = useState<TipoAviso>('visitante');
  const activeTab = activeCategory ?? fallbackCategory;
  const onChangeTab = onChangeCategory ?? setFallbackCategory;

  const { cultoAtivo, dirigenteAtualNome } = useCulto();
  const { isCultoEmAndamento } = useAvisos();
  const cultoAberto = isCultoEmAndamento;
  const categoriaAtual = CATEGORIAS.find((c) => c.id === activeTab) || CATEGORIAS[0];
  const ActiveIcon = categoriaAtual.icon;

  return (
    <div className="space-y-4 pb-6">
      {/* Status compacto do culto */}
      {cultoAberto && cultoAtivo ? (
        <div className="bg-white dark:bg-[#081529] border border-[#D5E2F0] dark:border-[#1C3559] rounded-2xl px-4 py-3 flex items-center justify-between gap-2 shadow-subtle">
          <div className="flex items-center gap-2 min-w-0">
            <Church className="w-5 h-5 text-[#03589E] dark:text-sky-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-[#062552] dark:text-white truncate">
                {cultoAtivo.nomeCulto}
              </p>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                Dirigente: {dirigenteAtualNome}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 shrink-0">
            Ao Vivo
          </span>
        </div>
      ) : (
        <div className="bg-[#FFF4E5] dark:bg-amber-950/40 border border-[#F59E0B] rounded-2xl px-4 py-3.5 flex items-center gap-3 text-[#7C2D12] dark:text-amber-200">
          <AlertCircle className="w-5 h-5 text-[#E85D04] shrink-0" />
          <p className="text-sm font-bold">
            Nenhum culto aberto no momento.
          </p>
        </div>
      )}

      {/* Botões 2x2 compactos e alinhados apenas com ícone + texto principal visível */}
      <div className="grid grid-cols-2 gap-2">
        {CATEGORIAS.map((cat) => {
          const Icon = cat.icon;
          const active = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChangeTab(cat.id)}
              className={`rounded-2xl border-2 py-2.5 px-3 flex items-center justify-center gap-2 transition-all min-h-[50px] ${
                active
                  ? cat.activeClass
                  : 'bg-white dark:bg-[#081529] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-100 hover:border-[#03589E]'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  active ? 'text-white' : 'text-[#03589E] dark:text-sky-400'
                }`}
              />
              <span className="font-extrabold text-sm leading-tight truncate">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cartão do Formulário Ativo */}
      <section className="bg-white dark:bg-[#081529] rounded-3xl border border-[#D5E2F0] dark:border-[#1C3559] shadow-card overflow-hidden">
        <div className="bg-[#F4F7FB] dark:bg-[#040B16] px-5 py-3.5 border-b border-[#D5E2F0] dark:border-[#1C3559] flex items-center gap-2.5">
          <ActiveIcon className="w-5 h-5 text-[#03589E] dark:text-sky-400 shrink-0" />
          <h2 className="font-extrabold text-base sm:text-lg text-[#062552] dark:text-white">
            {categoriaAtual.tituloForm}
          </h2>
        </div>

        <div className="p-4 sm:p-5">
          {!cultoAberto ? (
            <div className="text-center py-6 text-sm text-slate-600 dark:text-slate-300 font-medium">
              Aguarde a abertura do culto para enviar avisos.
            </div>
          ) : (
            <>
              {activeTab === 'visitante' && <FormVisitante />}
              {activeTab === 'oracao' && <FormOracao />}
              {activeTab === 'reuniao' && <FormReuniao />}
              {activeTab === 'geral' && <FormAvisoGeral />}
            </>
          )}
        </div>
      </section>

      {/* Meus Envios Neste Culto */}
      {cultoAberto && <MeusAvisosHoje />}
    </div>
  );
};
