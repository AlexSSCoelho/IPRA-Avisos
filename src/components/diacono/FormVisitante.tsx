import React, { useState } from 'react';
import { Send, CheckCircle2, MapPin, Church as ChurchIcon, User } from 'lucide-react';
import { useAvisos } from '../../context/AvisosContext';

export const FormVisitante: React.FC = () => {
  const { adicionarAviso } = useAvisos();

  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState<'homem' | 'mulher' | 'casal' | 'crianca' | 'familia'>('homem');
  const [cidade, setCidade] = useState('');
  const [igreja, setIgreja] = useState('');
  const [observacao, setObservacao] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    adicionarAviso({
      tipo: 'visitante',
      visitante: {
        nome: nome.trim(),
        genero,
        cidade: cidade.trim() || undefined,
        igreja: igreja.trim() || undefined,
        observacao: observacao.trim() || undefined,
      },
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);

    setNome('');
    setCidade('');
    setIgreja('');
    setObservacao('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* 1. Nome do Visitante */}
      <div>
        <label
          htmlFor="vis-nome"
          className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white mb-1.5"
        >
          <User className="w-4 h-4 text-[#03589E] dark:text-sky-300" />
          <span>Nome do Visitante ou Família <span className="text-rose-600">*</span></span>
        </label>
        <input
          id="vis-nome"
          type="text"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Roberto Silva e Família"
          className="w-full px-4 py-3.5 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:ring-2 focus:ring-[#03589E]/20 focus:outline-none transition-all"
        />
      </div>

      {/* 2. Quem está visitando */}
      <div>
        <label className="block text-sm font-extrabold text-[#062552] dark:text-white mb-1.5">
          Quem é o visitante?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'homem' as const, label: 'Irmão / Homem' },
            { id: 'mulher' as const, label: 'Irmã / Mulher' },
            { id: 'casal' as const, label: 'Casal' },
            { id: 'familia' as const, label: 'Família' },
            { id: 'crianca' as const, label: 'Jovem / Criança' },
          ].map((item, idx) => {
            const isSelected = genero === item.id;
            const spanLast = idx === 4 ? 'col-span-2 sm:col-span-1' : '';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setGenero(item.id)}
                className={`py-3 px-2.5 rounded-xl border-2 text-sm font-bold text-center transition-all min-h-[48px] ${spanLast} ${
                  isSelected
                    ? 'bg-[#03589E] border-[#03589E] text-white shadow-sm'
                    : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-200 hover:border-[#03589E]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Cidade de Origem */}
      <div>
        <label
          htmlFor="vis-cidade"
          className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white mb-1.5"
        >
          <MapPin className="w-4 h-4 text-[#03589E] dark:text-sky-300" />
          <span>Cidade onde mora (Opcional)</span>
        </label>
        <input
          id="vis-cidade"
          type="text"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          placeholder="Ex: Auriflama ou Jales"
          className="w-full px-4 py-3.5 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:ring-2 focus:ring-[#03589E]/20 focus:outline-none transition-all"
        />
      </div>

      {/* 4. Igreja / Denominação */}
      <div>
        <label
          htmlFor="vis-igreja"
          className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white mb-1.5"
        >
          <ChurchIcon className="w-4 h-4 text-[#03589E] dark:text-sky-300" />
          <span>Igreja de origem (Opcional)</span>
        </label>
        <input
          id="vis-igreja"
          type="text"
          value={igreja}
          onChange={(e) => setIgreja(e.target.value)}
          placeholder="Ex: Igreja ou primeira visita"
          className="w-full px-4 py-3.5 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:ring-2 focus:ring-[#03589E]/20 focus:outline-none transition-all"
        />
      </div>

      {/* 5. Acompanhante / Observação */}
      <div>
        <label
          htmlFor="vis-obs"
          className="block text-sm font-extrabold text-[#062552] dark:text-white mb-1.5"
        >
          Veio a convite de quem? / Observação (Opcional)
        </label>
        <input
          id="vis-obs"
          type="text"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Ex: Convidado da irmã Neusa"
          className="w-full px-4 py-3.5 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:ring-2 focus:ring-[#03589E]/20 focus:outline-none transition-all"
        />
      </div>

      {/* Confirmação visível exatamente acima do botão de envio */}
      {showSuccessToast && (
        <div
          role="status"
          className="bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 px-4 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-sm"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-sm sm:text-base font-extrabold">
            Visitante enviado para o púlpito.
          </span>
        </div>
      )}

      {/* Botão de Enviar */}
      <button
        type="submit"
        className="w-full py-4 px-5 rounded-2xl bg-[#03589E] hover:bg-[#0A6AC0] active:scale-[0.99] text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 transition-all min-h-[54px]"
      >
        <Send className="w-5 h-5 shrink-0" />
        <span>Enviar Visitante</span>
      </button>
    </form>
  );
};
