import { useApp } from '../context/AppContext';
import SectionHeader from '../components/SectionHeader';

export default function MyTeamsPage() {
  const { myTeams, getPlayerName } = useApp();

  return (
    <div className="stack">
      <SectionHeader title="My Teams" subtitle="Saved squads with captain and vice-captain markers." />
      {myTeams.length === 0 && <div className="card status-card">No saved teams yet.</div>}
      {myTeams.map((team) => (
        <div key={team.id} className="card">
          <div className="row-between">
            <h3>{team.name}</h3>
            <span className="badge">{team.points} pts</span>
          </div>
          <p className="small-text muted">
            Captain: {team.captain ? getPlayerName(team.captain) : '-'} | Vice Captain:{' '}
            {team.viceCaptain ? getPlayerName(team.viceCaptain) : '-'}
          </p>
          <p className="small-text">Players: {team.players.map(getPlayerName).join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
