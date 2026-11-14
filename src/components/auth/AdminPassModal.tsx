import React, { useState } from 'react';
import { ShieldCheck, X, Crown, UserCheck, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCulto } from '../../context/CultoContext';
import { getCargoLabel } from '../../utils/formatters';

interface AdminPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType?: 'trocar_dirigente' | 'admin_geral';
}

export const AdminPassModal: React.FC<AdminPassModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <AdminPassModalContent onClose={onClose} />;
};

const AdminPassModalContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { obreiros, verifyAdminPin, isAdmin, currentUser } = useAuth();
  const { cultoAtivo, definirDirigente } = useCulto();

  const [pin, setPin] = useState('');
  const [selectedObreiroId, setSelectedObreiroId] = useState(cultoAtivo?.dirigenteId || '');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const targetObreiro = obreiros.find((o) => o.id === selectedObreiroId);
    if (!targetObreiro) {
      setError('Selecione um obreiro válido na lista.');
      return;
    }

    if (!isAdmin && !verifyAdminPin(pin)) {
      setError('Senha administrativa incorreta.');
      return;
    }

    const res = definirDirigente(targetObreiro, pin, currentUser || undefined);
    if (res.success) {
      setSuccessMsg(`Direção passada para ${targetObreiro.nome}.`);
      setPin('');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1100);
    } else {
      setError(res.message || 'Erro ao alterar o dirigente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040B16]/75 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#081529] border-2 border-[#D5E2F0] dark:border-[#1C3559] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header IPRB */}
        <div className="bg-gradient-to-r from-[#062552] to-[#03589E] px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-xl">
              <Crown className="w-5 h-5 text-[#FBB016]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                Passar Direção do Culto
              </h3>
              <p className="text-xs text-[#E8F2FC]">Escolha quem conduz os avisos no púlpito</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-sm font-bold">
              <UserCheck className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-extrabold text-[#062552] dark:text-white mb-2">
              Selecione o novo Dirigente:
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {obreiros
                .filter((o) => o.ativo !== false)
                .map((o) => {
                  const isCurrentDir = cultoAtivo?.dirigenteId === o.id;
                  const isSelected = selectedObreiroId === o.id;

                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setSelectedObreiroId(o.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition-all min-h-[52px] ${
                        isSelected
                          ? 'bg-[#E8F2FC] dark:bg-[#0D1E38] border-[#03589E] dark:border-[#60A5FA] text-[#062552] dark:text-white shadow-sm'
                          : 'bg-[#F4F7FB] dark:bg-[#040B16] border-[#D5E2F0] dark:border-[#1C3559] text-[#0D213A] dark:text-slate-200 hover:border-[#03589E]'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-extrabold text-sm truncate">{o.nome}</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {getCargoLabel(o.cargo)}
                        </p>
                      </div>
                      {isCurrentDir && (
                        <span className="px-2.5 py-1 rounded-lg bg-[#FFF4E5] dark:bg-[#F59E0B]/20 text-[#9A3412] dark:text-[#FCD34D] text-xs font-extrabold shrink-0">
                          Atual
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          {!isAdmin && (
            <div className="bg-[#F4F7FB] dark:bg-[#040B16] p-4 rounded-2xl border border-[#D5E2F0] dark:border-[#1C3559] space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-extrabold text-[#062552] dark:text-white">
                <KeyRound className="w-4 h-4 text-[#E85D04] dark:text-[#FBB016]" />
                <span>Senha Administrativa (PIN)</span>
              </label>
              <input
                type="password"
                inputMode="numeric"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Digite a senha do administrador"
                className="w-full px-4 py-3 text-base rounded-xl border-2 border-[#D5E2F0] dark:border-[#1C3559] bg-white dark:bg-[#081529] text-[#0D213A] dark:text-white focus:border-[#03589E] focus:outline-none"
              />
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Você está conectado como Administrador. Não é necessário digitar PIN.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 px-5 bg-[#03589E] hover:bg-[#062552] text-white font-extrabold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[52px]"
          >
            <Crown className="w-5 h-5 text-[#FBB016]" />
            <span>Confirmar Novo Dirigente</span>
          </button>
        </form>
      </div>
    </div>
  );
};
