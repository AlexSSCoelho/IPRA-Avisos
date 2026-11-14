import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Obreiro, CargoObreiro } from '../types';
import { storageService, STORAGE_KEYS } from '../services/storageService';

interface AuthContextType {
  currentUser: Obreiro | null;
  savedLoginUser: Obreiro | null;
  obreiros: Obreiro[];
  /** App em modo de primeira configuração (sem nenhum obreiro cadastrado) */
  isBootstrap: boolean;
  /** PIN administrativo foi configurado pelo admin */
  hasPinConfigured: boolean;
  login: (obreiro: Obreiro, rememberDevice?: boolean) => void;
  clearSavedLogin: () => void;
  logout: () => void;
  verifyAdminPin: (pin: string) => boolean;
  verifyObreiroPin: (obreiroId: string, pin: string) => boolean;
  setObreiroPin: (obreiroId: string, newPin: string) => { success: boolean; message?: string };
  /** Apenas o Master tem permissão para cadastrar novos obreiros */
  addObreiro: (obreiro: Omit<Obreiro, 'id'>) => { success: boolean; message?: string };
  /** Operação dedicada e atômica para primeira configuração do sistema */
  bootstrapInitialAdmin: (
    adminData: { nome: string; cargo: CargoObreiro; genero: 'homem' | 'mulher' },
    pin: string
  ) => { success: boolean; message?: string };
  /** Permite configurar o primeiro PIN em instalações existentes com admin mas sem PIN */
  configureMigrationPin: (pin: string) => { success: boolean; message?: string };
  updateAdminPin: (oldPin: string, newPin: string) => boolean;
  importarObreirosOficiais: () => { success: boolean; message: string; count?: number };
  isAdmin: boolean;
  isMaster: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [obreiros, setObreiros] = useState<Obreiro[]>(() => storageService.getObreiros());
  const [hasPinConfigured, setHasPinConfigured] = useState<boolean>(() => storageService.hasPinConfigured());
  // Abertura do app inicia na tela de login conforme solicitado
  const [currentUser, setCurrentUser] = useState<Obreiro | null>(() => {
    try {
      const sessionUser = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (sessionUser) {
        return JSON.parse(sessionUser);
      }
      const explicitLogout = sessionStorage.getItem('ipra_explicit_logout_v2');
      if (!explicitLogout) {
        const savedUser = localStorage.getItem(STORAGE_KEYS.SAVED_LOGIN_USER);
        if (savedUser) {
          const parsed: Obreiro = JSON.parse(savedUser);
          sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, savedUser);
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [savedLoginUser, setSavedLoginUser] = useState<Obreiro | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.SAVED_LOGIN_USER);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const unsubscribe = storageService.subscribeToObreiros((updatedList) => {
      setObreiros(updatedList);
      setCurrentUser((prevUser) => {
        if (!prevUser) return null;
        const matching = updatedList.find((o) => o.id === prevUser.id);
        if (
          matching &&
          (matching.isAdmin !== prevUser.isAdmin ||
            matching.nome !== prevUser.nome ||
            matching.cargo !== prevUser.cargo ||
            matching.ativo !== prevUser.ativo)
        ) {
          try {
            sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(matching));
          } catch {
            // ignore
          }
          return matching;
        }
        return prevUser;
      });
    });
    return () => unsubscribe();
  }, []);

  // Migração pontual: se o obreiro tem cargo 'pastor' ou 'admin' mas
  // isAdmin está ausente (undefined), garantir que seja preservado como admin.
  // Registros com isAdmin: false explícito NÃO são alterados.
  useEffect(() => {
    if (obreiros.length === 0) return;
    let currentList = obreiros;
    const needsMigration = obreiros.some(
      (o) => o.isAdmin === undefined && (o.cargo === 'pastor' || o.cargo === 'admin')
    );
    if (needsMigration) {
      const migrated = obreiros.map((o) =>
        o.isAdmin === undefined && (o.cargo === 'pastor' || o.cargo === 'admin')
          ? { ...o, isAdmin: true }
          : o
      );
      storageService.saveObreiros(migrated);
      setObreiros(migrated);
      currentList = migrated;
    }

    // Sincronizar currentUser com o registro persistido/migrado correspondente
    if (currentUser) {
      const persistedUser = currentList.find((o) => o.id === currentUser.id);
      if (
        persistedUser &&
        (persistedUser.isAdmin !== currentUser.isAdmin ||
          persistedUser.nome !== currentUser.nome ||
          persistedUser.cargo !== currentUser.cargo ||
          persistedUser.ativo !== currentUser.ativo)
      ) {
        setCurrentUser(persistedUser);
        try {
          sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(persistedUser));
        } catch {
          // ignore
        }
      }
    }
  // Executa apenas uma vez após o carregamento inicial
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isBootstrap = obreiros.length === 0;

  // Usuário Master tem permissão exclusiva de adicionar novos membros à equipe
  const isMaster = Boolean(
    currentUser?.isMaster === true ||
    currentUser?.id === 'obreiro_master_alex_coelho' ||
    (currentUser?.nome?.toLowerCase().includes('alex') && currentUser?.isAdmin)
  );

  const login = (obreiro: Obreiro, rememberDevice = false): void => {
    setCurrentUser(obreiro);
    try {
      sessionStorage.removeItem('ipra_explicit_logout_v2');
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(obreiro));
      if (rememberDevice) {
        localStorage.setItem(STORAGE_KEYS.SAVED_LOGIN_USER, JSON.stringify(obreiro));
        setSavedLoginUser(obreiro);
      } else {
        localStorage.removeItem(STORAGE_KEYS.SAVED_LOGIN_USER);
        setSavedLoginUser(null);
      }
    } catch {
      // ignore
    }
  };

  const clearSavedLogin = () => {
    setSavedLoginUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.SAVED_LOGIN_USER);
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      sessionStorage.setItem('ipra_explicit_logout_v2', '1');
    } catch {
      // ignore
    }
  };

  const verifyObreiroPin = (obreiroId: string, pin: string): boolean => {
    return storageService.verifyObreiroPin(obreiroId, pin);
  };

  const setObreiroPin = (obreiroId: string, newPin: string): { success: boolean; message?: string } => {
    if (!newPin || !/^\d{4,}$/.test(newPin.trim())) {
      return { success: false, message: 'O PIN deve conter apenas números (mínimo 4 dígitos).' };
    }
    storageService.setObreiroPin(obreiroId, newPin.trim());
    return { success: true };
  };

  const verifyAdminPin = (pin: string): boolean => {
    const stored = storageService.getAdminPin();
    if (!stored) return false;
    return pin.trim() === stored;
  };

  const updateAdminPin = (oldPin: string, newPin: string): boolean => {
    if (!verifyAdminPin(oldPin)) return false;
    if (!newPin || !/^\d{4,}$/.test(newPin.trim())) return false;
    storageService.setAdminPin(newPin.trim());
    return true;
  };

  const bootstrapInitialAdmin = (
    adminData: { nome: string; cargo: CargoObreiro; genero: 'homem' | 'mulher' },
    pin: string
  ): { success: boolean; message?: string } => {
    const existingObreiros = storageService.getObreiros();
    if (existingObreiros.length > 0 || storageService.hasPinConfigured()) {
      return {
        success: false,
        message: 'O bootstrap inicial só pode ser executado em uma instalação nova.',
      };
    }
    if (!adminData.nome || adminData.nome.trim().length === 0) {
      return { success: false, message: 'O nome do administrador é obrigatório.' };
    }
    if (!pin || !/^\d{4,}$/.test(pin.trim())) {
      return {
        success: false,
        message: 'O PIN administrativo deve conter apenas números e pelo menos 4 dígitos.',
      };
    }

    const initialAdmin: Obreiro = {
      id: `obreiro_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      nome: adminData.nome.trim(),
      cargo: adminData.cargo,
      genero: adminData.genero,
      isAdmin: true,
      isMaster: true,
      ativo: true,
    };

    storageService.setAdminPin(pin.trim());
    storageService.saveObreiros([initialAdmin]);
    setObreiros([initialAdmin]);
    setHasPinConfigured(true);
    login(initialAdmin);
    return { success: true };
  };

  const configureMigrationPin = (
    pin: string
  ): { success: boolean; message?: string } => {
    if (!currentUser?.isAdmin) {
      return {
        success: false,
        message: 'Apenas administradores podem configurar o PIN administrativo.',
      };
    }
    if (!pin || !/^\d{4,}$/.test(pin.trim())) {
      return {
        success: false,
        message: 'O PIN administrativo deve conter apenas números e pelo menos 4 dígitos.',
      };
    }

    storageService.setAdminPin(pin.trim());
    setHasPinConfigured(true);
    return { success: true };
  };

  const addObreiro = (
    obreiroData: Omit<Obreiro, 'id'>
  ): { success: boolean; message?: string } => {
    // Apenas o Master tem poder de cadastrar novos obreiros na equipe
    if (!isMaster) {
      return { success: false, message: 'Apenas o administrador principal pode cadastrar obreiros.' };
    }
    const newId = `obreiro_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newObreiro: Obreiro = {
      ...obreiroData,
      id: newId,
    };
    storageService.addObreiro(newObreiro);
    storageService.setObreiroPin(newId, '1234');
    return { success: true };
  };

  const importarObreirosOficiais = (): { success: boolean; message: string; count?: number } => {
    if (!isMaster) {
      return {
        success: false,
        message: 'Apenas o administrador principal pode importar a lista de obreiros.',
      };
    }
    const res = storageService.importarObreirosOficiais();
    const updated = storageService.getObreiros();
    setObreiros(updated);
    return {
      success: true,
      message: res.added > 0 
        ? `${res.added} obreiros oficiais importados com sucesso! Total na equipe: ${res.total}.`
        : `Todos os obreiros oficiais já constam cadastrados. Total: ${res.total}.`,
      count: res.added,
    };
  };

  // isAdmin baseado APENAS na propriedade explícita — cargo não concede admin
  const isAdmin = currentUser?.isAdmin === true;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        savedLoginUser,
        obreiros,
        isBootstrap,
        hasPinConfigured,
        login,
        clearSavedLogin,
        logout,
        verifyAdminPin,
        verifyObreiroPin,
        setObreiroPin,
        addObreiro,
        bootstrapInitialAdmin,
        configureMigrationPin,
        updateAdminPin,
        importarObreirosOficiais,
        isAdmin,
        isMaster,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

