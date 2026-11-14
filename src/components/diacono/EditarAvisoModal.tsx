import React, { useState } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import type { AvisoItem, VisitanteData, CategoriaOracao, GrupoReuniao } from '../../types';
import { useAvisos } from '../../context/AvisosContext';
import { formatarDataIsoAmigavel } from '../../utils/formatters';

interface EditarAvisoModalProps {
  aviso: AvisoItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditarAvisoModal: React.FC<EditarAvisoModalProps> = ({ aviso, isOpen, onClose }) => {
  if (!isOpen || !aviso) return null;
  return <EditarAvisoModalContent key={aviso.id} aviso={aviso} onClose={onClose} />;
};

const EditarAvisoModalContent: React.FC<{ aviso: AvisoItem; onClose: () => void }> = ({
  aviso,
  onClose,
}) => {
  const { editarAviso } = useAvisos();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Visitante
  const [visNome, setVisNome] = useState(aviso.visitante?.nome || '');
  const [visGenero, setVisGenero] = useState<VisitanteData['genero']>(
    aviso.visitante?.genero || 'homem'
  );
  const [visCidade, setVisCidade] = useState(aviso.visitante?.cidade || '');
  const [visIgreja, setVisIgreja] = useState(aviso.visitante?.igreja || '');
  const [visAcompanhante, setVisAcompanhante] = useState(aviso.visitante?.acompanhante || '');
  const [visObs, setVisObs] = useState(aviso.visitante?.observacao || '');

  // Oracao
  const [oraNome, setOraNome] = useState(aviso.oracao?.nomePessoa || '');
  const [oraCat, setOraCat] = useState<CategoriaOracao>(aviso.oracao?.categoria || 'saude');
  const [oraMotivo, setOraMotivo] = useState(aviso.oracao?.motivo || '');
  const [oraUrgente, setOraUrgente] = useState(!!aviso.oracao?.urgente);

  // Reuniao
  const [reuGrupo, setReuGrupo] = useState<GrupoReuniao>(aviso.reuniao?.grupo || 'oracao_casas');
  const [reuGrupoPers, setReuGrupoPers] = useState(aviso.reuniao?.grupoNomePersonalizado || '');
  const [reuDataIso, setReuDataIso] = useState(aviso.reuniao?.dataIso || '');
  const reuDataTextoLegado = aviso.reuniao?.dataTexto || '';
  const [reuHorario, setReuHorario] = useState(aviso.reuniao?.horario || '');
  const [reuLocal, setReuLocal] = useState(aviso.reuniao?.local || '');
  const [reuResp, setReuResp] = useState(aviso.reuniao?.responsavel || '');

  // Geral
  const [gerTitulo, setGerTitulo] = useState(aviso.geral?.titulo || '');
  const [gerDesc, setGerDesc] = useState(aviso.geral?.descricao || '');
  const [gerData, setGerData] = useState(aviso.geral?.dataEvento || '');
  const [gerDest, setGerDest] = useState(aviso.geral?.destinatario || '');

  const inputClass =
    'w-full px-4 py-3 text-base rounded-xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:outline-none';
  const labelClass = 'block text-sm font-extrabold text-[#062552] dark:text-slate-200 mb-1.5';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (aviso.tipo === 'visitante') {
      if (!visNome.trim()) {
        setErrorMsg('O nome do visitante é obrigatório.');
        return;
      }
      const res = editarAviso(aviso.id, {
        visitante: {
          nome: visNome.trim(),
          genero: visGenero,
          cidade: visCidade.trim() || undefined,
          igreja: visIgreja.trim() || undefined,
          acompanhante: visAcompanhante.trim() || undefined,
          observacao: visObs.trim() || undefined,
        },
      });
      if (!res.success) {
        setErrorMsg(res.message || 'Erro ao salvar.');
        return;
      }
    } else if (aviso.tipo === 'oracao') {
      if (!oraNome.trim()) {
        setErrorMsg('O nome da pessoa é obrigatório.');
        return;
      }
      const res = editarAviso(aviso.id, {
        oracao: {
          nomePessoa: oraNome.trim(),
          categoria: oraCat,
          motivo: oraMotivo.trim() || undefined,
          urgente: oraUrgente,
        },
      });
      if (!res.success) {
        setErrorMsg(res.message || 'Erro ao salvar.');
        return;
      }
    } else if (aviso.tipo === 'reuniao') {
      if (!reuHorario.trim() || !reuLocal.trim()) {
        setErrorMsg('Preencha horário e local da reunião.');
        return;
      }
      const dataTextoFinal = reuDataIso ? formatarDataIsoAmigavel(reuDataIso) : reuDataTextoLegado;
      if (!dataTextoFinal) {
        setErrorMsg('Selecione o dia da reunião.');
        return;
      }
      const res = editarAviso(aviso.id, {
        reuniao: {
          grupo: reuGrupo,
          grupoNomePersonalizado: reuGrupo === 'outro' ? reuGrupoPers.trim() : undefined,
          dataTexto: dataTextoFinal,
          dataIso: reuDataIso || undefined,
          horario: reuHorario.trim(),
          local: reuLocal.trim(),
          responsavel: reuResp.trim() || undefined,
        },
      });
      if (!res.success) {
        setErrorMsg(res.message || 'Erro ao salvar.');
        return;
      }
    } else if (aviso.tipo === 'geral') {
      if (!gerTitulo.trim()) {
        setErrorMsg('O título do comunicado é obrigatório.');
        return;
      }
      const res = editarAviso(aviso.id, {
        geral: {
          titulo: gerTitulo.trim(),
          descricao: gerDesc.trim() || undefined,
          dataEvento: gerData.trim() || undefined,
          destinatario: gerDest.trim() || undefined,
        },
      });
      if (!res.success) {
        setErrorMsg(res.message || 'Erro ao salvar.');
        return;
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040B16]/75 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#081529] border-2 border-[#D5E2F0] dark:border-[#1C3559] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#062552] to-[#03589E] px-5 py-4 text-white flex items-center justify-between shrink-0">
          <h3 className="font-extrabold text-lg">Editar Aviso</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Fechar edição"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-sm font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {aviso.tipo === 'visitante' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nome do Visitante *</label>
                <input
                  type="text"
                  required
                  value={visNome}
                  onChange={(e) => setVisNome(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Como apresentar no púlpito</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'homem', label: 'Irmão' },
                    { id: 'mulher', label: 'Irmã' },
                    { id: 'casal', label: 'Casal' },
                    { id: 'familia', label: 'Família' },
                    { id: 'crianca', label: 'Criança' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setVisGenero(g.id as VisitanteData['genero'])}
                      className={`py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all min-h-[44px] ${
                        visGenero === g.id
                          ? 'bg-[#03589E] text-white border-[#03589E]'
                          : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Cidade / Bairro</label>
                  <input
                    type="text"
                    value={visCidade}
                    onChange={(e) => setVisCidade(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Igreja de Origem</label>
                  <input
                    type="text"
                    value={visIgreja}
                    onChange={(e) => setVisIgreja(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Veio com quem?</label>
                <input
                  type="text"
                  value={visAcompanhante}
                  onChange={(e) => setVisAcompanhante(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Observação</label>
                <input
                  type="text"
                  value={visObs}
                  onChange={(e) => setVisObs(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {aviso.tipo === 'oracao' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Orar por quem? *</label>
                <input
                  type="text"
                  required
                  value={oraNome}
                  onChange={(e) => setOraNome(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Categoria do Pedido</label>
                <select
                  value={oraCat}
                  onChange={(e) => setOraCat(e.target.value as CategoriaOracao)}
                  className={inputClass}
                >
                  <option value="saude">Saúde / Cirurgia / Enfermidade</option>
                  <option value="familia">Família / Lar / Filhos</option>
                  <option value="acao_gracas">Ação de Graças / Vitória</option>
                  <option value="emprego">Emprego / Finanças</option>
                  <option value="viagem">Viagem / Proteção</option>
                  <option value="luto">Consolo / Luto</option>
                  <option value="outro">Outro Pedido</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Detalhes / Motivo</label>
                <textarea
                  value={oraMotivo}
                  onChange={(e) => setOraMotivo(e.target.value)}
                  rows={3}
                  className={inputClass}
                />
              </div>

              <button
                type="button"
                onClick={() => setOraUrgente((prev) => !prev)}
                className={`w-full p-3.5 rounded-xl border-2 text-left text-sm font-bold flex items-center justify-between transition-all min-h-[48px] ${
                  oraUrgente
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200'
                    : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Marcar como pedido URGENTE</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-[#081529] border border-current text-xs">
                  {oraUrgente ? 'SIM' : 'NÃO'}
                </span>
              </button>
            </div>
          )}

          {aviso.tipo === 'reuniao' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Grupo / Ministério</label>
                <select
                  value={reuGrupo}
                  onChange={(e) => setReuGrupo(e.target.value as GrupoReuniao)}
                  className={inputClass}
                >
                  <option value="oracao_casas">Culto nos Lares / Oração</option>
                  <option value="irmas">Círculo de Oração (Irmãs)</option>
                  <option value="varoes">Reunião de Varões</option>
                  <option value="jovens">Mocidade (UMERP)</option>
                  <option value="ensaio">Ensaio / Louvor / Coral</option>
                  <option value="criancas">Culto Infantil / EBD</option>
                  <option value="outro">Outra Reunião</option>
                </select>
              </div>

              {reuGrupo === 'outro' && (
                <div>
                  <label className={labelClass}>Nome da Reunião</label>
                  <input
                    type="text"
                    value={reuGrupoPers}
                    onChange={(e) => setReuGrupoPers(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Data da Reunião</label>
                  <input
                    type="date"
                    value={reuDataIso}
                    onChange={(e) => setReuDataIso(e.target.value)}
                    className={inputClass}
                  />
                  {!reuDataIso && reuDataTextoLegado && (
                    <p className="text-xs text-slate-500 mt-1">Atual: {reuDataTextoLegado}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Horário *</label>
                  <input
                    type="text"
                    required
                    value={reuHorario}
                    onChange={(e) => setReuHorario(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Local *</label>
                <input
                  type="text"
                  required
                  value={reuLocal}
                  onChange={(e) => setReuLocal(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Responsável / Anfitrião</label>
                <input
                  type="text"
                  value={reuResp}
                  onChange={(e) => setReuResp(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {aviso.tipo === 'geral' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Título do Comunicado *</label>
                <input
                  type="text"
                  required
                  value={gerTitulo}
                  onChange={(e) => setGerTitulo(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Texto / Detalhes</label>
                <textarea
                  value={gerDesc}
                  onChange={(e) => setGerDesc(e.target.value)}
                  rows={3}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Data / Horário</label>
                  <input
                    type="text"
                    value={gerData}
                    onChange={(e) => setGerData(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Para quem</label>
                  <input
                    type="text"
                    value={gerDest}
                    onChange={(e) => setGerDest(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6EEF8] dark:border-[#1C3559]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl text-sm font-bold text-[#062552] dark:text-slate-200 bg-[#F4F7FB] dark:bg-[#040B16] border-2 border-[#D5E2F0] dark:border-[#1C3559] hover:bg-slate-100 dark:hover:bg-[#0D1E38] transition-colors min-h-[48px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl text-sm font-extrabold text-white bg-[#03589E] hover:bg-[#062552] shadow-md flex items-center gap-2 transition-colors min-h-[48px]"
            >
              <Save className="w-4 h-4 shrink-0" />
              <span>Salvar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
