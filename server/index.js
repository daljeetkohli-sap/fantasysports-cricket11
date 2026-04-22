const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 4000;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const pendingPayments = new Map();

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

app.post('/api/contests/:contestId/join', (req, res) => {
  const contests = readJson('contests.json');
  const contest = contests.find((item) => item.id === req.params.contestId);

  if (!contest) {
    return res.status(404).json({ error: 'Contest not found' });
  }

  if (contest.filled >= contest.size) {
    return res.status(409).json({ error: 'Contest is full' });
  }

  contest.filled += 1;
  writeJson('contests.json', contests);
  res.json(contest);
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

  const validPlayerIds = new Set(readJson('players.json').map((player) => player.id));
  if (players.some((playerId) => !validPlayerIds.has(playerId))) {
    return res.status(400).json({ error: 'Team contains an unknown player' });
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

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ error: 'Google login is not configured on the server' });
  }

  if (!credential) {
    return res.status(400).json({ error: 'Missing Google credential' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    res.json({
      user: {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid Google sign-in token' });
  }
});

app.post('/api/payments/upi/create', (req, res) => {
  const amount = Number(req.body.amount);
  const upiId = String(req.body.upiId || '').trim();

  if (!Number.isFinite(amount) || amount < 10 || amount > 10000) {
    return res.status(400).json({ error: 'Enter an amount between 10 and 10000' });
  }

  const merchantVpa = process.env.UPI_MERCHANT_VPA || 'merchant@upi';
  const merchantName = process.env.UPI_MERCHANT_NAME || 'Playbook Arena';
  const payment = {
    id: `UPI${Date.now()}`,
    amount,
    customerUpiId: upiId,
    status: 'created',
    createdAt: new Date().toISOString()
  };
  const upiParams = new URLSearchParams({
    pa: merchantVpa,
    pn: merchantName,
    am: amount.toFixed(2),
    cu: 'INR',
    tn: `Wallet top-up ${payment.id}`
  });

  payment.intentUrl = `upi://pay?${upiParams.toString()}`;
  pendingPayments.set(payment.id, payment);
  res.status(201).json({ payment });
});

app.post('/api/payments/upi/:paymentId/confirm', (req, res) => {
  const payment = pendingPayments.get(req.params.paymentId);

  if (!payment) {
    return res.status(404).json({ error: 'Payment session not found' });
  }

  const wallet = readJson('wallet.json');
  wallet.balance += payment.amount;
  wallet.transactions.unshift({
    id: payment.id,
    type: 'UPI Top-up',
    amount: payment.amount,
    date: new Date().toISOString().slice(0, 10)
  });

  payment.status = 'confirmed';
  pendingPayments.delete(payment.id);
  writeJson('wallet.json', wallet);
  res.json({ payment, wallet });
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
