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

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/matches`).then((r) => r.json()),
      fetch(`${API_URL}/contests`).then((r) => r.json()),
      fetch(`${API_URL}/players`).then((r) => r.json()),
      fetch(`${API_URL}/teams`).then((r) => r.json()),
      fetch(`${API_URL}/leaderboard`).then((r) => r.json()),
      fetch(`${API_URL}/wallet`).then((r) => r.json())
    ])
      .then(([matchesData, contestsData, playersData, teamsData, leaderboardData, walletData]) => {
        setMatches(matchesData);
        setContests(contestsData);
        setPlayers(playersData);
        setMyTeams(teamsData);
        setLeaderboard(leaderboardData);
        setWallet(walletData);
      })
      .catch((error) => console.error('Failed to load data', error));
  }, []);

  const totalCredits = useMemo(
    () => selectedPlayers.reduce((sum, playerId) => sum + (players.find((p) => p.id === playerId)?.credits || 0), 0),
    [selectedPlayers, players]
  );

  const togglePlayer = (playerId) => {
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
    setCaptain(playerId);
    if (viceCaptain === playerId) setViceCaptain('');
  };

  const assignViceCaptain = (playerId) => {
    setViceCaptain(playerId);
    if (captain === playerId) setCaptain('');
  };

  const saveTeam = async () => {
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
      throw new Error(error.error || 'Unable to save team');
    }

    const data = await response.json();
    setMyTeams((current) => [data, ...current]);
    setSelectedPlayers([]);
    setCaptain('');
    setViceCaptain('');
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
        selectedPlayers,
        totalCredits,
        captain,
        viceCaptain,
        setCaptain: assignCaptain,
        setViceCaptain: assignViceCaptain,
        togglePlayer,
        saveTeam
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
