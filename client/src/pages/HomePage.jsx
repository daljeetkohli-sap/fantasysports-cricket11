import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SectionHeader from '../components/SectionHeader';
import MatchCard from '../components/MatchCard';

export default function HomePage() {
  const { matches, wallet } = useApp();

  return (
    <div className="stack">
      <section className="hero card accent">
        <p className="eyebrow">Today’s Action</p>
        <h2>Build squads. Join contests. Track your climb.</h2>
        <p className="muted-light">A starter experience for fantasy sports apps with original styling and reusable flows.</p>
        <div className="hero-actions">
          <Link to="/team-builder" className="btn primary">Create Team</Link>
          <Link to="/contests" className="btn">Browse Contests</Link>
        </div>
      </section>

      <section className="wallet-strip">
        <div className="mini-card"><span>Balance</span><strong>₹{wallet.balance}</strong></div>
        <div className="mini-card"><span>Bonus</span><strong>₹{wallet.bonus}</strong></div>
        <div className="mini-card"><span>Winnings</span><strong>₹{wallet.winnings}</strong></div>
      </section>

      <SectionHeader title="Upcoming matches" subtitle="Use these cards as your lobby landing experience." />
      <div className="stack">
        {matches.map((match) => <MatchCard key={match.id} match={match} />)}
      </div>
    </div>
  );
}
