const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
const writeJson = (file, payload) => fs.writeFileSync(path.join(dataDir, file), JSON.stringify(payload, null, 2));

app.get('/api/health', (_, res) => {
  res.json({ ok: true, service: 'fantasy-sports-server' });
});

app.get('/api/matches', (_, res) => {
  res.json(readJson('matches.json'));
});

app.get('/api/contests', (_, res) => {
  res.json(readJson('contests.json'));
});

app.get('/api/players', (_, res) => {
  res.json(readJson('players.json'));
});

app.get('/api/teams', (_, res) => {
  res.json(readJson('myTeams.json'));
});

app.post('/api/teams', (req, res) => {
  const { name, players, captain, viceCaptain } = req.body;
  if (!name || !Array.isArray(players) || players.length !== 11) {
    return res.status(400).json({ error: 'Invalid team payload' });
  }

  const uniquePlayers = new Set(players);
  if (uniquePlayers.size !== players.length) {
    return res.status(400).json({ error: 'Team cannot contain duplicate players' });
  }

  if (!captain || !viceCaptain || captain === viceCaptain || !uniquePlayers.has(captain) || !uniquePlayers.has(viceCaptain)) {
    return res.status(400).json({ error: 'Captain and vice-captain must be different selected players' });
  }

  const teams = readJson('myTeams.json');
  const newTeam = {
    id: `T${Date.now()}`,
    name,
    players,
    captain,
    viceCaptain,
    points: 0
  };
  teams.unshift(newTeam);
  writeJson('myTeams.json', teams);
  res.status(201).json(newTeam);
});

app.get('/api/leaderboard', (_, res) => {
  res.json(readJson('leaderboard.json'));
});

app.get('/api/wallet', (_, res) => {
  res.json(readJson('wallet.json'));
});

app.post('/api/login', (req, res) => {
  const { email } = req.body;
  res.json({
    id: 'U1001',
    name: 'Dal Sports',
    email,
    token: 'mock-jwt-token'
  });
});

const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
