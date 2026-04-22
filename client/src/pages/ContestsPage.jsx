import { useApp } from '../context/AppContext';
import SectionHeader from '../components/SectionHeader';
import ContestCard from '../components/ContestCard';

export default function ContestsPage() {
  const { contests, joinContest, contestStatus, joinedContestIds } = useApp();
  return (
    <div className="stack">
      <SectionHeader title="Contests" subtitle="Prize pools, entry fees, and occupancy data from the mock API." />
      {contestStatus && <p className="status-text">{contestStatus}</p>}
      {contests.map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          onJoin={joinContest}
          isJoined={joinedContestIds.includes(contest.id)}
        />
      ))}
    </div>
  );
}
