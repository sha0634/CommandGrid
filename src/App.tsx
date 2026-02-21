import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CommandCenter from './components/CommandCenter';
import Leaderboard from './components/Leaderboard';
import AlertFeed from './components/AlertFeed';
import AlertHistory from './components/AlertHistory';
import Analytics from './components/Analytics';
import Drivers from './components/Drivers';
import EscalationRules from './components/EscalationRules';
import Settings from './components/Settings';

function App() {
  const [currentView, setCurrentView] = useState('overview');

  return (
    <div className="flex min-h-screen bg-dashboard-bg">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <TopBar />
        <main className="p-8 space-y-8 overflow-y-auto">
          {currentView === 'overview' && (
            <>
              <CommandCenter />
              <Leaderboard />
              <AlertFeed />
            </>
          )}
          {currentView === 'history' && <AlertHistory />}
          {currentView === 'analytics' && <Analytics />}
          {currentView === 'drivers' && <Drivers />}
          {currentView === 'escalation' && <EscalationRules />}
          {currentView === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}

export default App;
