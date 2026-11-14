import React, { useState, useEffect, useRef } from 'react';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CultoProvider } from './context/CultoContext';
import { AvisosProvider, useAvisos } from './context/AvisosContext';
import { Header } from './components/common/Header';
import { BottomNav, type AppTabType } from './components/common/BottomNav';
import { LoginScreen } from './components/auth/LoginScreen';
import { IniciarCultoModal } from './components/culto/IniciarCultoModal';
import { DiaconoDashboard } from './components/diacono/DiaconoDashboard';
import { PulpitoScreen } from './components/pulpito/PulpitoScreen';
import { HistoricoScreen } from './components/historico/HistoricoScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { SettingsModal } from './components/configuracoes/SettingsModal';
import type { TipoAviso } from './types';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { isPulpitMode, modoFocadoPulpito, setModoFocadoPulpito } = useAccessibility();
  const { totalPendentes } = useAvisos();
  const [currentTab, setCurrentTab] = useState<AppTabType>('home');
  const [diaconoCategory, setDiaconoCategory] = useState<TipoAviso>('visitante');
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentTab, diaconoCategory]);
  const [isIniciarCultoModalOpen, setIsIniciarCultoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const isImersivo = currentTab === 'pulpito' && modoFocadoPulpito;

  // Fecha o modo focado com a tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImersivo) {
        setModoFocadoPulpito(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImersivo, setModoFocadoPulpito]);

  // Se o usuário trocar de aba, encerra o modo focado do púlpito
  useEffect(() => {
    if (currentTab !== 'pulpito' && modoFocadoPulpito) {
      setModoFocadoPulpito(false);
    }
  }, [currentTab, modoFocadoPulpito, setModoFocadoPulpito]);

  const handleNavigate = (tab: AppTabType, category?: TipoAviso) => {
    if (category) {
      setDiaconoCategory(category);
    }
    setCurrentTab(tab);
  };

  // Se o usuário não estiver logado, exibe tela de seleção de obreiro / login
  if (!currentUser) {
    return (
      <LoginScreen
        onSuccess={(isDirig, obreiro) => {
          if (isDirig) {
            setCurrentTab('pulpito');
          } else if (obreiro?.cargo === 'diacono' || obreiro?.cargo === 'diaconisa') {
            setCurrentTab('diacono');
          } else {
            setCurrentTab('home');
          }
        }}
      />
    );
  }

  return (
    <div
      className={`h-full w-full flex flex-col overflow-hidden transition-colors duration-200 ${
        isPulpitMode
          ? 'bg-[#040B16] text-white'
          : 'bg-[#F4F7FB] dark:bg-[#040B16] text-[#0D213A] dark:text-white'
      }`}
    >
      {/* Cabeçalho Institucional IPRB (oculto no modo tela cheia do púlpito) */}
      {!isImersivo && (
        <Header
          onNavigateHome={() => setCurrentTab('home')}
          onOpenIniciarCultoModal={() => setIsIniciarCultoModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        />
      )}

      {/* Conteúdo Principal com rolagem isolada e previsível (sem troca acidental por swipe) */}
      <main
        ref={mainRef}
        className={`flex-1 w-full overflow-y-auto overscroll-y-contain no-scrollbar ${isImersivo ? 'pb-6' : 'pb-24'}`}
      >
        <div className="max-w-2xl mx-auto px-3.5 pt-3.5">
          {currentTab === 'home' && (
            <HomeScreen
              onNavigate={handleNavigate}
              onOpenIniciarCulto={() => setIsIniciarCultoModalOpen(true)}
            />
          )}

          {currentTab === 'diacono' && (
            <DiaconoDashboard
              activeCategory={diaconoCategory}
              onChangeCategory={setDiaconoCategory}
            />
          )}

          {currentTab === 'pulpito' && <PulpitoScreen />}

          {currentTab === 'historico' && <HistoricoScreen />}
        </div>
      </main>

      {/* Navegação Inferior Acessível (oculta no modo tela cheia do púlpito) */}
      {!isImersivo && (
        <BottomNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          totalPendentes={totalPendentes}
          isPulpitMode={isPulpitMode}
        />
      )}

      {/* Modal de Configurações e Acessibilidade */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Modal de Iniciar Novo Culto */}
      <IniciarCultoModal
        isOpen={isIniciarCultoModalOpen}
        onClose={() => setIsIniciarCultoModalOpen(false)}
        onSuccess={() => setCurrentTab('home')}
      />
    </div>
  );
};

export function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <CultoProvider>
          <AvisosProvider>
            <AppContent />
          </AvisosProvider>
        </CultoProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
