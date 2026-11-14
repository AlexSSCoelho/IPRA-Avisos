import type { LucideIcon } from 'lucide-react';
import {
  UserPlus,
  HeartHandshake,
  AlertTriangle,
  Cake,
  Calendar,
  Megaphone,
} from 'lucide-react';
import type { AvisoItem } from '../types';

export type AvisoVisualKey =
  | 'visitante'
  | 'oracao_urgente'
  | 'oracao'
  | 'aniversario'
  | 'reuniao'
  | 'geral';

export interface AvisoVisualConfig {
  key: AvisoVisualKey;
  label: string;
  icon: LucideIcon;
  headerBg: string;
  cardBorder: string;
  cardBg: string;
  pillBg: string;
  accentText: string;
  boxBg: string;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function isAvisoAniversario(aviso: AvisoItem): boolean {
  if (aviso.tipo !== 'geral' || !aviso.geral) return false;
  const combined = normalizeText(`${aviso.geral.titulo} ${aviso.geral.descricao || ''}`);
  return combined.includes('aniversar') || combined.includes('niver');
}

export function getAvisoVisual(aviso: AvisoItem): AvisoVisualConfig {
  if (aviso.tipo === 'visitante') {
    return {
      key: 'visitante',
      label: 'Visitante',
      icon: UserPlus,
      headerBg: 'bg-[#03589E] text-white',
      cardBorder: 'border-[#03589E]/40 dark:border-[#38BDF8]/40',
      cardBg: 'bg-white dark:bg-[#081529]',
      pillBg: 'bg-[#E8F2FC] text-[#03589E] dark:bg-[#0D2748] dark:text-[#93C5FD] border border-[#03589E]/25',
      accentText: 'text-[#03589E] dark:text-[#60A5FA]',
      boxBg: 'bg-[#F4F8FE] dark:bg-[#0D1E38] border-[#D5E2F0] dark:border-[#1C3559]',
    };
  }

  if (aviso.tipo === 'oracao') {
    if (aviso.oracao?.urgente) {
      return {
        key: 'oracao_urgente',
        label: 'Oração Urgente',
        icon: AlertTriangle,
        headerBg: 'bg-[#BE123C] text-white',
        cardBorder: 'border-[#BE123C]/50 dark:border-rose-500/55',
        cardBg: 'bg-[#FFFDFD] dark:bg-[#081529]',
        pillBg: 'bg-rose-100 text-rose-900 dark:bg-rose-950/75 dark:text-rose-200 border border-rose-300 dark:border-rose-700',
        accentText: 'text-[#BE123C] dark:text-rose-300',
        boxBg: 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/70',
      };
    }

    return {
      key: 'oracao',
      label: 'Pedido de Oração',
      icon: HeartHandshake,
      headerBg: 'bg-[#C2410C] text-white',
      cardBorder: 'border-[#E85D04]/45 dark:border-orange-500/50',
      cardBg: 'bg-white dark:bg-[#081529]',
      pillBg: 'bg-orange-100 text-[#9A3412] dark:bg-orange-950/65 dark:text-orange-200 border border-orange-300 dark:border-orange-700',
      accentText: 'text-[#C2410C] dark:text-orange-300',
      boxBg: 'bg-orange-50/70 dark:bg-[#0D1E38] border-orange-200 dark:border-orange-800/60',
    };
  }

  if (isAvisoAniversario(aviso)) {
    return {
      key: 'aniversario',
      label: 'Aniversário',
      icon: Cake,
      headerBg: 'bg-[#D97706] text-white',
      cardBorder: 'border-[#F59E0B]/55 dark:border-[#FBB016]/50',
      cardBg: 'bg-[#FFFDF7] dark:bg-[#081529]',
      pillBg: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-[#FCD34D] border border-amber-300 dark:border-amber-700',
      accentText: 'text-[#B45309] dark:text-[#FBB016]',
      boxBg: 'bg-amber-50/80 dark:bg-[#0D1E38] border-amber-200 dark:border-amber-700/60',
    };
  }

  if (aviso.tipo === 'reuniao') {
    return {
      key: 'reuniao',
      label: 'Reunião',
      icon: Calendar,
      headerBg: 'bg-emerald-700 text-white',
      cardBorder: 'border-emerald-600/40 dark:border-emerald-500/45',
      cardBg: 'bg-white dark:bg-[#081529]',
      pillBg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700',
      accentText: 'text-emerald-700 dark:text-emerald-300',
      boxBg: 'bg-emerald-50/70 dark:bg-[#0D1E38] border-emerald-200 dark:border-emerald-800/60',
    };
  }

  return {
    key: 'geral',
    label: 'Comunicado',
    icon: Megaphone,
    headerBg: 'bg-[#062552] text-white',
    cardBorder: 'border-[#062552]/35 dark:border-sky-500/40',
    cardBg: 'bg-white dark:bg-[#081529]',
    pillBg: 'bg-[#E8F2FC] text-[#062552] dark:bg-[#1C3559] dark:text-slate-100 border border-[#D5E2F0] dark:border-[#2A4A7A]',
    accentText: 'text-[#062552] dark:text-sky-300',
    boxBg: 'bg-[#F4F7FB] dark:bg-[#0D1E38] border-[#D5E2F0] dark:border-[#1C3559]',
  };
}
