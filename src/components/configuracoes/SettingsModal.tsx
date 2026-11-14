import React, { useState } from 'react';
import {
  X,
  Crown,
  LogOut,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Download,
  Smartphone,
  Check,
  Plus,
  UserCheck,
  SlidersHorizontal,
  Package,
  KeyRound,
  ShieldCheck,
  Users,
  Cpu,
  Eye,
  EyeOff,
  Type,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCulto } from '../../context/CultoContext';
import { useAccessibility, FONT_SCALES } from '../../context/AccessibilityContext';
import { storageService } from '../../services/storageService';
import { getCargoLabel } from '../../utils/formatters';
import type { CargoObreiro } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FONT_LABELS: Record<number, { label: string; desc: string }> = {
  1.0: { label: 'Padrão', desc: '100%' },
  1.25: { label: 'Grande', desc: '125%' },
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    logout,
    obreiros,
    addObreiro,
    updateAdminPin,
    importarObreirosOficiais,
    isAdmin,
    isMaster,
    verifyObreiroPin,
    setObreiroPin,
  } = useAuth();
  const { cultoAtivo, dirigenteAtualNome, definirDirigente } = useCulto();
  const {
    isPulpitMode,
    setIsPulpitMode,
    soundEnabled,
    setSoundEnabled,
    fontScale,
    setFontScale,
    isInstalled,
    canInstall,
    promptInstall,
  } = useAccessibility();

  const [mainTab, setMainTab] = useState<'preferencias' | 'admin'>('preferencias');
  const [adminSection, setAdminSection] = useState<'dirigente' | 'obreiros' | 'seguranca' | 'nuvem'>('dirigente');

  // Troca de dirigente
  const [selectedDirigenteId, setSelectedDirigenteId] = useState(cultoAtivo?.dirigenteId || '');
  const [dirigenteFeedback, setDirigenteFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  // Novo obreiro
  type CargoUnificado = 'pastor' | 'pastor_auxiliar' | 'presbitero' | 'diacono' | 'evangelista' | 'missionario';
  const [showAddObreiro, setShowAddObreiro] = useState(false);
  const [nome, setNome] = useState('');
  const [cargoUnificado, setCargoUnificado] = useState<CargoUnificado>('diacono');
  const [genero, setGenero] = useState<'homem' | 'mulher'>('homem');
  const [isNovoAdmin, setIsNovoAdmin] = useState(false);
  const [obreiroError, setObreiroError] = useState('');
  const [obreiroSuccess, setObreiroSuccess] = useState('');

  // Minha senha pessoal
  const [minhaSenhaAtual, setMinhaSenhaAtual] = useState('');
  const [minhaNovaSenha, setMinhaNovaSenha] = useState('');
  const [minhaConfirmarSenha, setMinhaConfirmarSenha] = useState('');
  const [showMinhasSenhas, setShowMinhasSenhas] = useState(false);
  const [minhaSenhaSuccess, setMinhaSenhaSuccess] = useState('');
  const [minhaSenhaError, setMinhaSenhaError] = useState('');

  // PIN Administrativo
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [pinError, setPinError] = useState('');

  // Firebase
  const [firebaseJson, setFirebaseJson] = useState(() => {
    const cfg = storageService.getFirebaseConfig();
    return cfg ? JSON.stringify(cfg, null, 2) : '';
  });
  const [firebaseSaved, setFirebaseSaved] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');
  const [importMsg, setImportMsg] = useState('');

  if (!isOpen) return null;

  const inputClass =
    'w-full px-4 py-3 text-base rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white focus:bg-white dark:focus:bg-[#040B16] focus:border-[#03589E] focus:outline-none';

  const handleCargoUnificadoChange = (val: CargoUnificado) => {
    setCargoUnificado(val);
    if (val === 'pastor' || val === 'pastor_auxiliar' || val === 'presbitero') {
      setGenero('homem');
    }
  };

  const handleSalvarDirigente = (e: React.FormEvent) => {
    e.preventDefault();
    const target = obreiros.find((o) => o.id === selectedDirigenteId);
    if (!target) return;
    const result = definirDirigente(target, undefined, currentUser || undefined);
    if (result.success) {
      setDirigenteFeedback({ ok: true, msg: `Dirigente alterado para ${target.nome}.` });
      setTimeout(() => setDirigenteFeedback(null), 3000);
    } else {
      setDirigenteFeedback({
        ok: false,
        msg: result.message || 'Não foi possível alterar o dirigente.',
      });
    }
  };

  const handleAddObreiro = (e: React.FormEvent) => {
    e.preventDefault();
    setObreiroError('');
    setObreiroSuccess('');

    if (!nome.trim()) {
      setObreiroError('Informe o nome completo do obreiro.');
      return;
    }

    let finalCargo: CargoObreiro = 'diacono';
    let finalGenero: 'homem' | 'mulher' = genero;

    if (cargoUnificado === 'pastor') {
      finalCargo = 'pastor';
      finalGenero = 'homem';
    } else if (cargoUnificado === 'pastor_auxiliar') {
      finalCargo = 'pastor_auxiliar';
      finalGenero = 'homem';
    } else if (cargoUnificado === 'presbitero') {
      finalCargo = 'presbitero';
      finalGenero = 'homem';
    } else if (cargoUnificado === 'diacono') {
      finalCargo = genero === 'mulher' ? 'diaconisa' : 'diacono';
    } else if (cargoUnificado === 'evangelista') {
      finalCargo = genero === 'mulher' ? 'evangelista_m' : 'evangelista_h';
    } else if (cargoUnificado === 'missionario') {
      finalCargo = genero === 'mulher' ? 'missionaria' : 'missionario';
    }

    const res = addObreiro({
      nome: nome.trim(),
      cargo: finalCargo,
      genero: finalGenero,
      isAdmin: isNovoAdmin,
      ativo: true,
    });

    if (res.success) {
      setObreiroSuccess(`Obreiro ${nome.trim()} cadastrado com sucesso!`);
      setNome('');
      setCargoUnificado('diacono');
      setGenero('homem');
      setIsNovoAdmin(false);
      setTimeout(() => {
        setObreiroSuccess('');
        setShowAddObreiro(false);
      }, 2000);
    } else {
      setObreiroError(res.message || 'Erro ao cadastrar obreiro.');
    }
  };

  const handleAlterarMinhaSenha = (e: React.FormEvent) => {
    e.preventDefault();
    setMinhaSenhaError('');
    setMinhaSenhaSuccess('');

    if (!currentUser) return;

    if (!verifyObreiroPin(currentUser.id, minhaSenhaAtual)) {
      setMinhaSenhaError('A senha atual informada está incorreta.');
      return;
    }

    if (!minhaNovaSenha || !/^\d{4,}$/.test(minhaNovaSenha.trim())) {
      setMinhaSenhaError('A nova senha deve conter apenas números e no mínimo 4 dígitos.');
      return;
    }

    if (minhaNovaSenha.trim() !== minhaConfirmarSenha.trim()) {
      setMinhaSenhaError('A confirmação da nova senha não coincide.');
      return;
    }

    const res = setObreiroPin(currentUser.id, minhaNovaSenha.trim());
    if (res.success) {
      setMinhaSenhaSuccess('Sua senha de acesso foi alterada com sucesso!');
      setMinhaSenhaAtual('');
      setMinhaNovaSenha('');
      setMinhaConfirmarSenha('');
      setTimeout(() => setMinhaSenhaSuccess(''), 3500);
    } else {
      setMinhaSenhaError(res.message || 'Erro ao salvar nova senha.');
    }
  };

  const handleImportarOficiais = () => {
    const res = importarObreirosOficiais();
    setImportMsg(res.message);
    setTimeout(() => setImportMsg(''), 4500);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess('');
    if (!currentPin || !newPin) {
      setPinError('Preencha todos os campos.');
      return;
    }
    if (!/^\d{4,}$/.test(newPin.trim())) {
      setPinError('A nova senha deve conter apenas números e pelo menos 4 dígitos.');
      return;
    }
    if (updateAdminPin(currentPin, newPin)) {
      setPinSuccess('Senha administrativa atualizada com sucesso.');
      setCurrentPin('');
      setNewPin('');
      setTimeout(() => setPinSuccess(''), 3000);
    } else {
      setPinError('Senha atual incorreta.');
    }
  };

  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    setFirebaseError('');
    setFirebaseSaved(false);
    try {
      const parsed = JSON.parse(firebaseJson);
      storageService.saveFirebaseConfig(parsed);
      setFirebaseSaved(true);
      setTimeout(() => setFirebaseSaved(false), 3000);
    } catch {
      setFirebaseError('Formato JSON inválido. Verifique se copiou todas as chaves corretamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#040B16]/75 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#081529] border-2 border-[#D5E2F0] dark:border-[#1C3559] rounded-3xl w-full max-w-xl h-[88vh] max-h-[760px] flex flex-col shadow-2xl overflow-hidden">
        {/* Cabeçalho IPRB */}
        <div className="bg-gradient-to-r from-[#062552] to-[#03589E] px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-xl">
              <SlidersHorizontal className="w-5 h-5 text-[#FBB016]" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg leading-tight">
                Ajustes
              </h2>
              <p className="text-xs text-[#E8F2FC]">
                {isAdmin ? 'Preferências e administração' : 'Fonte, som, tema e senha'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Fechar ajustes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seletor Principal (Admins) */}
        {isAdmin && (
          <div className="p-3 border-b border-[#D5E2F0] dark:border-[#1C3559] bg-[#F4F7FB] dark:bg-[#040B16] shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMainTab('preferencias')}
                className={`py-2.5 px-3 rounded-2xl text-sm font-extrabold border-2 transition-all min-h-[46px] ${
                  mainTab === 'preferencias'
                    ? 'bg-[#03589E] border-[#03589E] text-white shadow-sm'
                    : 'bg-white dark:bg-[#081529] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-300'
                }`}
              >
                Preferências
              </button>
              <button
                type="button"
                onClick={() => setMainTab('admin')}
                className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all flex items-center justify-center gap-1.5 min-h-[46px] ${
                  mainTab === 'admin'
                    ? 'bg-[#E85D04] border-[#E85D04] text-white shadow-sm'
                    : 'bg-white dark:bg-[#081529] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Administração</span>
              </button>
            </div>
          </div>
        )}

        {/* Corpo com Rolagem */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {mainTab === 'preferencias' ? (
            <>
              {/* Identificação do Obreiro */}
              {currentUser && (
                <div className="p-4 rounded-2xl bg-[#F4F7FB] dark:bg-[#040B16] border-2 border-[#D5E2F0] dark:border-[#1C3559] flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Conectado como
                    </p>
                    <p className="text-base font-extrabold text-[#062552] dark:text-white truncate">
                      {currentUser.nome}
                    </p>
                    <p className="text-xs font-bold text-[#03589E] dark:text-[#60A5FA]">
                      {getCargoLabel(currentUser.cargo)}
                      {isAdmin && currentUser.cargo !== 'admin' ? ' • Administrador' : ''}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      logout();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs font-extrabold flex items-center gap-1.5 hover:bg-rose-100 min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              )}

              {/* Tamanho da Letra Global (Padrão 100% e Grande 125%) */}
              <section className="space-y-3 bg-[#F4F7FB] dark:bg-[#040B16] p-4 rounded-2xl border border-[#D5E2F0] dark:border-[#1C3559]">
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-[#03589E] dark:text-[#60A5FA] shrink-0" />
                  <h3 className="text-sm font-extrabold text-[#062552] dark:text-white">
                    Tamanho da Letra
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {FONT_SCALES.map((scale) => {
                    const info = FONT_LABELS[scale] || { label: `${Math.round(scale * 100)}%`, desc: '' };
                    const selected = Math.abs(fontScale - scale) < 0.05;
                    return (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => setFontScale(scale)}
                        className={`py-3.5 px-3 rounded-2xl border-2 text-center transition-all min-h-[64px] flex flex-col items-center justify-center gap-0.5 ${
                          selected
                            ? 'bg-[#03589E] border-[#03589E] text-white shadow-sm'
                            : 'bg-white dark:bg-[#081529] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-200'
                        }`}
                      >
                        <span className="text-sm font-extrabold leading-tight">{info.label}</span>
                        <span className="text-xs opacity-85 font-bold">{info.desc}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#081529] border border-[#D5E2F0] dark:border-[#1C3559]">
                  <p className="text-sm font-bold text-[#062552] dark:text-white leading-snug">
                    Exemplo: Irmã Maria — veio de Campinas.
                  </p>
                </div>
              </section>

              {/* Aparência e Sons */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsPulpitMode(!isPulpitMode)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 min-h-[64px] ${
                    isPulpitMode
                      ? 'bg-[#040B16] border-[#FBB016] text-white'
                      : 'bg-white dark:bg-[#081529] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isPulpitMode ? (
                      <Moon className="w-5 h-5 text-[#FBB016] shrink-0" />
                    ) : (
                      <Sun className="w-5 h-5 text-[#E85D04] shrink-0" />
                    )}
                    <div>
                      <p className="font-extrabold text-sm">Tema</p>
                      <p className="text-xs opacity-75">
                        {isPulpitMode ? 'Escuro' : 'Claro'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#E8F2FC] dark:bg-[#1C3559] text-[#03589E] dark:text-white">
                    Trocar
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 min-h-[64px] ${
                    soundEnabled
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
                      : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <p className="font-extrabold text-sm">Sons de Aviso</p>
                      <p className="text-xs opacity-75">{soundEnabled ? 'Ativado' : 'Mudo'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-white dark:bg-[#081529] border border-current/20">
                    {soundEnabled ? 'Ligado' : 'Desligado'}
                  </span>
                </button>
              </section>

              {/* Instalar App (PWA) */}
              {!isInstalled && canInstall && (
                <button
                  type="button"
                  onClick={promptInstall}
                  className="w-full p-4 rounded-2xl bg-[#E8F2FC] dark:bg-[#0D1E38] border-2 border-[#03589E]/40 text-[#062552] dark:text-white flex items-center justify-between gap-3 min-h-[60px]"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Smartphone className="w-6 h-6 text-[#03589E] dark:text-[#60A5FA]" />
                    <div>
                      <p className="font-extrabold text-sm">Instalar na Tela Inicial</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Acesso rápido como aplicativo nativo
                      </p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-[#03589E] dark:text-[#60A5FA]" />
                </button>
              )}

              {/* Alterar Minha Própria Senha */}
              {currentUser && (
                <form
                  onSubmit={handleAlterarMinhaSenha}
                  className="p-4 rounded-2xl bg-[#F4F7FB] dark:bg-[#040B16] border-2 border-[#D5E2F0] dark:border-[#1C3559] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-[#E85D04] dark:text-[#FBB016]" />
                      <h3 className="text-sm font-extrabold text-[#062552] dark:text-white">
                        Alterar Minha Senha
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMinhasSenhas((prev) => !prev)}
                      className="text-xs font-bold text-[#03589E] dark:text-[#60A5FA] flex items-center gap-1 px-2 py-1"
                    >
                      {showMinhasSenhas ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showMinhasSenhas ? 'Ocultar' : 'Mostrar'}</span>
                    </button>
                  </div>

                  {minhaSenhaError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs font-bold">
                      {minhaSenhaError}
                    </div>
                  )}
                  {minhaSenhaSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                      {minhaSenhaSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type={showMinhasSenhas ? 'text' : 'password'}
                      inputMode="numeric"
                      value={minhaSenhaAtual}
                      onChange={(e) => setMinhaSenhaAtual(e.target.value)}
                      placeholder="Senha atual"
                      className={inputClass}
                    />
                    <input
                      type={showMinhasSenhas ? 'text' : 'password'}
                      inputMode="numeric"
                      value={minhaNovaSenha}
                      onChange={(e) => setMinhaNovaSenha(e.target.value)}
                      placeholder="Nova senha (4+ núm.)"
                      className={inputClass}
                    />
                    <input
                      type={showMinhasSenhas ? 'text' : 'password'}
                      inputMode="numeric"
                      value={minhaConfirmarSenha}
                      onChange={(e) => setMinhaConfirmarSenha(e.target.value)}
                      placeholder="Confirmar nova"
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#03589E] hover:bg-[#062552] text-white font-extrabold text-sm min-h-[46px]"
                  >
                    Salvar Minha Nova Senha
                  </button>
                </form>
              )}
            </>
          ) : (
            /* ÁREA ADMINISTRATIVA */
            <div className="space-y-5">
              {/* Submenu Admin */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'dirigente', label: 'Dirigente', icon: Crown },
                  { id: 'obreiros', label: 'Obreiros', icon: Users },
                  { id: 'seguranca', label: 'Senha Admin', icon: KeyRound },
                  { id: 'nuvem', label: 'Conexão', icon: Cpu },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = adminSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAdminSection(item.id as typeof adminSection)}
                      className={`py-2.5 px-3 rounded-2xl border-2 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all min-h-[44px] ${
                        active
                          ? 'bg-[#062552] border-[#062552] text-white dark:bg-[#FBB016] dark:border-[#FBB016] dark:text-[#040B16]'
                          : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {adminSection === 'dirigente' && (
                <form
                  onSubmit={handleSalvarDirigente}
                  className="space-y-4 bg-[#F4F7FB] dark:bg-[#040B16] p-4 rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559]"
                >
                  <div>
                    <h3 className="font-extrabold text-base text-[#062552] dark:text-white">
                      Definir Dirigente do Culto
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Atual: <strong>{dirigenteAtualNome}</strong>
                    </p>
                  </div>

                  {!cultoAtivo ? (
                    <p className="text-sm font-semibold text-[#9A3412] dark:text-[#FCD34D]">
                      Inicie um culto primeiro para trocar o dirigente em exercício.
                    </p>
                  ) : (
                    <>
                      <select
                        value={selectedDirigenteId}
                        onChange={(e) => setSelectedDirigenteId(e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Selecione um obreiro...</option>
                        {obreiros
                          .filter((o) => o.ativo !== false)
                          .map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.nome} — {getCargoLabel(o.cargo)}
                            </option>
                          ))}
                      </select>

                      {dirigenteFeedback && (
                        <div
                          className={`p-3 rounded-xl text-xs font-bold ${
                            dirigenteFeedback.ok
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-300'
                          }`}
                        >
                          {dirigenteFeedback.msg}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-2xl bg-[#03589E] hover:bg-[#062552] text-white font-extrabold text-sm flex items-center justify-center gap-2 min-h-[48px]"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Atualizar Dirigente</span>
                      </button>
                    </>
                  )}
                </form>
              )}

              {adminSection === 'obreiros' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddObreiro((p) => !p)}
                      className="flex-1 py-3 px-4 rounded-2xl bg-[#03589E] hover:bg-[#062552] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 min-h-[46px]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showAddObreiro ? 'Fechar Cadastro' : 'Novo Obreiro'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleImportarOficiais}
                      className="flex-1 py-3 px-4 rounded-2xl bg-[#F4F7FB] dark:bg-[#040B16] border-2 border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 min-h-[46px]"
                    >
                      <Package className="w-4 h-4 text-[#03589E] shrink-0" />
                      <span>Importar Lista</span>
                    </button>
                  </div>

                  {importMsg && (
                    <div className="p-3 rounded-xl bg-[#E8F2FC] dark:bg-[#0D1E38] border border-[#03589E]/40 text-xs font-bold text-[#062552] dark:text-slate-100">
                      {importMsg}
                    </div>
                  )}

                  {showAddObreiro && (
                    <form
                      onSubmit={handleAddObreiro}
                      className="p-4 rounded-2xl bg-[#F4F7FB] dark:bg-[#040B16] border-2 border-[#D5E2F0] dark:border-[#1C3559] space-y-3"
                    >
                      {obreiroError && (
                        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs font-bold">
                          {obreiroError}
                        </div>
                      )}
                      {obreiroSuccess && (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                          {obreiroSuccess}
                        </div>
                      )}

                      <input
                        type="text"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome completo do obreiro"
                        className={inputClass}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <select
                          value={cargoUnificado}
                          onChange={(e) => handleCargoUnificadoChange(e.target.value as CargoUnificado)}
                          className={inputClass}
                        >
                          <option value="diacono">Diácono / Diaconisa</option>
                          <option value="presbitero">Presbítero</option>
                          <option value="pastor_auxiliar">Pastor Auxiliar</option>
                          <option value="pastor">Pastor</option>
                          <option value="evangelista">Evangelista</option>
                          <option value="missionario">Missionário / Missionária</option>
                        </select>

                        {(cargoUnificado === 'diacono' ||
                          cargoUnificado === 'evangelista' ||
                          cargoUnificado === 'missionario') && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setGenero('homem')}
                              className={`rounded-xl border-2 font-bold text-xs min-h-[46px] ${
                                genero === 'homem'
                                  ? 'bg-[#03589E] border-[#03589E] text-white'
                                  : 'bg-white dark:bg-[#081529] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-300'
                              }`}
                            >
                              Irmão
                            </button>
                            <button
                              type="button"
                              onClick={() => setGenero('mulher')}
                              className={`rounded-xl border-2 font-bold text-xs min-h-[46px] ${
                                genero === 'mulher'
                                  ? 'bg-[#03589E] border-[#03589E] text-white'
                                  : 'bg-white dark:bg-[#081529] border-[#D5E2F0] dark:border-[#1C3559] text-[#062552] dark:text-slate-300'
                              }`}
                            >
                              Irmã
                            </button>
                          </div>
                        )}
                      </div>

                      <label className="flex items-center gap-2.5 p-2 text-xs font-bold text-[#062552] dark:text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isNovoAdmin}
                          onChange={(e) => setIsNovoAdmin(e.target.checked)}
                          className="w-5 h-5 accent-[#03589E]"
                        />
                        <span>Permitir acesso administrativo</span>
                      </label>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm min-h-[46px]"
                      >
                        Cadastrar Obreiro
                      </button>
                    </form>
                  )}

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {obreiros.map((o) => (
                      <div
                        key={o.id}
                        className="p-3 rounded-2xl bg-[#F4F7FB] dark:bg-[#040B16] border border-[#D5E2F0] dark:border-[#1C3559] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#062552] dark:text-white truncate">
                            {o.nome}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {getCargoLabel(o.cargo)}
                          </p>
                        </div>
                        {o.isAdmin && (
                          <span className="px-2 py-0.5 rounded-lg bg-[#FFF4E5] dark:bg-[#F59E0B]/20 text-[#9A3412] dark:text-[#FCD34D] text-xs font-extrabold shrink-0">
                            Administrador
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminSection === 'seguranca' && (
                <form
                  onSubmit={handleUpdatePin}
                  className="space-y-3 bg-[#F4F7FB] dark:bg-[#040B16] p-4 rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559]"
                >
                  <h3 className="font-extrabold text-base text-[#062552] dark:text-white">
                    Alterar Senha Administrativa
                  </h3>
                  {!isMaster && (
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Permite trocar o dirigente do culto no púlpito.
                    </p>
                  )}

                  {pinError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs font-bold">
                      {pinError}
                    </div>
                  )}
                  {pinSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                      {pinSuccess}
                    </div>
                  )}

                  <input
                    type="password"
                    inputMode="numeric"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    placeholder="Senha administrativa atual"
                    className={inputClass}
                  />
                  <input
                    type="password"
                    inputMode="numeric"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Nova senha (mínimo 4 números)"
                    className={inputClass}
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#03589E] hover:bg-[#062552] text-white font-extrabold text-sm min-h-[48px]"
                  >
                    Atualizar Senha
                  </button>
                </form>
              )}

              {adminSection === 'nuvem' && (
                <form
                  onSubmit={handleSaveFirebase}
                  className="space-y-3 bg-[#F4F7FB] dark:bg-[#040B16] p-4 rounded-2xl border-2 border-[#D5E2F0] dark:border-[#1C3559]"
                >
                  <h3 className="font-extrabold text-base text-[#062552] dark:text-white">
                    Sincronização Online
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Cole abaixo os dados de conexão do servidor da igreja.
                  </p>

                  {firebaseError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{firebaseError}</span>
                    </div>
                  )}

                  {firebaseSaved && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Conexão salva.</span>
                    </div>
                  )}

                  <textarea
                    value={firebaseJson}
                    onChange={(e) => setFirebaseJson(e.target.value)}
                    rows={6}
                    placeholder="Dados de conexão"
                    className={`${inputClass} font-mono text-xs`}
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#03589E] hover:bg-[#062552] text-white font-extrabold text-sm min-h-[48px]"
                  >
                    Salvar Conexão
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
