import React, { useState } from 'react';
import { useAvisos } from '../../context/AvisosContext';
import {
  formatHora,
  getCategoriaOracaoLabel,
  getVisitanteGeneroLabel,
  getGrupoReuniaoLabel,
} from '../../utils/formatters';
import { getAvisoVisual } from '../../utils/avisoVisual';
import {
  Trash2,
  Edit3,
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
  AlertCircle,
  Users,
  X,
} from 'lucide-react';
import type { AvisoItem } from '../../types';
import { EditarAvisoModal } from './EditarAvisoModal';

export const MeusAvisosHoje: React.FC = () => {
  const { meusAvisosHoje, excluirAviso } = useAvisos();
  const [avisoEditando, setAvisoEditando] = useState<AvisoItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  if (meusAvisosHoje.length === 0) {
    return (
      <div className="text-center py-6 px-4 bg-white dark:bg-[#081529] rounded-2xl border-2 border-dashed border-[#D5E2F0] dark:border-[#1C3559]">
        <p className="text-sm font-bold text-[#062552] dark:text-slate-200">
          Nenhum aviso enviado neste culto.
        </p>
      </div>
    );
  }

  const handleConfirmDelete = (id: string) => {
    setErroAcao(null);
    const res = excluirAviso(id);
    if (!res.success) {
      setErroAcao(res.message || 'Não foi possível excluir este aviso.');
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-extrabold text-[#062552] dark:text-slate-200 uppercase tracking-wide">
          Meus Envios Neste Culto ({meusAvisosHoje.length})
        </h3>
      </div>

      {erroAcao && (
        <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs font-bold">
          <span>{erroAcao}</span>
          <button
            type="button"
            onClick={() => setErroAcao(null)}
            className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900"
            aria-label="Fechar erro"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-3">
        {meusAvisosHoje.map((aviso) => {
          const isAnunciado = aviso.status === 'anunciado';
          const isConfirming = confirmDeleteId === aviso.id;
          const visual = getAvisoVisual(aviso);
          const VisualIcon = visual.icon;

          let tituloPrincipal = '';
          let subtitulo = '';

          if (aviso.tipo === 'visitante' && aviso.visitante) {
            const generoLabel = getVisitanteGeneroLabel(aviso.visitante.genero);
            tituloPrincipal = `${aviso.visitante.nome} • ${generoLabel}`;
            const partes = [
              aviso.visitante.cidade,
              aviso.visitante.igreja,
              aviso.visitante.acompanhante ? `Acomp.: ${aviso.visitante.acompanhante}` : '',
            ].filter(Boolean);
            subtitulo = partes.join(' • ');
          } else if (aviso.tipo === 'oracao' && aviso.oracao) {
            tituloPrincipal = aviso.oracao.nomePessoa;
            subtitulo = `${getCategoriaOracaoLabel(aviso.oracao.categoria)}${
              aviso.oracao.urgente ? ' • URGENTE' : ''
            }`;
          } else if (aviso.tipo === 'reuniao' && aviso.reuniao) {
            const nomeGrupo =
              aviso.reuniao.grupo === 'outro' && aviso.reuniao.grupoNomePersonalizado
                ? aviso.reuniao.grupoNomePersonalizado
                : getGrupoReuniaoLabel(aviso.reuniao.grupo);
            tituloPrincipal = nomeGrupo;
            subtitulo = `${aviso.reuniao.dataTexto} às ${aviso.reuniao.horario} • ${aviso.reuniao.local}`;
          } else if (aviso.tipo === 'geral' && aviso.geral) {
            tituloPrincipal = aviso.geral.titulo;
            subtitulo = aviso.geral.descricao || aviso.geral.dataEvento || '';
          }

          return (
            <div
              key={aviso.id}
              className={`rounded-2xl border-2 overflow-hidden transition-all shadow-subtle ${
                isAnunciado
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                  : `${visual.cardBg} ${visual.cardBorder}`
              }`}
            >
              <div
                className={`px-4 py-2 flex items-center justify-between gap-2 ${
                  isAnunciado ? 'bg-slate-600 dark:bg-slate-800 text-white' : visual.headerBg
                }`}
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white">
                  <VisualIcon className="w-4 h-4 shrink-0" />
                  <span>{visual.label}</span>
                </span>
                <span className="text-xs font-bold text-white/95">
                  {formatHora(aviso.criadoEm)}
                </span>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  {isAnunciado ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Já lido no púlpito</span>
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg ${visual.pillBg}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Aguardando leitura</span>
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-base text-[#062552] dark:text-white leading-snug">
                  {tituloPrincipal}
                </h4>

                {subtitulo && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
                    {aviso.tipo === 'visitante' && <MapPin className={`w-3.5 h-3.5 shrink-0 ${visual.accentText}`} />}
                    {aviso.tipo === 'reuniao' && <Calendar className={`w-3.5 h-3.5 shrink-0 ${visual.accentText}`} />}
                    {aviso.tipo === 'oracao' && aviso.oracao?.urgente && <AlertCircle className={`w-3.5 h-3.5 shrink-0 ${visual.accentText}`} />}
                    {aviso.tipo === 'geral' && aviso.geral?.destinatario && <Users className={`w-3.5 h-3.5 shrink-0 ${visual.accentText}`} />}
                    <span>{subtitulo}</span>
                  </p>
                )}

                {/* Ações */}
                {!isAnunciado && (
                  <div className="mt-3 pt-3 border-t border-[#E6EEF8] dark:border-[#1C3559]">
                    {!isConfirming ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setAvisoEditando(aviso)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#03589E] dark:text-[#93C5FD] bg-[#E8F2FC] dark:bg-[#0D1E38] hover:bg-[#D5E7FA] dark:hover:bg-[#152B4D] transition-colors min-h-[42px]"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(aviso.id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors min-h-[42px]"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">
                        <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                          Apagar este aviso do culto?
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-[#081529] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-[#1C3559] min-h-[38px]"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(aviso.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 min-h-[38px]"
                          >
                            Sim, apagar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <EditarAvisoModal
        aviso={avisoEditando}
        isOpen={!!avisoEditando}
        onClose={() => setAvisoEditando(null)}
      />
    </div>
  );
};
