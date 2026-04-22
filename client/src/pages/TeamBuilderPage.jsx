import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import SectionHeader from '../components/SectionHeader';
import PlayerRow from '../components/PlayerRow';

export default function TeamBuilderPage() {
  const {
    players,
    selectedPlayers,
    totalCredits,
    captain,
    viceCaptain,
    setCaptain,
    setViceCaptain,
    togglePlayer,
    saveTeam
  } = useApp();

  const selectedCount = selectedPlayers.length;
  const selectedSet = useMemo(() => new Set(selectedPlayers), [selectedPlayers]);

  return (
    <div className="stack">
      <SectionHeader title="Team Builder" subtitle="Pick 11 players, then assign captain and vice-captain." />

      <div className="summary-grid">
        <div className="mini-card"><span>Selected</span><strong>{selectedCount}/11</strong></div>
        <div className="mini-card"><span>Credits Used</span><strong>{totalCredits}</strong></div>
        <div className="mini-card"><span>Captain</span><strong>{captain || '-'}</strong></div>
        <div className="mini-card"><span>Vice Captain</span><strong>{viceCaptain || '-'}</strong></div>
      </div>

      <div className="card">
        {players.map((player) => (
          <PlayerRow
            key={player.id}
            player={player}
            isSelected={selectedSet.has(player.id)}
            onToggle={togglePlayer}
            canAssign={selectedSet.has(player.id)}
            captain={captain}
            viceCaptain={viceCaptain}
            setCaptain={setCaptain}
            setViceCaptain={setViceCaptain}
          />
        ))}
      </div>

      <button
        className="btn primary wide"
        disabled={selectedCount !== 11 || !captain || !viceCaptain}
        onClick={saveTeam}
      >
        Save Team
      </button>
    </div>
  );
}
