import React, { useState } from 'react';
import { Send, CheckCircle2, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useAvisos } from '../../context/AvisosContext';
import { getLocalIsoDate } from '../../utils/formatters';
import type { GrupoReuniao } from '../../types';

const GRUPOS_REUNIAO: { id: GrupoReuniao; label: string }[] = [
  { id: 'oracao_casas', label: 'Culto nos Lares' },
  { id: 'irmas', label: 'Círculo de Oração (Irmãs)' },
  { id: 'varoes', label: 'Reunião de Varões' },
  { id: 'jovens', label: 'Mocidade (UMERP)' },
  { id: 'ensaio', label: 'Ensaio de Louvor / Coral' },
  { id: 'criancas', label: 'Culto Infantil / EBD' },
  { id: 'outro', label: 'Outra Reunião' },
];

const DIAS_RAPIDOS = [
  'Hoje',
  'Amanhã',
  'Próx. Domingo',
  'Próx. Terça',
  'Próx. Quarta',
  'Próx. Quinta',
  'Próx. Sábado',
  'Escolher data',
];

const HORARIOS_RAPIDOS = [
  '19h30',
  '19h00',
  '20h00',
  '09h00',
  'Outro',
];

function calcularDataReuniao(
  opcaoDia: string,
  dataCustomIso: string,
  baseDate = new Date()
): { dataIso: string; dataTextoAmigavel: string } {
  if (opcaoDia === 'Escolher data') {
    if (dataCustomIso) {
      try {
        const d = new Date(dataCustomIso + 'T12:00:00');
        const diaMes = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const weekday = d.toLocaleDateString('pt-BR', { weekday: 'long' });
        const weekdayCapitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
        return {
          dataIso: dataCustomIso,
          dataTextoAmigavel: `${weekdayCapitalized}, ${diaMes}`,
        };
      } catch {
        return { dataIso: dataCustomIso, dataTextoAmigavel: dataCustomIso };
      }
    }
    return { dataIso: getLocalIsoDate(baseDate), dataTextoAmigavel: 'Data a confirmar' };
  }

  const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 12, 0, 0);

  if (opcaoDia === 'Hoje') {
    const iso = getLocalIsoDate(d);
    const diaMes = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return { dataIso: iso, dataTextoAmigavel: `Hoje (${diaMes})` };
  }

  if (opcaoDia === 'Amanhã') {
    d.setDate(d.getDate() + 1);
    const iso = getLocalIsoDate(d);
    const diaMes = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return { dataIso: iso, dataTextoAmigavel: `Amanhã (${diaMes})` };
  }

  const diasSemanaMap: Record<string, { dayIndex: number; nome: string }> = {
    'Próx. Domingo': { dayIndex: 0, nome: 'Domingo' },
    'Próx. Terça': { dayIndex: 2, nome: 'Terça-feira' },
    'Próx. Quarta': { dayIndex: 3, nome: 'Quarta-feira' },
    'Próx. Quinta': { dayIndex: 4, nome: 'Quinta-feira' },
    'Próx. Sábado': { dayIndex: 6, nome: 'Sábado' },
  };

  if (diasSemanaMap[opcaoDia]) {
    const { dayIndex, nome } = diasSemanaMap[opcaoDia];
    const currentDay = d.getDay();
    let diff = dayIndex - currentDay;
    if (diff <= 0) diff += 7;
    d.setDate(d.getDate() + diff);
    const iso = getLocalIsoDate(d);
    const diaMes = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return { dataIso: iso, dataTextoAmigavel: `${nome} (${diaMes})` };
  }

  return { dataIso: getLocalIsoDate(d), dataTextoAmigavel: opcaoDia };
}

export const FormReuniao: React.FC = () => {
  const { adicionarAviso } = useAvisos();

  const [grupo, setGrupo] = useState<GrupoReuniao>('oracao_casas');
  const [grupoPersonalizado, setGrupoPersonalizado] = useState('');

  const [dataSelecionada, setDataSelecionada] = useState('Próx. Terça');
  const [dataPersonalizadaIso, setDataPersonalizadaIso] = useState(() => getLocalIsoDate());
  const [horarioSelecionado, setHorarioSelecionado] = useState('19h30');
  const [horarioPersonalizado, setHorarioPersonalizado] = useState('');

  const [local, setLocal] = useState('No Templo da IPRA');
  const [responsavel, setResponsavel] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const horarioFinal =
      horarioSelecionado === 'Outro'
        ? horarioPersonalizado.trim() || '19h30'
        : horarioSelecionado;

    const { dataIso, dataTextoAmigavel } = calcularDataReuniao(
      dataSelecionada,
      dataPersonalizadaIso
    );

    adicionarAviso({
      tipo: 'reuniao',
      reuniao: {
        grupo,
        grupoNomePersonalizado: grupo === 'outro' ? grupoPersonalizado.trim() || undefined : undefined,
        dataIso,
        dataTexto: `${dataTextoAmigavel} às ${horarioFinal}`,
        horario: horarioFinal,
        local: local.trim() || 'No Templo da IPRA',
        responsavel: responsavel.trim() || undefined,
      },
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);

    setLocal('No Templo da IPRA');
    setResponsavel('');
    setHorarioPersonalizado('');
    setGrupoPersonalizado('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* 1. QUAL REUNIÃO? */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white mb-2">
          <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Qual Reunião ou Encontro? <span className="text-rose-600">*</span></span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GRUPOS_REUNIAO.map((item) => {
            const isSelected = grupo === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setGrupo(item.id)}
                className={`py-3 px-3.5 rounded-xl border-2 text-left text-sm font-bold transition-all min-h-[48px] ${
                  isSelected
                    ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm'
                    : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-200 hover:border-emerald-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {grupo === 'outro' && (
          <input
            type="text"
            required
            value={grupoPersonalizado}
            onChange={(e) => setGrupoPersonalizado(e.target.value)}
            placeholder="Digite o nome da reunião ou assembleia"
            className="w-full px-4 py-3.5 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white mt-2.5 focus:bg-white dark:focus:bg-[#040B16] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none"
          />
        )}
      </div>

      {/* 2. QUANDO? */}
      <div className="space-y-4 bg-[#F4F7FB] dark:bg-[#040B16] p-4 rounded-2xl border border-[#D5E2F0] dark:border-[#1C3559]">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white mb-2">
            <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Qual dia? <span className="text-rose-600">*</span></span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIAS_RAPIDOS.map((d) => {
              const isSelected = dataSelecionada === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDataSelecionada(d)}
                  className={`px-2.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all min-h-[44px] ${
                    isSelected
                      ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm'
                      : 'bg-white dark:bg-[#081529] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {dataSelecionada === 'Escolher data' && (
            <div className="mt-3 space-y-1">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                Toque para escolher o dia no calendário:
              </label>
              <input
                type="date"
                required
                value={dataPersonalizadaIso}
                onChange={(e) => setDataPersonalizadaIso(e.target.value)}
                className="w-full px-4 py-3 text-base rounded-xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-white dark:bg-[#081529] text-[#0D213A] dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white mb-2">
            <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Qual horário? <span className="text-rose-600">*</span></span>
          </label>
          <div className="flex flex-wrap gap-2">
            {HORARIOS_RAPIDOS.map((h) => {
              const isSelected = horarioSelecionado === h;
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorarioSelecionado(h)}
                  className={`flex-1 min-w-[82px] px-2.5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all min-h-[44px] ${
                    isSelected
                      ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm'
                      : 'bg-white dark:bg-[#081529] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-200'
                  }`}
                >
                  {h}
                </button>
              );
            })}
          </div>

          {horarioSelecionado === 'Outro' && (
            <input
              type="text"
              required
              value={horarioPersonalizado}
              onChange={(e) => setHorarioPersonalizado(e.target.value)}
              placeholder="Ex: 18h45 ou 20h30"
              className="w-full px-4 py-3 text-base rounded-xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-white dark:bg-[#081529] text-[#0D213A] dark:text-white mt-2.5 focus:outline-none focus:border-emerald-600"
            />
          )}
        </div>
      </div>

      {/* 3. ONDE? */}
      <div>
        <label
          htmlFor="reu-local"
          className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white mb-2"
        >
          <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Onde vai acontecer? <span className="text-rose-600">*</span></span>
        </label>
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <button
            type="button"
            onClick={() => setLocal('No Templo da IPRA')}
            className={`px-3 py-3 rounded-xl text-sm font-bold border-2 transition-all min-h-[48px] ${
              local === 'No Templo da IPRA'
                ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm'
                : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-200'
            }`}
          >
            No Templo da IPRA
          </button>
          <button
            type="button"
            onClick={() => setLocal('')}
            className={`px-3 py-3 rounded-xl text-sm font-bold border-2 transition-all min-h-[48px] ${
              local !== 'No Templo da IPRA'
                ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm'
                : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-200'
            }`}
          >
            Nos lares ou outro local
          </button>
        </div>
        <input
          id="reu-local"
          type="text"
          required
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Ex: Rua Bahia, 450"
          className="w-full px-4 py-3.5 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none"
        />
      </div>

      {/* 4. RESPONSÁVEL */}
      <div>
        <label
          htmlFor="reu-resp"
          className="block text-sm font-extrabold text-[#062552] dark:text-white mb-1.5"
        >
          Responsável ou Líder (Opcional)
        </label>
        <input
          id="reu-resp"
          type="text"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          placeholder="Ex: Pb. Donozor / Irmã Marta"
          className="w-full px-4 py-3.5 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none"
        />
      </div>

      {showSuccessToast && (
        <div
          role="status"
          className="bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 px-4 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-sm"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-sm sm:text-base font-extrabold">
            Pronto! Aviso de reunião enviado para o Púlpito.
          </span>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-4 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 active:scale-[0.99] text-white font-black text-base sm:text-lg shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2.5 transition-all min-h-[56px]"
      >
        <Send className="w-5 h-5 shrink-0" />
        <span>Enviar Reunião</span>
      </button>
    </form>
  );
};
