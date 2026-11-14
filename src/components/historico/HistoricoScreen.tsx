import React, { useState, useMemo } from 'react';
import { useAvisos } from '../../context/AvisosContext';
import { useCulto } from '../../context/CultoContext';
import {
  formatHora,
  getCategoriaOracaoLabel,
  getGrupoReuniaoLabel,
  getVisitanteGeneroLabel,
} from '../../utils/formatters';
import { getAvisoVisual } from '../../utils/avisoVisual';
import {
  Copy,
  CheckCircle2,
  History,
  Church,
  Calendar,
  Clock,
  Check,
  UserPlus,
  HeartHandshake,
  Megaphone,
  Share2,
  ChevronDown,
  X,
} from 'lucide-react';
import type { AvisoItem, CultoAtivo } from '../../types';

/** Formata descrição, data e destinatário de um comunicado geral para exibição e relatório. */
function formatGeralDetalhes(aviso: AvisoItem): string {
  if (!aviso.geral) return '';
  return [
    aviso.geral.descricao,
    aviso.geral.dataEvento ? `Quando: ${aviso.geral.dataEvento}` : '',
    aviso.geral.destinatario ? `Para: ${aviso.geral.destinatario}` : '',
  ]
    .filter(Boolean)
    .join(' • ');
}

export const HistoricoScreen: React.FC = () => {
  const { avisos } = useAvisos();
  const { cultoAtivo, historicoCultos } = useCulto();

  const todosCultos = useMemo(() => {
    const lista: CultoAtivo[] = [];
    if (cultoAtivo) lista.push(cultoAtivo);
    historicoCultos.forEach((h) => {
      if (!lista.some((c) => c.id === h.id)) {
        lista.push(h);
      }
    });
    return lista;
  }, [cultoAtivo, historicoCultos]);

  const [cultoSelecionadoId, setCultoSelecionadoId] = useState<string>(
    cultoAtivo?.id || historicoCultos[0]?.id || ''
  );
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendente' | 'anunciado'>('todos');
  const [copiado, setCopiado] = useState(false);
  const [showCultoPicker, setShowCultoPicker] = useState(false);

  const effectiveSelectedId = useMemo(() => {
    if (todosCultos.some((c) => c.id === cultoSelecionadoId)) {
      return cultoSelecionadoId;
    }
    return todosCultos[0]?.id || '';
  }, [todosCultos, cultoSelecionadoId]);

  const cultoSelecionado = useMemo(() => {
    return todosCultos.find((c) => c.id === effectiveSelectedId) || null;
  }, [todosCultos, effectiveSelectedId]);

  const avisosDoCulto = useMemo(() => {
    if (!effectiveSelectedId) return [];
    return avisos.filter((a) => a.cultoId === effectiveSelectedId);
  }, [avisos, effectiveSelectedId]);

  const avisosFiltrados = useMemo(() => {
    if (filtroStatus === 'todos') return avisosDoCulto;
    return avisosDoCulto.filter((a) => a.status === filtroStatus);
  }, [avisosDoCulto, filtroStatus]);

  const visitantes = avisosDoCulto.filter((a) => a.tipo === 'visitante');
  const oracoes = avisosDoCulto.filter((a) => a.tipo === 'oracao');
  const reunioes = avisosDoCulto.filter((a) => a.tipo === 'reuniao');
  const gerais = avisosDoCulto.filter((a) => a.tipo === 'geral');

  const formatDataBr = (isoDate: string) => {
    try {
      const [ano, mes, dia] = isoDate.split('-');
      return `${dia}/${mes}/${ano}`;
    } catch {
      return isoDate;
    }
  };

  const gerarTextoRelatorio = () => {
    if (!cultoSelecionado) return '';

    let texto = `*RELATÓRIO DE AVISOS — IPRA*\n`;
    texto += `⛪ *Culto:* ${cultoSelecionado.nomeCulto}\n`;
    texto += `📅 *Data:* ${formatDataBr(cultoSelecionado.data)}${cultoSelecionado.horarioInicio ? ` às ${cultoSelecionado.horarioInicio}` : ''}\n`;
    texto += `🎙️ *Dirigente:* ${cultoSelecionado.dirigenteNome}\n`;
    texto += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (visitantes.length > 0) {
      texto += `*VISITANTES (${visitantes.length}):*\n`;
      visitantes.forEach((v, idx) => {
        const genero = v.visitante?.genero ? ` (${getVisitanteGeneroLabel(v.visitante.genero)})` : '';
        const origem = [v.visitante?.cidade, v.visitante?.igreja].filter(Boolean).join(' / ');
        const acomp = v.visitante?.acompanhante ? ` • Acomp.: ${v.visitante.acompanhante}` : '';
        const status = v.status === 'anunciado' ? '✅' : '⏳';
        texto += `${idx + 1}. ${status} ${v.visitante?.nome}${genero}${origem ? ` — ${origem}` : ''}${acomp}\n`;
      });
      texto += `\n`;
    }

    if (oracoes.length > 0) {
      texto += `*PEDIDOS DE ORAÇÃO (${oracoes.length}):*\n`;
      oracoes.forEach((o, idx) => {
        const cat = getCategoriaOracaoLabel(o.oracao?.categoria);
        const urg = o.oracao?.urgente ? ' [URGENTE]' : '';
        const status = o.status === 'anunciado' ? '✅' : '⏳';
        texto += `${idx + 1}. ${status} *${o.oracao?.nomePessoa}* (${cat}${urg})`;
        if (o.oracao?.motivo) texto += `: ${o.oracao.motivo}`;
        texto += `\n`;
      });
      texto += `\n`;
    }

    if (reunioes.length > 0) {
      texto += `*REUNIÕES / AGENDA (${reunioes.length}):*\n`;
      reunioes.forEach((r, idx) => {
        const status = r.status === 'anunciado' ? '✅' : '⏳';
        const nomeGrupo =
          r.reuniao?.grupo === 'outro' && r.reuniao.grupoNomePersonalizado
            ? r.reuniao.grupoNomePersonalizado
            : getGrupoReuniaoLabel(r.reuniao?.grupo);
        texto += `${idx + 1}. ${status} *${nomeGrupo}* — ${r.reuniao?.dataTexto} às ${r.reuniao?.horario} (${r.reuniao?.local})\n`;
      });
      texto += `\n`;
    }

    if (gerais.length > 0) {
      texto += `*COMUNICADOS GERAIS (${gerais.length}):*\n`;
      gerais.forEach((g, idx) => {
        const status = g.status === 'anunciado' ? '✅' : '⏳';
        const detalhes = formatGeralDetalhes(g);
        texto += `${idx + 1}. ${status} *${g.geral?.titulo}*`;
        if (detalhes) texto += ` — ${detalhes}`;
        texto += `\n`;
      });
      texto += `\n`;
    }

    texto += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    texto += `Total: ${avisosDoCulto.length} avisos (${avisosDoCulto.filter((a) => a.status === 'anunciado').length} lidos)`;

    return texto;
  };

  const handleCopiarRelatorio = async () => {
    const texto = gerarTextoRelatorio();
    if (!texto) return;

    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch {
      const el = document.createElement('textarea');
      el.value = texto;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    }
  };

  const handleCompartilhar = async () => {
    const texto = gerarTextoRelatorio();
    if (!texto) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Relatório IPRA — ${cultoSelecionado?.nomeCulto || 'Culto'}`,
          text: texto,
        });
        return;
      } catch {
        // Fallback silencioso caso o usuário cancele
      }
    }
    handleCopiarRelatorio();
  };

  const renderAvisoTitulo = (aviso: AvisoItem) => {
    if (aviso.tipo === 'visitante' && aviso.visitante) {
      return `${aviso.visitante.nome} • ${getVisitanteGeneroLabel(aviso.visitante.genero)}`;
    }
    if (aviso.tipo === 'oracao' && aviso.oracao) {
      return `${aviso.oracao.nomePessoa} — ${getCategoriaOracaoLabel(aviso.oracao.categoria)}`;
    }
    if (aviso.tipo === 'reuniao' && aviso.reuniao) {
      return aviso.reuniao.grupo === 'outro' && aviso.reuniao.grupoNomePersonalizado
        ? aviso.reuniao.grupoNomePersonalizado
        : getGrupoReuniaoLabel(aviso.reuniao.grupo);
    }
    return aviso.geral?.titulo || 'Aviso';
  };

  const renderAvisoSubtitulo = (aviso: AvisoItem) => {
    if (aviso.tipo === 'visitante' && aviso.visitante) {
      return [
        aviso.visitante.cidade,
        aviso.visitante.igreja,
        aviso.visitante.acompanhante ? `Acomp.: ${aviso.visitante.acompanhante}` : '',
        aviso.visitante.observacao,
      ]
        .filter(Boolean)
        .join(' • ');
    }
    if (aviso.tipo === 'oracao' && aviso.oracao) {
      return aviso.oracao.motivo || (aviso.oracao.urgente ? 'Pedido urgente' : '');
    }
    if (aviso.tipo === 'reuniao' && aviso.reuniao) {
      return `${aviso.reuniao.dataTexto} às ${aviso.reuniao.horario} • ${aviso.reuniao.local}`;
    }
    return formatGeralDetalhes(aviso);
  };

  const resumoChips = [
    {
      label: 'Visitantes',
      count: visitantes.length,
      icon: UserPlus,
      iconClass: 'text-[#03589E] dark:text-[#93C5FD] bg-[#E8F2FC] dark:bg-[#0D2748]',
    },
    {
      label: 'Orações',
      count: oracoes.length,
      icon: HeartHandshake,
      iconClass: 'text-[#C2410C] dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60',
    },
    {
      label: 'Reuniões',
      count: reunioes.length,
      icon: Calendar,
      iconClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60',
    },
    {
      label: 'Avisos',
      count: gerais.length,
      icon: Megaphone,
      iconClass: 'text-[#062552] dark:text-sky-200 bg-[#E8F2FC] dark:bg-[#1C3559]',
    },
  ];

  return (
    <div className="space-y-3.5 pb-6">
      {/* Cabeçalho + Seletor de Culto (enxuto e sem corte de texto) */}
      <section className="bg-white dark:bg-[#081529] rounded-3xl border border-[#D5E2F0] dark:border-[#1C3559] p-4 shadow-card space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-[#E8F2FC] dark:bg-[#0D1E38] text-[#03589E] dark:text-[#60A5FA] shrink-0">
              <History className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-[#062552] dark:text-white leading-tight truncate">
              Histórico
            </h2>
          </div>

          {cultoSelecionado && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopiarRelatorio}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 min-h-[40px] ${
                  copiado
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#03589E] hover:bg-[#062552] text-white'
                }`}
              >
                {copiado ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>{copiado ? 'Copiado' : 'Copiar'}</span>
              </button>

              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  type="button"
                  onClick={handleCompartilhar}
                  aria-label="Compartilhar relatório"
                  className="p-2.5 rounded-xl bg-[#F4F7FB] dark:bg-[#040B16] border border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-white hover:border-[#03589E] min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Botão Seletor Material Design 3 */}
        {todosCultos.length > 0 && cultoSelecionado ? (
          <button
            type="button"
            onClick={() => setShowCultoPicker(true)}
            aria-haspopup="dialog"
            aria-expanded={showCultoPicker}
            className="w-full text-left p-3.5 rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] hover:border-[#03589E] active:scale-[0.99] transition-all flex items-center justify-between gap-3"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase ${
                    cultoSelecionado.status === 'em_andamento'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cultoSelecionado.status === 'em_andamento' ? 'Ao Vivo' : 'Encerrado'}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {formatDataBr(cultoSelecionado.data)}
                  {cultoSelecionado.horarioInicio ? ` • ${cultoSelecionado.horarioInicio}` : ''}
                </span>
              </div>

              <p className="text-base font-extrabold text-[#062552] dark:text-white leading-snug">
                {cultoSelecionado.nomeCulto}
              </p>

              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Dirigente: <strong className="text-[#062552] dark:text-white">{cultoSelecionado.dirigenteNome}</strong>
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#081529] border border-[#D5E2F0] dark:border-[#1C3559] flex items-center justify-center shrink-0 text-[#03589E] dark:text-[#60A5FA]">
              <ChevronDown className="w-5 h-5" />
            </div>
          </button>
        ) : (
          <div className="text-center py-6 bg-[#F4F7FB] dark:bg-[#040B16] rounded-2xl border border-[#D5E2F0] dark:border-[#1C3559]">
            <Church className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
            <p className="text-sm font-bold text-[#062552] dark:text-slate-200">
              Nenhum culto registrado ainda.
            </p>
          </div>
        )}
      </section>

      {/* Resumo Numérico Compacto (2x2 em 1 linha por item) */}
      {cultoSelecionado && (
        <>
          <section className="grid grid-cols-2 gap-2">
            {resumoChips.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-white dark:bg-[#081529] px-3 py-2.5 rounded-2xl border border-[#D5E2F0] dark:border-[#1C3559] flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${item.iconClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-base font-black text-[#062552] dark:text-white shrink-0">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </section>

          {/* Filtros de Status */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'todos', label: `Todos (${avisosDoCulto.length})` },
              {
                id: 'anunciado',
                label: `Lidos (${avisosDoCulto.filter((a) => a.status === 'anunciado').length})`,
              },
              {
                id: 'pendente',
                label: `Faltam (${avisosDoCulto.filter((a) => a.status === 'pendente').length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFiltroStatus(tab.id as typeof filtroStatus)}
                className={`py-2.5 px-2 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all min-h-[44px] whitespace-nowrap ${
                  filtroStatus === tab.id
                    ? 'bg-[#03589E] border-[#03589E] text-white shadow-sm'
                    : 'bg-white dark:bg-[#081529] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Lista de Avisos */}
          {avisosFiltrados.length === 0 ? (
            <div className="bg-white dark:bg-[#081529] rounded-2xl border border-[#D5E2F0] dark:border-[#1C3559] p-6 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
              Nenhum aviso neste filtro.
            </div>
          ) : (
            <div className="space-y-3">
              {avisosFiltrados.map((aviso) => {
                const subtitulo = renderAvisoSubtitulo(aviso);
                const visual = getAvisoVisual(aviso);
                const VisualIcon = visual.icon;
                return (
                  <div
                    key={aviso.id}
                    className={`rounded-2xl border-2 overflow-hidden shadow-subtle ${visual.cardBg} ${visual.cardBorder}`}
                  >
                    <div className={`px-4 py-2 flex items-center justify-between gap-2 ${visual.headerBg}`}>
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white">
                        <VisualIcon className="w-4 h-4 shrink-0" />
                        <span>{visual.label}</span>
                      </span>
                      <div className="flex items-center gap-2 text-xs font-bold text-white/95">
                        {aviso.status === 'anunciado' ? (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Lido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Pendente
                          </span>
                        )}
                        <span className="opacity-75">•</span>
                        <span>{formatHora(aviso.criadoEm)}</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-extrabold text-base text-[#062552] dark:text-white leading-snug">
                        {renderAvisoTitulo(aviso)}
                      </h4>
                      {subtitulo && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{subtitulo}</p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Enviado por {aviso.autorNome}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal Customizado de Seleção de Culto (substitui o select nativo) */}
      {showCultoPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="culto-picker-title"
          onClick={() => setShowCultoPicker(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#081529] rounded-3xl border border-[#D5E2F0] dark:border-[#1C3559] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#062552] text-white px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Church className="w-5 h-5 text-[#FBB016] shrink-0" />
                <h3 id="culto-picker-title" className="text-base font-extrabold">
                  Escolher Culto
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCultoPicker(false)}
                aria-label="Fechar seleção de culto"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 space-y-2.5 overflow-y-auto">
              {todosCultos.map((c) => {
                const selected = c.id === effectiveSelectedId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCultoSelecionadoId(c.id);
                      setShowCultoPicker(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                      selected
                        ? 'border-[#03589E] bg-[#E8F2FC] dark:bg-[#0D2748]'
                        : 'border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16]'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase ${
                            c.status === 'em_andamento'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {c.status === 'em_andamento' ? 'Ao Vivo' : 'Encerrado'}
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {formatDataBr(c.data)}
                          {c.horarioInicio ? ` • ${c.horarioInicio}` : ''}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-extrabold text-[#062552] dark:text-white leading-snug">
                        {c.nomeCulto}
                      </p>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Dirigente: {c.dirigenteNome}
                      </p>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selected
                          ? 'bg-[#03589E] border-[#03589E] text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
