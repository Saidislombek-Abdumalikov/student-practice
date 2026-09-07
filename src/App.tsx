import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { IncomingDuelModal } from './components/play/IncomingDuelModal';
import { ActiveDuelMatch } from './services/peerDuelService';
import { HomeScreen } from './components/home/HomeScreen';
import { LearnScreen } from './components/learn/LearnScreen';
import { FlashcardViewer } from './components/learn/FlashcardViewer';
import { VocabularyPractice } from './components/learn/VocabularyPractice';
import { VocabularyExamScreen } from './components/learn/VocabularyExamScreen';
import { MistakesReview } from './components/learn/MistakesReview';
import { PlayScreen } from './components/play/PlayScreen';
import { CompeteScreen } from './components/compete/CompeteScreen';
import { ShopScreen } from './components/shop/ShopScreen';
import { MysteryBoxView } from './components/shop/MysteryBoxView';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { GrammarDashboard } from './components/grammar/GrammarDashboard';
import { LoginScreen } from './components/auth/LoginScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SupportDashboard } from './components/support/SupportDashboard';
import { HomeworkScreen } from './components/homework/HomeworkScreen';

const MainApp: React.FC = () => {
  const { profile, currentScreen, setScreen, isAuthenticated } = useGame();
  const [acceptedPeerMatch, setAcceptedPeerMatch] = useState<ActiveDuelMatch | null>(null);

  // Strict Authentication Barrier: Never enter an account until login data is submitted
  if (!isAuthenticated || currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col">
        <LoginScreen />
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'homework':
        return <HomeworkScreen />;
      case 'admin':
        return (profile && profile.role === 'admin') ? <AdminDashboard /> : <HomeScreen />;
      case 'support':
        return (profile && (profile.role === 'support' || profile.role === 'admin')) ? <SupportDashboard /> : <HomeScreen />;
      case 'grammar':
      case 'grammar_topic':
        return <GrammarDashboard />;
      case 'learn':
        return <LearnScreen />;
      case 'flashcards':
        return <FlashcardViewer onBack={() => setScreen('learn')} />;
      case 'practice':
        return <VocabularyPractice onBack={() => setScreen('learn')} />;
      case 'vocabulary_exam':
        return <VocabularyExamScreen unitId={profile.activeExamAttempt?.unitId || 'unit-1'} onExit={() => setScreen('learn')} />;
      case 'mistakes':
        return <MistakesReview onBack={() => setScreen('learn')} />;
      case 'play':
        return <PlayScreen initialMatch={acceptedPeerMatch} key={acceptedPeerMatch?.matchId || 'play_default'} />;
      case 'compete':
        return <CompeteScreen />;
      case 'shop':
        return <ShopScreen />;
      case 'mystery':
        return (
          <div className="max-w-5xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-200">
            <MysteryBoxView />
          </div>
        );
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col">
      {/* Onboarding Modal Overlay */}
      {!profile.isOnboarded && <OnboardingModal />}

      {/* Real-time Incoming Duel Alert Overlay */}
      <IncomingDuelModal 
        onAcceptDuel={(match) => {
          setAcceptedPeerMatch(match);
          setScreen('play');
        }} 
      />

      {/* Global Status Header (Permanently Locked to Top) */}
      <Header />

      <div className="flex-1 flex pt-16">
        {/* Navigation Sidebar & Dock */}
        <Navbar />

        {/* Main Application Content */}
        <main className="flex-1 px-3 sm:px-6 pt-4 sm:pt-6 pb-28 md:pb-12 md:pl-72 max-w-7xl w-full mx-auto min-w-0">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}

export default App;
