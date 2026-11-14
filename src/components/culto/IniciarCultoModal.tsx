import React, { useState } from 'react';
import { Church, X, Clock, Crown, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCulto } from '../../context/CultoContext';
import { getCargoLabel } from '../../utils/formatters';

interface IniciarCultoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SUGESTOES_CULTO = [
  'Culto da Família e Celebração',
  'Culto de Doutrina e Estudo',
  'Culto de Oração e Clamor',
  'Culto de Jovens e Mocidade',
  'Santa Ceia do Senhor',
  'Culto de Missões e Evangelismo',
  'Vigília de Oração',
  'Outro Culto',
];

export const IniciarCultoModal: React.FC<IniciarCultoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;
  return <IniciarCultoModalContent onClose={onClose} onSuccess={onSuccess} />;
};

const IniciarCultoModalContent: React.FC<{ onClose: () => void; onSuccess?: () => void }> = ({
  onClose,
  onSuccess,
}) => {
  const { obreiros, currentUser } = useAuth();
  const { iniciarNovoCulto } = useCulto();

  const [nomeCultoPreset, setNomeCultoPreset] = useState(SUGESTOES_CULTO[0]);
  const [nomeCultoPersonalizado, setNomeCultoPersonalizado] = useState('');
  const [selectedDirigenteId, setSelectedDirigenteId] = useState<string>(
    currentUser?.id || (obreiros[0] ? obreiros[0].id : '')
  );
  const [horario, setHorario] = useState('19:30');
  const [erro, setErro] = useState<string | null>(null);

  const isOutroCulto = nomeCultoPreset === 'Outro Culto';

  const lideresOrdenados = [...obreiros]
    .filter((o) => o.ativo !== false)
    .sort((a, b) => {
      const rank = (c: string) => (c === 'pastor' ? 1 : c === 'presbitero' ? 2 : 3);
      return rank(a.cargo) - rank(b.cargo);
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    const nomeFinal = isOutroCulto ? nomeCultoPersonalizado.trim() : nomeCultoPreset;
    if (!nomeFinal) {
      setErro('Informe o nome do culto antes de continuar.');
      return;
    }

    const dirigente = obreiros.find((o) => o.id === selectedDirigenteId);
    if (!dirigente) {
      setErro('Selecione quem irá dirigir o culto de hoje.');
      return;
    }

    const res = iniciarNovoCulto(nomeFinal, dirigente, horario.trim() || undefined);
    if (!res.success) {
      setErro(res.message || 'Não foi possível iniciar o culto.');
      return;
    }

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040B16]/75 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#081529] border-2 border-[#D5E2F0] dark:border-[#1C3559] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho IPRB */}
        <div className="bg-gradient-to-r from-[#062552] to-[#03589E] px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-xl">
              <Church className="w-6 h-6 text-[#FBB016]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold leading-tight">Iniciar Culto</h2>
              <p className="text-xs text-[#E8F2FC]">Selecione o culto e quem dirige</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">
          {erro && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Tipo de Culto */}
          <div>
            <label className="block text-sm font-extrabold text-[#062552] dark:text-white mb-2">
              1. Qual é o culto de hoje?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGESTOES_CULTO.map((sugestao) => {
                const isSelected = nomeCultoPreset === sugestao;
                return (
                  <button
                    key={sugestao}
                    type="button"
                    onClick={() => setNomeCultoPreset(sugestao)}
                    className={`p-3 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between gap-2 min-h-[48px] ${
                      isSelected
                        ? 'bg-[#03589E] border-[#03589E] text-white shadow-sm'
                        : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-200 hover:border-[#03589E]'
                    }`}
                  >
                    <span className="leading-snug">{sugestao}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isOutroCulto && (
              <input
                type="text"
                required
                value={nomeCultoPersonalizado}
                onChange={(e) => setNomeCultoPersonalizado(e.target.value)}
                placeholder="Digite o nome do culto ou evento"
                className="w-full px-4 py-3 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white mt-2.5 focus:border-[#03589E] focus:outline-none"
              />
            )}
          </div>

          {/* Horário */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white mb-2">
              <Clock className="w-4 h-4 text-[#03589E] dark:text-[#60A5FA]" />
              <span>2. Horário de início</span>
            </label>
            <input
              type="text"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              placeholder="Ex: 19:30"
              className="w-full px-4 py-3 text-base font-bold rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white focus:border-[#03589E] focus:outline-none"
            />
          </div>

          {/* Dirigente */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white mb-2">
              <Crown className="w-4 h-4 text-[#E85D04] dark:text-[#FBB016]" />
              <span>3. Quem vai dirigir os avisos hoje?</span>
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {lideresOrdenados.map((o) => {
                const selected = selectedDirigenteId === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setSelectedDirigenteId(o.id)}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-2 min-h-[52px] ${
                      selected
                        ? 'bg-[#FFF4E5] dark:bg-[#F59E0B]/15 border-[#E85D04] dark:border-[#FBB016] text-[#062552] dark:text-white shadow-sm'
                        : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-200 hover:border-[#03589E]'
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-sm sm:text-base">{o.nome}</p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {getCargoLabel(o.cargo)}
                      </p>
                    </div>
                    {selected && <Check className="w-5 h-5 text-[#E85D04] dark:text-[#FBB016] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#062552] dark:text-slate-200 font-bold text-sm min-h-[52px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] py-3.5 px-5 rounded-2xl bg-[#03589E] hover:bg-[#062552] text-white font-extrabold text-base shadow-md transition-all flex items-center justify-center gap-2 min-h-[52px]"
            >
              <Church className="w-5 h-5 shrink-0" />
              <span>Abrir Culto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
