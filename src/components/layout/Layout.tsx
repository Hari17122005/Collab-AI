import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Dashboard } from '@/src/pages/Dashboard';
import { Tasks } from '@/src/pages/Tasks';
import { Performance } from '@/src/pages/Performance';
import { TeamInsights } from '@/src/pages/TeamInsights';
import { Profile } from '@/src/pages/Profile';
import Roadmap from '@/src/pages/Roadmap';
import Board from '@/src/pages/Board';
import Goals from '@/src/pages/Goals';
import Reports from '@/src/pages/Reports';
import Favorites from '@/src/pages/Favorites';
import Protection from '@/src/pages/Protection';
import TeamDetails from '@/src/pages/TeamDetails';
import Apps from '@/src/pages/Apps';
import AIInsights from '@/src/pages/AIInsights';
import { Chatbot } from '../Chatbot';

export function Layout() {
  const [currentPath, setCurrentPath] = useState('/');

  const renderContent = () => {
    switch (currentPath) {
      case '/': return <Dashboard />;
      case '/roadmap': return <Roadmap />;
      case '/board': return <Board />;
      case '/goals': return <Goals />;
      case '/reports': return <Reports />;
      case '/favorites': return <Favorites />;
      case '/protection': return <Protection />;
      case '/team-details': return <TeamDetails />;
      case '/apps': return <Apps />;
      case '/ai-insights': return <AIInsights />;
      case '/performance': return <Performance />;
      case '/team': return <TeamInsights />;
      case '/profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  const getTitle = () => {
    switch (currentPath) {
      case '/': return 'Dashboard Overview';
      case '/roadmap': return 'Project Roadmap';
      case '/board': return 'Task Board';
      case '/goals': return 'Strategic Goals';
      case '/reports': return 'Analytics & Reports';
      case '/favorites': return 'Favorites';
      case '/protection': return 'Security & Protection';
      case '/team-details': return 'Team Details';
      case '/apps': return 'App Integrations';
      case '/ai-insights': return 'AI Project Insights';
      case '/performance': return 'Personal Performance';
      case '/team': return 'Team Insights';
      case '/profile': return 'My Profile';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#0F1115] text-slate-900 dark:text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <Sidebar currentPath={currentPath} onNavigate={setCurrentPath} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header title={getTitle()} currentPath={currentPath} onNavigate={setCurrentPath} />
        
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0A0B0D] p-8 scroll-smooth relative">
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
