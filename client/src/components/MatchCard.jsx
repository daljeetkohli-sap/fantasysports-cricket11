export default function MatchCard({ match }) {
  const fillPercentage = (match.spotsLeft / match.totalSpots) * 100;
  return (
    <div className="card">
      <div className="row-between muted small-text">
        <span>{match.league}</span>
        <span>{match.startTime}</span>
      </div>
      <div className="versus-row">
        <div>
          <h3>{match.teamA}</h3>
        </div>
        <div className="versus-pill">VS</div>
        <div>
          <h3>{match.teamB}</h3>
        </div>
      </div>
      <div className="row-between small-text">
        <span>Prize Pool {match.prizePool}</span>
        <span>Entry ₹{match.entry}</span>
      </div>
      <div className="progress-bar"><span style={{ width: `${fillPercentage}%` }} /></div>
      <div className="row-between muted small-text">
        <span>{match.spotsLeft} spots left</span>
        <span>{match.totalSpots} total</span>
      </div>
    </div>
  );
}
