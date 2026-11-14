import React, { useState } from 'react';
import { Send, CheckCircle2, Heart, AlertTriangle, Check } from 'lucide-react';
import { useAvisos } from '../../context/AvisosContext';
import type { CategoriaOracao } from '../../types';

const CATEGORIAS_ORACAO: { id: CategoriaOracao; label: string }[] = [
  { id: 'saude', label: 'Saúde e Cirurgia' },
  { id: 'familia', label: 'Família e Lar' },
  { id: 'causas', label: 'Trabalho e Causas' },
  { id: 'espiritual', label: 'Vida Espiritual' },
  { id: 'agradecimento', label: 'Agradecimento' },
  { id: 'luto', label: 'Consolo no Luto' },
  { id: 'outro', label: 'Outro Motivo' },
];

export const FormOracao: React.FC = () => {
  const { adicionarAviso } = useAvisos();

  const [nomePessoa, setNomePessoa] = useState('');
  const [categoria, setCategoria] = useState<CategoriaOracao>('saude');
  const [motivo, setMotivo] = useState('');
  const [urgente, setUrgente] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomePessoa.trim()) return;

    adicionarAviso({
      tipo: 'oracao',
      oracao: {
        nomePessoa: nomePessoa.trim(),
        categoria,
        motivo: motivo.trim() || undefined,
        urgente,
      },
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);

    setNomePessoa('');
    setMotivo('');
    setUrgente(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* 1. Nome da Pessoa ou Família */}
      <div>
        <label
          htmlFor="ora-nome"
          className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white mb-1.5"
        >
          <Heart className="w-4 h-4 text-[#E85D04] dark:text-[#FBB016]" />
          <span>Nome da Pessoa ou Família <span className="text-rose-600">*</span></span>
        </label>
        <input
          id="ora-nome"
          type="text"
          required
          value={nomePessoa}
          onChange={(e) => setNomePessoa(e.target.value)}
          placeholder="Ex: Dona Antônia"
          className="w-full px-4 py-3.5 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 focus:outline-none transition-all"
        />
      </div>

      {/* 2. Motivo da Oração */}
      <div>
        <label className="block text-sm font-extrabold text-[#062552] dark:text-white mb-1.5">
          Tipo do Pedido
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIAS_ORACAO.map((cat, idx) => {
            const isSelected = categoria === cat.id;
            const spanLast =
              idx === CATEGORIAS_ORACAO.length - 1 && CATEGORIAS_ORACAO.length % 2 === 1
                ? 'col-span-2'
                : '';
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoria(cat.id)}
                className={`py-3 px-3 rounded-xl border-2 text-center text-sm font-bold transition-all min-h-[48px] ${spanLast} ${
                  isSelected
                    ? 'bg-[#E85D04] border-[#E85D04] text-white shadow-sm'
                    : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-200 hover:border-[#E85D04]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detalhes */}
      <div>
        <label
          htmlFor="ora-motivo"
          className="block text-sm font-extrabold text-[#062552] dark:text-white mb-1.5"
        >
          Explicação do Pedido (Opcional)
        </label>
        <textarea
          id="ora-motivo"
          rows={3}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ex: Fará exames na Santa Casa nesta semana."
          className="w-full px-4 py-3.5 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 focus:outline-none transition-all"
        />
      </div>

      {/* 4. Destaque / Urgência como botão grande e fácil de tocar */}
      <button
        type="button"
        onClick={() => setUrgente(!urgente)}
        className={`w-full text-left border-2 rounded-2xl p-4 flex items-start gap-3 transition-all min-h-[60px] ${
          urgente
            ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 ring-2 ring-rose-500/20'
            : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559]'
        }`}
      >
        <div
          className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${
            urgente
              ? 'bg-rose-600 border-rose-600 text-white'
              : 'bg-white dark:bg-[#081529] border-slate-400'
          }`}
        >
          {urgente && <Check className="w-4 h-4 stroke-[3]" />}
        </div>
        <div className="min-w-0">
          <div className={`text-sm sm:text-base font-extrabold flex flex-wrap items-center gap-2 ${
            urgente ? 'text-rose-800 dark:text-rose-200' : 'text-[#062552] dark:text-white'
          }`}>
            <AlertTriangle className={`w-4 h-4 shrink-0 ${urgente ? 'text-rose-600 dark:text-rose-400' : 'text-[#E85D04]'}`} />
            <span>Pedido Urgente</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
            Destaca no topo para o pastor.
          </p>
        </div>
      </button>

      {/* Confirmação visível junto ao botão */}
      {showSuccessToast && (
        <div
          role="status"
          className="bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 px-4 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-sm"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-sm sm:text-base font-extrabold">
            Pedido de oração enviado.
          </span>
        </div>
      )}

      {/* Botão de Envio */}
      <button
        type="submit"
        className="w-full py-4 px-5 rounded-2xl bg-[#E85D04] hover:bg-[#D45000] active:scale-[0.99] text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 transition-all min-h-[54px]"
      >
        <Send className="w-5 h-5 shrink-0" />
        <span>Enviar Oração</span>
      </button>
    </form>
  );
};
