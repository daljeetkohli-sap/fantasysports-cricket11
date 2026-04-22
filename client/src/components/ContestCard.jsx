export default function ContestCard({ contest }) {
  const fill = (contest.filled / contest.size) * 100;
  return (
    <div className="card">
      <div className="row-between">
        <h3>{contest.title}</h3>
        <span className="badge">₹{contest.entry}</span>
      </div>
      <div className="contest-grid">
        <div>
          <p className="label">Prize Pool</p>
          <strong>{contest.prizePool}</strong>
        </div>
        <div>
          <p className="label">1st Prize</p>
          <strong>{contest.firstPrize}</strong>
        </div>
      </div>
      <div className="progress-bar"><span style={{ width: `${fill}%` }} /></div>
      <div className="row-between muted small-text">
        <span>{contest.filled} joined</span>
        <span>{contest.size - contest.filled} left</span>
      </div>
    </div>
  );
}
