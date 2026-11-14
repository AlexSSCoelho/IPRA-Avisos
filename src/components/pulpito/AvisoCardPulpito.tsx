import React from 'react';
import type { AvisoItem } from '../../types';
import {
  getCargoLabel,
  getCategoriaOracaoLabel,
  getGrupoReuniaoLabel,
  getVisitanteGeneroLabel,
  formatHora,
  formatHoraMinutosAtras,
} from '../../utils/formatters';
import { getAvisoVisual } from '../../utils/avisoVisual';
import {
  Check,
  Undo2,
  MapPin,
  Users,
  Calendar,
  Clock,
  Lock,
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { audioFeedback } from '../../services/audioService';

interface AvisoCardPulpitoProps {
  aviso: AvisoItem;
  onMarcarAnunciado: (id: string) => void;
  onDesmarcarAnunciado: (id: string) => void;
  canManage?: boolean;
}

export const AvisoCardPulpito: React.FC<AvisoCardPulpitoProps> = ({
  aviso,
  onMarcarAnunciado,
  onDesmarcarAnunciado,
  canManage = true,
}) => {
  const { soundEnabled } = useAccessibility();
  const isAnunciado = aviso.status === 'anunciado';
  const visual = getAvisoVisual(aviso);
  const CategoryIcon = visual.icon;

  const handleToggleStatus = () => {
    if (!canManage) return;
    if (isAnunciado) {
      onDesmarcarAnunciado(aviso.id);
    } else {
      if (soundEnabled) {
        audioFeedback.playCheckSound();
      }
      onMarcarAnunciado(aviso.id);
    }
  };

  return (
    <article
      className={`rounded-2xl border-2 overflow-hidden transition-all ${
        isAnunciado
          ? 'opacity-80 bg-[#F4F7FB] dark:bg-[#081529]/70 border-[#D5E2F0] dark:border-[#1C3559]'
          : `${visual.cardBg} ${visual.cardBorder} shadow-card`
      }`}
    >
      {/* Faixa Colorida de Identificação Imediata */}
      <div
        className={`px-4 py-2.5 flex items-center justify-between gap-2 ${
          isAnunciado
            ? 'bg-slate-600 dark:bg-slate-800 text-white'
            : visual.headerBg
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <CategoryIcon className="w-5 h-5 text-white" />
          </span>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white truncate">
            {visual.label}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-white/95 bg-black/20 px-2.5 py-1 rounded-lg shrink-0">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{formatHora(aviso.criadoEm)}</span>
          {!isAnunciado && (
            <span className="hidden sm:inline opacity-85">
              • {formatHoraMinutosAtras(aviso.criadoEm)}
            </span>
          )}
        </div>
      </div>

      {/* Corpo do Card para Leitura Rápida no Púlpito */}
      <div className="p-4 sm:p-5 space-y-3.5 break-words">
        {aviso.tipo === 'visitante' && aviso.visitante && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`font-black text-2xl sm:text-3xl leading-tight ${
                  isAnunciado ? 'line-through opacity-75' : 'text-[#062552] dark:text-white'
                }`}
              >
                {aviso.visitante.nome}
              </h3>
              {getVisitanteGeneroLabel(aviso.visitante.genero) !== 'Visitante' && (
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold uppercase ${visual.pillBg}`}>
                  {getVisitanteGeneroLabel(aviso.visitante.genero)}
                </span>
              )}
            </div>

            <div className="space-y-2 text-base sm:text-lg text-[#0D213A] dark:text-slate-100 leading-relaxed">
              {aviso.visitante.cidade && (
                <p className="flex items-start gap-2.5">
                  <MapPin className={`w-5 h-5 shrink-0 mt-1 ${visual.accentText}`} />
                  <span>
                    Veio de <strong className="font-extrabold">{aviso.visitante.cidade}</strong>
                  </span>
                </p>
              )}
              {aviso.visitante.igreja && (
                <p className="flex items-start gap-2.5">
                  <Users className={`w-5 h-5 shrink-0 mt-1 ${visual.accentText}`} />
                  <span>
                    Igreja: <strong className="font-extrabold">{aviso.visitante.igreja}</strong>
                  </span>
                </p>
              )}
              {aviso.visitante.acompanhante && (
                <p className="flex items-start gap-2.5">
                  <Users className={`w-5 h-5 shrink-0 mt-1 ${visual.accentText}`} />
                  <span>
                    Acompanhado por <strong className="font-extrabold">{aviso.visitante.acompanhante}</strong>
                  </span>
                </p>
              )}
              {aviso.visitante.observacao && (
                <div className={`p-3.5 rounded-xl border text-base font-medium text-[#062552] dark:text-slate-100 ${visual.boxBg}`}>
                  “{aviso.visitante.observacao}”
                </div>
              )}
            </div>
          </>
        )}

        {aviso.tipo === 'oracao' && aviso.oracao && (
          <>
            <div className="space-y-1.5">
              <h3
                className={`font-black text-2xl sm:text-3xl leading-tight ${
                  isAnunciado ? 'line-through opacity-75' : 'text-[#062552] dark:text-white'
                }`}
              >
                {aviso.oracao.nomePessoa}
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide ${visual.pillBg}`}>
                {getCategoriaOracaoLabel(aviso.oracao.categoria)}
              </span>
            </div>

            {aviso.oracao.motivo && (
              <div className={`p-3.5 rounded-xl border text-base sm:text-lg font-medium text-[#0D213A] dark:text-slate-100 leading-relaxed ${visual.boxBg}`}>
                {aviso.oracao.motivo}
              </div>
            )}
          </>
        )}

        {aviso.tipo === 'reuniao' && aviso.reuniao && (
          <>
            <div className="space-y-1.5">
              <h3
                className={`font-black text-2xl sm:text-3xl leading-tight ${
                  isAnunciado ? 'line-through opacity-75' : 'text-[#062552] dark:text-white'
                }`}
              >
                {aviso.reuniao.grupo === 'outro' && aviso.reuniao.grupoNomePersonalizado
                  ? aviso.reuniao.grupoNomePersonalizado
                  : getGrupoReuniaoLabel(aviso.reuniao.grupo)}
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold ${visual.pillBg}`}>
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{aviso.reuniao.dataTexto} às {aviso.reuniao.horario}</span>
              </span>
            </div>

            <div className="space-y-2 text-base sm:text-lg text-[#0D213A] dark:text-slate-100 leading-relaxed">
              <p className="flex items-start gap-2.5">
                <MapPin className={`w-5 h-5 shrink-0 mt-1 ${visual.accentText}`} />
                <span>
                  Local: <strong className="font-extrabold">{aviso.reuniao.local}</strong>
                </span>
              </p>
              {aviso.reuniao.responsavel && (
                <p className="flex items-start gap-2.5">
                  <Users className={`w-5 h-5 shrink-0 mt-1 ${visual.accentText}`} />
                  <span>
                    Responsável: <strong className="font-extrabold">{aviso.reuniao.responsavel}</strong>
                  </span>
                </p>
              )}
            </div>
          </>
        )}

        {aviso.tipo === 'geral' && aviso.geral && (
          <>
            <h3
              className={`font-black text-2xl sm:text-3xl leading-tight ${
                isAnunciado ? 'line-through opacity-75' : 'text-[#062552] dark:text-white'
              }`}
            >
              {aviso.geral.titulo}
            </h3>

            {aviso.geral.descricao && (
              <div className={`p-3.5 rounded-xl border text-base sm:text-lg text-[#0D213A] dark:text-slate-100 leading-relaxed ${visual.boxBg}`}>
                {aviso.geral.descricao}
              </div>
            )}

            {(aviso.geral.dataEvento || aviso.geral.destinatario) && (
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm font-bold">
                {aviso.geral.dataEvento && (
                  <span className={`px-3 py-1 rounded-xl ${visual.pillBg}`}>
                    Data: {aviso.geral.dataEvento}
                  </span>
                )}
                {aviso.geral.destinatario && (
                  <span className={`px-3 py-1 rounded-xl ${visual.pillBg}`}>
                    Público: {aviso.geral.destinatario}
                  </span>
                )}
              </div>
            )}
          </>
        )}

        {/* Rodapé: Remetente + Botão de Ação */}
        <div className="pt-3 border-t border-[#E6EEF8] dark:border-[#1C3559] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Por <span className="text-[#062552] dark:text-white">{aviso.autorNome}</span>
            <span className="text-slate-400"> • </span>
            <span>{getCargoLabel(aviso.autorCargo)}</span>
            {isAnunciado && aviso.lidoEm && (
              <span className="block text-emerald-700 dark:text-emerald-300 mt-0.5">
                Lido às {formatHora(aviso.lidoEm)}
              </span>
            )}
          </div>

          {canManage ? (
            <button
              type="button"
              onClick={handleToggleStatus}
              className={`px-5 py-3 rounded-2xl font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 min-h-[48px] shrink-0 active:scale-[0.98] ${
                isAnunciado
                  ? 'bg-white dark:bg-[#0D1E38] text-[#062552] dark:text-slate-200 border-2 border-[#D5E2F0] dark:border-[#1C3559]'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
              }`}
            >
              {isAnunciado ? (
                <>
                  <Undo2 className="w-5 h-5 shrink-0" />
                  <span>Voltar à Fila</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 stroke-[2.75] shrink-0" />
                  <span>Marcar como Lido</span>
                </>
              )}
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#F4F7FB] dark:bg-[#0D1E38] text-slate-600 dark:text-slate-300 border border-[#D5E2F0] dark:border-[#1C3559]">
              <Lock className="w-3.5 h-3.5" />
              <span>Somente leitura</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
