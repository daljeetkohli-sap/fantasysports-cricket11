import { Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContestsPage from './pages/ContestsPage';
import TeamBuilderPage from './pages/TeamBuilderPage';
import MyTeamsPage from './pages/MyTeamsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import WalletPage from './pages/WalletPage';
import { useApp } from './context/AppContext';
import GoogleSignIn from './components/GoogleSignIn';
import InstallAppPrompt from './components/InstallAppPrompt';

export default function App() {
  const { isLoading, loadError } = useApp();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Fantasy Sports</p>
          <h1>Playbook Arena</h1>
        </div>
        <GoogleSignIn />
      </header>

      <main className="page-body">
        {isLoading && <div className="card status-card">Loading live contest data...</div>}
        {loadError && <div className="card status-card error">{loadError}</div>}
        {!isLoading && !loadError && (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contests" element={<ContestsPage />} />
            <Route path="/team-builder" element={<TeamBuilderPage />} />
            <Route path="/my-teams" element={<MyTeamsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/wallet" element={<WalletPage />} />
          </Routes>
        )}
      </main>

      <nav className="bottom-nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/contests">Contests</NavLink>
        <NavLink to="/team-builder">Build Team</NavLink>
        <NavLink to="/my-teams">My Teams</NavLink>
        <NavLink to="/wallet">Wallet</NavLink>
      </nav>
      <InstallAppPrompt />
    </div>
  );
}
