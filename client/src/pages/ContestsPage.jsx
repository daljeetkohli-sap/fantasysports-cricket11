import { useApp } from '../context/AppContext';
import SectionHeader from '../components/SectionHeader';
import ContestCard from '../components/ContestCard';

export default function ContestsPage() {
  const { contests } = useApp();
  return (
    <div className="stack">
      <SectionHeader title="Contests" subtitle="Prize pools, entry fees, and occupancy data from the mock API." />
      {contests.map((contest) => <ContestCard key={contest.id} contest={contest} />)}
    </div>
  );
}
