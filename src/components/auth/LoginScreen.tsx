import React, { useState } from 'react';
import {
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  Crown,
  Check,
  User,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCulto } from '../../context/CultoContext';
import { useAvisos } from '../../context/AvisosContext';
import type { Obreiro } from '../../types';
import { getCargoLabel } from '../../utils/formatters';

interface LoginScreenProps {
  onSuccess?: (isDirigenteNoCulto: boolean, obreiro: Obreiro) => void;
}

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { obreiros, savedLoginUser, login, clearSavedLogin, verifyObreiroPin, verifyAdminPin } =
    useAuth();
  const { cultoAtivo, definirDirigente } = useCulto();
  const { isCultoEmAndamento } = useAvisos();

  const [nomeInput, setNomeInput] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isDirigindoCulto, setIsDirigindoCulto] = useState(false);
  const [adminOverridePin, setAdminOverridePin] = useState('');
  const [needsAdminOverride, setNeedsAdminOverride] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cultoEmAndamento = isCultoEmAndamento;

  const resolveObreiroPorNome = (rawName: string): { obreiro?: Obreiro; erro?: string } => {
    const query = normalizeText(rawName);
    if (!query) {
      return { erro: 'Digite seu nome.' };
    }

    const ativos = obreiros.filter((o) => o.ativo !== false);

    // 1. Nome completo exato
    const exactMatch = ativos.find((o) => normalizeText(o.nome) === query);
    if (exactMatch) return { obreiro: exactMatch };

    // 2. Primeiro nome exato (se único)
    const firstMatches = ativos.filter((o) => normalizeText(o.nome).split(' ')[0] === query);
    if (firstMatches.length === 1) return { obreiro: firstMatches[0] };
    if (firstMatches.length > 1) {
      return { erro: 'Há mais de um obreiro com esse nome. Digite seu nome completo.' };
    }

    // 3. Correspondência parcial única
    const partialMatches = ativos.filter((o) => normalizeText(o.nome).includes(query));
    if (partialMatches.length === 1) return { obreiro: partialMatches[0] };
    if (partialMatches.length > 1) {
      return { erro: 'Mais de um nome encontrado. Digite seu nome e sobrenome.' };
    }

    return { erro: 'Nome não encontrado. Confira a grafia e tente novamente.' };
  };

  const concluirEntrada = (obreiro: Obreiro, salvarAcesso: boolean) => {
    if (cultoEmAndamento && isDirigindoCulto) {
      const jaTemDirigente =
        cultoAtivo?.dirigenteId && cultoAtivo.dirigenteId !== obreiro.id;

      if (jaTemDirigente && !obreiro.isAdmin) {
        if (!needsAdminOverride || !adminOverridePin) {
          setNeedsAdminOverride(true);
          setErrorMsg('Informe a senha administrativa para assumir a direção.');
          return;
        }
        if (!verifyAdminPin(adminOverridePin)) {
          setErrorMsg('Senha administrativa incorreta.');
          return;
        }
      }

      const resDirigente = definirDirigente(
        obreiro,
        adminOverridePin || undefined,
        obreiro
      );
      if (!resDirigente.success) {
        setErrorMsg(resDirigente.message || 'Não foi possível assumir a direção.');
        return;
      }

      login(obreiro, salvarAcesso);
      onSuccess?.(true, obreiro);
      return;
    }

    login(obreiro, salvarAcesso);
    onSuccess?.(false, obreiro);
  };

  const handleEntrar = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const { obreiro, erro } = resolveObreiroPorNome(nomeInput);
    if (!obreiro) {
      setErrorMsg(erro || 'Nome inválido.');
      return;
    }

    if (!pin.trim()) {
      setErrorMsg('Digite sua senha.');
      return;
    }

    if (!verifyObreiroPin(obreiro.id, pin)) {
      setErrorMsg('Senha incorreta.');
      return;
    }

    concluirEntrada(obreiro, rememberDevice);
  };

  const handleEntrarSalvo = () => {
    if (!savedLoginUser) return;
    setErrorMsg('');
    const atualizado = obreiros.find((o) => o.id === savedLoginUser.id) || savedLoginUser;
    concluirEntrada(atualizado, true);
  };

  const savedAtivo =
    savedLoginUser && obreiros.some((o) => o.id === savedLoginUser.id && o.ativo !== false);

  return (
    <div className="h-full w-full overflow-y-auto overscroll-y-contain no-scrollbar bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white flex flex-col">
      {/* Cabeçalho Institucional IPRB */}
      <div className="bg-gradient-to-b from-[#062552] to-[#03589E] text-white px-4 pt-7 pb-11 shadow-md shrink-0">
        <div className="max-w-md mx-auto flex flex-col items-center text-center gap-3">
          <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-xl border-4 border-white/85 flex items-center justify-center">
            <img
              src="/logo-ipra.png"
              alt="Logo Igreja Presbiteriana Renovada de Auriflama"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">IPRA Avisos</h1>
            <p className="text-sm text-sky-100 font-medium mt-0.5">
              Igreja Presbiteriana Renovada de Auriflama
            </p>
          </div>

          {cultoEmAndamento && cultoAtivo && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#041938]/85 border border-sky-300/30 text-xs font-bold text-[#FBB016]">
              <span className="w-2 h-2 rounded-full bg-[#E85D04] animate-pulse shrink-0" />
              <span className="truncate max-w-[260px]">{cultoAtivo.nomeCulto}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cartão de Acesso Material Design 3 */}
      <div className="w-full max-w-md mx-auto px-4 -mt-6 pb-8 flex-1 space-y-4">
        {/* Acesso salvo no aparelho */}
        {savedAtivo && savedLoginUser && (
          <div className="bg-white dark:bg-[#081529] border border-[#D5E2F0] dark:border-[#1C3559] rounded-3xl shadow-card p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-[#03589E] text-white font-black text-lg flex items-center justify-center shrink-0">
                  {savedLoginUser.nome.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Acesso salvo neste aparelho
                  </p>
                  <p className="text-base font-extrabold text-[#062552] dark:text-white truncate">
                    {savedLoginUser.nome}
                  </p>
                  <p className="text-xs font-semibold text-[#03589E] dark:text-[#60A5FA] truncate">
                    {getCargoLabel(savedLoginUser.cargo)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearSavedLogin}
                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                aria-label="Remover acesso salvo"
                title="Remover acesso salvo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleEntrarSalvo}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#03589E] hover:bg-[#062552] active:scale-[0.99] text-white font-extrabold text-base shadow-sm flex items-center justify-center gap-2 transition-all min-h-[50px]"
            >
              <span>Entrar como {savedLoginUser.nome.split(' ')[0]}</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>
          </div>
        )}

        {/* Formulário Nome e Senha */}
        <form
          onSubmit={handleEntrar}
          className="bg-white dark:bg-[#081529] border border-[#D5E2F0] dark:border-[#1C3559] rounded-3xl shadow-card p-5 space-y-4"
        >
          <h2 className="text-lg font-extrabold text-[#062552] dark:text-white">
            {savedAtivo ? 'Ou entrar com outro acesso' : 'Entrar'}
          </h2>

          {/* Campo Nome */}
          <div>
            <label
              htmlFor="login-nome"
              className="block text-sm font-bold text-[#062552] dark:text-slate-200 mb-1.5"
            >
              Nome
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-[#03589E] dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-nome"
                type="text"
                autoComplete="name"
                value={nomeInput}
                onChange={(e) => {
                  setNomeInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Digite seu nome"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white text-base placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:outline-none"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label
              htmlFor="login-pin"
              className="block text-sm font-bold text-[#062552] dark:text-slate-200 mb-1.5"
            >
              Senha
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-[#03589E] dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-pin"
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Digite sua senha"
                className="w-full pl-11 pr-20 py-3.5 text-base tracking-wider rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white placeholder:text-slate-400 placeholder:tracking-normal focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-2 rounded-xl text-xs font-bold text-[#03589E] dark:text-sky-300 hover:bg-[#E8F2FC] dark:hover:bg-[#0D1E38] flex items-center gap-1"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPin ? 'Ocultar' : 'Ver'}</span>
              </button>
            </div>
          </div>

          {/* Salvar login neste aparelho */}
          <button
            type="button"
            onClick={() => setRememberDevice(!rememberDevice)}
            className="w-full flex items-center gap-3 py-2 text-left"
          >
            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                rememberDevice
                  ? 'bg-[#03589E] border-[#03589E] text-white'
                  : 'bg-[#F4F7FB] dark:bg-[#040B16] border-slate-400'
              }`}
            >
              {rememberDevice && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
            <span className="text-sm font-semibold text-[#062552] dark:text-slate-200">
              Salvar acesso neste aparelho
            </span>
          </button>

          {/* Opção de Dirigente quando houver culto ativo */}
          {cultoEmAndamento && (
            <button
              type="button"
              onClick={() => {
                setIsDirigindoCulto(!isDirigindoCulto);
                setNeedsAdminOverride(false);
                setErrorMsg('');
              }}
              className={`w-full text-left rounded-2xl p-3 border-2 flex items-center gap-3 transition-all ${
                isDirigindoCulto
                  ? 'bg-[#FFF9EB] dark:bg-amber-950/40 border-[#F59E0B] text-[#062552] dark:text-white'
                  : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-slate-700 dark:text-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                  isDirigindoCulto
                    ? 'bg-[#E85D04] border-[#E85D04] text-white'
                    : 'bg-white dark:bg-[#081529] border-slate-400'
                }`}
              >
                {isDirigindoCulto && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <Crown className="w-4 h-4 text-[#E85D04] dark:text-[#FBB016] shrink-0" />
                <span>Vou dirigir os avisos hoje</span>
              </div>
            </button>
          )}

          {needsAdminOverride && isDirigindoCulto && (
            <div className="p-3 rounded-2xl bg-[#FFF9EB] dark:bg-amber-950/40 border border-[#F59E0B]/50 space-y-2">
              <label className="block text-xs font-bold text-[#92400E] dark:text-[#FBB016]">
                Senha administrativa para trocar o dirigente
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={adminOverridePin}
                onChange={(e) => setAdminOverridePin(e.target.value)}
                placeholder="Senha administrativa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F59E0B]/60 bg-white dark:bg-[#040B16] text-[#0D213A] dark:text-white text-base font-mono"
              />
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-sm font-bold leading-snug"
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 px-5 rounded-2xl bg-[#03589E] hover:bg-[#062552] active:scale-[0.99] text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 transition-all min-h-[54px]"
          >
            <span>Entrar</span>
            <ArrowRight className="w-5 h-5 shrink-0" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
          Igreja Presbiteriana Renovada de Auriflama
        </p>
      </div>
    </div>
  );
};
