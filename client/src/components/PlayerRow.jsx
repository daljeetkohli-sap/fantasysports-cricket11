export default function PlayerRow({ player, isSelected, onToggle, canAssign, captain, viceCaptain, setCaptain, setViceCaptain }) {
  return (
    <div className={`player-row ${isSelected ? 'selected' : ''}`}>
      <div>
        <h4>{player.name}</h4>
        <p className="muted small-text">{player.team} • {player.role} • {player.points} pts</p>
      </div>
      <div className="player-actions">
        <span className="badge ghost">{player.credits}</span>
        <button onClick={() => onToggle(player.id)} className="btn small">{isSelected ? 'Remove' : 'Add'}</button>
        {canAssign && (
          <div className="captain-actions">
            <button className={`mini ${captain === player.id ? 'active' : ''}`} onClick={() => setCaptain(player.id)}>C</button>
            <button className={`mini ${viceCaptain === player.id ? 'active' : ''}`} onClick={() => setViceCaptain(player.id)}>VC</button>
          </div>
        )}
      </div>
    </div>
  );
}
