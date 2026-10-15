import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { HomeScreen } from './components/home/HomeScreen';
import { LearnScreen } from './components/learn/LearnScreen';
import { FlashcardViewer } from './components/learn/FlashcardViewer';
import { VocabularyExamScreen } from './components/learn/VocabularyExamScreen';
import { ShopScreen } from './components/shop/ShopScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { GrammarDashboard } from './components/grammar/GrammarDashboard';
import { LoginScreen } from './components/auth/LoginScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SupportDashboard } from './components/support/SupportDashboard';
import { HomeworkScreen } from './components/homework/HomeworkScreen';

const MainApp: React.FC = () => {
  const { profile, currentScreen, setScreen, isAuthenticated } = useGame();

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
      case 'vocabulary_exam':
        return <VocabularyExamScreen unitId={profile.activeExamAttempt?.unitId || 'unit-1'} onExit={() => setScreen('learn')} />;
      case 'gifts':
      case 'shop':
        return <ShopScreen />;
      case 'profile':
        return <ProfileScreen />;
      // Removed legacy game screens redirect to clean screens
      case 'play':
      case 'compete':
      case 'mystery':
      case 'practice':
      case 'mistakes':
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col">
      {/* Onboarding Modal Overlay */}
      {!profile.isOnboarded && <OnboardingModal />}

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
