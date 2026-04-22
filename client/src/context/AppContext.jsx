import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || '/api';

export function AppProvider({ children }) {
  const [matches, setMatches] = useState([]);
  const [contests, setContests] = useState([]);
  const [players, setPlayers] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0, bonus: 0, winnings: 0, transactions: [] });
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [captain, setCaptain] = useState('');
  const [viceCaptain, setViceCaptain] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [teamStatus, setTeamStatus] = useState('');
  const [contestStatus, setContestStatus] = useState('');
  const [joinedContestIds, setJoinedContestIds] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    setLoadError('');
    Promise.all([
      fetchJson('/matches'),
      fetchJson('/contests'),
      fetchJson('/players'),
      fetchJson('/teams'),
      fetchJson('/leaderboard'),
      fetchJson('/wallet')
    ])
      .then(([matchesData, contestsData, playersData, teamsData, leaderboardData, walletData]) => {
        setMatches(matchesData);
        setContests(contestsData);
        setPlayers(playersData);
        setMyTeams(teamsData);
        setLeaderboard(leaderboardData);
        setWallet(walletData);
      })
      .catch((error) => {
        setLoadError(error.message || 'Failed to load app data');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const playersById = useMemo(() => new Map(players.map((player) => [player.id, player])), [players]);

  const totalCredits = useMemo(
    () => selectedPlayers.reduce((sum, playerId) => sum + (playersById.get(playerId)?.credits || 0), 0),
    [selectedPlayers, playersById]
  );

  const togglePlayer = (playerId) => {
    setTeamStatus('');
    setSelectedPlayers((current) => {
      if (current.includes(playerId)) {
        if (captain === playerId) setCaptain('');
        if (viceCaptain === playerId) setViceCaptain('');
        return current.filter((id) => id !== playerId);
      }
      if (current.length >= 11) return current;
      return [...current, playerId];
    });
  };

  const assignCaptain = (playerId) => {
    setTeamStatus('');
    setCaptain(playerId);
    if (viceCaptain === playerId) setViceCaptain('');
  };

  const assignViceCaptain = (playerId) => {
    setTeamStatus('');
    setViceCaptain(playerId);
    if (captain === playerId) setCaptain('');
  };

  const saveTeam = async () => {
    setTeamStatus('Saving team...');
    const payload = {
      name: `Team ${myTeams.length + 1}`,
      players: selectedPlayers,
      captain,
      viceCaptain
    };

    const response = await fetch(`${API_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unable to save team' }));
      setTeamStatus(error.error || 'Unable to save team');
      return;
    }

    const data = await response.json();
    setMyTeams((current) => [data, ...current]);
    setSelectedPlayers([]);
    setCaptain('');
    setViceCaptain('');
    setTeamStatus(`${data.name} saved`);
  };

  const joinContest = async (contestId) => {
    if (joinedContestIds.includes(contestId)) return;

    setContestStatus('Joining contest...');
    const response = await fetch(`${API_URL}/contests/${contestId}/join`, { method: 'POST' });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unable to join contest' }));
      setContestStatus(error.error || 'Unable to join contest');
      return;
    }

    const updatedContest = await response.json();
    setContests((current) => current.map((contest) => (contest.id === updatedContest.id ? updatedContest : contest)));
    setJoinedContestIds((current) => [...current, contestId]);
    setContestStatus(`Joined ${updatedContest.title}`);
  };

  const getPlayerName = (playerId) => {
    return playersById.get(playerId)?.name || playerId;
  };

  return (
    <AppContext.Provider
      value={{
        matches,
        contests,
        players,
        myTeams,
        leaderboard,
        wallet,
        isLoading,
        loadError,
        teamStatus,
        contestStatus,
        joinedContestIds,
        selectedPlayers,
        totalCredits,
        captain,
        viceCaptain,
        getPlayerName,
        setCaptain: assignCaptain,
        setViceCaptain: assignViceCaptain,
        togglePlayer,
        saveTeam,
        joinContest
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

async function fetchJson(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
}
