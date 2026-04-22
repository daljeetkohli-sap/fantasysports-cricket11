import { useApp } from '../context/AppContext';
import SectionHeader from '../components/SectionHeader';

export default function LeaderboardPage() {
  const { leaderboard } = useApp();
  return (
    <div className="stack">
      <SectionHeader title="Leaderboard" subtitle="Simple ranking screen for contest or match-level standings." />
      <div className="card">
        {leaderboard.map((entry) => (
          <div key={entry.rank} className="leader-row">
            <strong>#{entry.rank}</strong>
            <span>{entry.name}</span>
            <strong>{entry.points}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
