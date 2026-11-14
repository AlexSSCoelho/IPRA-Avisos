import React, { useState } from 'react';
import { Send, CheckCircle2, Megaphone, Calendar, Users, Cake } from 'lucide-react';
import { useAvisos } from '../../context/AvisosContext';
import { audioFeedback } from '../../services/audioService';

const SUGESTOES_TITULO = [
  'Aniversário',
  'Santa Ceia',
  'Jejum da Igreja',
  'Vigília de Oração',
];

export const FormAvisoGeral: React.FC = () => {
  const { adicionarAviso } = useAvisos();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setFeedback({ type: 'error', msg: 'Digite o assunto do comunicado.' });
      return;
    }

    const res = adicionarAviso({
      tipo: 'geral',
      geral: {
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        dataEvento: dataEvento.trim() || undefined,
        destinatario: destinatario.trim() || undefined,
      },
    });

    if (res.success) {
      audioFeedback.playSuccessSound();
      setFeedback({ type: 'success', msg: 'Comunicado enviado.' });
      setTitulo('');
      setDescricao('');
      setDataEvento('');
      setDestinatario('');
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', msg: res.message || 'Erro ao enviar comunicado.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white mb-1.5">
          <Megaphone className="w-4 h-4 text-[#03589E] dark:text-[#60A5FA]" />
          <span>
            Assunto <span className="text-rose-600">*</span>
          </span>
        </label>

        <input
          type="text"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder={
            titulo.toLowerCase().includes('anivers')
              ? 'Ex: Aniversário da Irmã Maria'
              : 'Ex: Santa Ceia no domingo'
          }
          className="w-full px-4 py-3 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:outline-none"
        />

        <div className="flex flex-wrap gap-2 mt-2.5">
          {SUGESTOES_TITULO.map((sugestao) => {
            const isSelected = titulo === sugestao;
            const isNiver = sugestao === 'Aniversário';
            return (
              <button
                key={sugestao}
                type="button"
                onClick={() => setTitulo(isNiver ? 'Aniversário de ' : sugestao)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all min-h-[38px] inline-flex items-center gap-1.5 ${
                  isSelected || (isNiver && titulo.toLowerCase().includes('anivers'))
                    ? isNiver
                      ? 'bg-[#D97706] border-[#D97706] text-white'
                      : 'bg-[#03589E] border-[#03589E] text-white'
                    : isNiver
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-[#FCD34D]'
                      : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-200'
                }`}
              >
                {isNiver && <Cake className="w-3.5 h-3.5 shrink-0" />}
                <span>{sugestao}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-extrabold text-[#062552] dark:text-white mb-1.5">
          Detalhes <span className="font-normal text-slate-500 dark:text-slate-400">(opcional)</span>
        </label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Informações adicionais"
          rows={3}
          className="w-full px-4 py-3 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-bold text-[#062552] dark:text-slate-200 mb-1.5">
            <Calendar className="w-4 h-4 text-[#03589E] dark:text-[#60A5FA]" />
            <span>
              Data e hora <span className="font-normal text-slate-500">(opcional)</span>
            </span>
          </label>
          <input
            type="text"
            value={dataEvento}
            onChange={(e) => setDataEvento(e.target.value)}
            placeholder="Ex: Domingo às 19h"
            className="w-full px-3.5 py-3 text-base rounded-xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:outline-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-bold text-[#062552] dark:text-slate-200 mb-1.5">
            <Users className="w-4 h-4 text-[#03589E] dark:text-[#60A5FA]" />
            <span>
              Público <span className="font-normal text-slate-500">(opcional)</span>
            </span>
          </label>
          <input
            type="text"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
            placeholder="Ex: Toda a igreja"
            className="w-full px-3.5 py-3 text-base rounded-xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:outline-none"
          />
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          className={`flex items-center gap-2.5 p-3.5 rounded-2xl text-sm font-bold border-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-900 dark:text-rose-200'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-4 px-5 bg-[#03589E] hover:bg-[#062552] active:scale-[0.99] text-white font-extrabold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[54px]"
      >
        <Send className="w-5 h-5 shrink-0" />
        <span>Enviar Comunicado</span>
      </button>
    </form>
  );
};
