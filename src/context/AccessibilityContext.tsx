import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../services/storageService';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface AccessibilityContextType {
  fontScale: number; // 1.0 = Padrão Compacto (100%), 1.15 = Padrão Ampliado (115%), 1.25 = Grande (125%), 1.38 = Extra Grande (138%), 1.5 = Máximo (150%)
  setFontScale: (scale: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  isPulpitMode: boolean;
  setIsPulpitMode: (val: boolean) => void;
  modoFocadoPulpito: boolean;
  setModoFocadoPulpito: (val: boolean) => void;
  toggleModoFocadoPulpito: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  isInstalled: boolean;
  canInstall: boolean;
  promptInstall: () => Promise<boolean>;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const FONT_SCALES = [1.0, 1.25];
const DEFAULT_FONT_SCALE = 1.0;

function normalizeFontScale(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_FONT_SCALE;
  return value >= 1.13 ? 1.25 : 1.0;
}

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontScale, setFontScaleState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FONT_SCALE);
      if (saved) {
        return normalizeFontScale(parseFloat(saved));
      }
    } catch {
      // ignore
    }
    return DEFAULT_FONT_SCALE;
  });

  const [isPulpitMode, setIsPulpitModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
    } catch {
      return false;
    }
  });

  const [modoFocadoPulpito, setModoFocadoPulpito] = useState<boolean>(false);

  const toggleModoFocadoPulpito = useCallback(() => {
    setModoFocadoPulpito((prev) => !prev);
  }, []);

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches;
    }
    return false;
  });

  // Capturar evento global beforeinstallprompt no carregamento inicial da aplicação
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const matchMediaHandler = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', matchMediaHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mediaQuery.removeEventListener('change', matchMediaHandler);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      setDeferredPrompt(null);
      return false;
    }
    return false;
  }, [deferredPrompt]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
    try {
      localStorage.setItem(STORAGE_KEYS.FONT_SCALE, fontScale.toString());
    } catch {
      // ignore
    }
  }, [fontScale]);

  useEffect(() => {
    if (isPulpitMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isPulpitMode));
    } catch {
      // ignore
    }
  }, [isPulpitMode]);

  const setIsPulpitMode = useCallback((val: boolean) => {
    setIsPulpitModeState(val);
  }, []);

  const setSoundEnabled = useCallback((val: boolean) => {
    setSoundEnabledState(val);
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(val));
    } catch {
      // ignore
    }
  }, []);

  const increaseFontSize = () => {
    const currentIndex = FONT_SCALES.findIndex((s) => s >= fontScale);
    if (currentIndex === -1) {
      setFontScaleState(FONT_SCALES[FONT_SCALES.length - 1]);
    } else if (currentIndex < FONT_SCALES.length - 1) {
      setFontScaleState(FONT_SCALES[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = FONT_SCALES.findIndex((s) => s >= fontScale);
    if (currentIndex > 0) {
      setFontScaleState(FONT_SCALES[currentIndex - 1]);
    } else if (currentIndex === -1) {
      setFontScaleState(FONT_SCALES[FONT_SCALES.length - 2]);
    }
  };

  const resetFontSize = () => {
    setFontScaleState(DEFAULT_FONT_SCALE);
  };

  const setFontScale = (scale: number) => {
    setFontScaleState(normalizeFontScale(scale));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontScale,
        setFontScale,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        isPulpitMode,
        setIsPulpitMode,
        modoFocadoPulpito,
        setModoFocadoPulpito,
        toggleModoFocadoPulpito,
        soundEnabled,
        setSoundEnabled,
        isInstalled,
        canInstall: !!deferredPrompt,
        promptInstall,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de um AccessibilityProvider');
  }
  return context;
};
