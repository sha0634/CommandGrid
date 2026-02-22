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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-dashboard-bg overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false); // Auto-close on mobile after selection
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 transition-all duration-300">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8 space-y-8 overflow-y-auto w-full">
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
