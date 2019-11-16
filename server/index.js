const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const model = require('./game');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/twitch-watcher', (req, res) => {
  const { twitchWatcherId } = req.query;
  const twitchWatcher = model.getTwitchWater(twitchWatcherId);
  res.json(twitchWatcher);
});

app.post('/cash-in', (req, res) => {
  const { twitchWatcherId, amount } = req.query;
  const twitchWatcher = model.cashIn(twitchWatcherId, amount);
  res.json(twitchWatcher);
});

app.get('/game', (req, res) => {
  const { streamerId } = req.query;
  const game = model.getGame(streamerId);
  res.json(game);
});

app.get('/game/bet-amount', (req, res) => {
  const { streamerId } = req.query;
  const amounts = model.getBetOptionAmount(streamerId);
  res.json(amounts);
});

app.get('/game/payout', (req, res) => {
  const { streamerId } = req.query;
  const payout = model.getPayout(streamerId);
  res.json(payout);
});

app.post('/game/create', (req, res) => {
  const { streamerId, title, description, countdown, options } = req.body;
  const game = model.createGame({ streamerId, title, description, countdown, options });
  res.json(game);
});

app.post('/game/bet-stop', (req, res) => {
  const { streamerId } = req.body;
  const game = gameStopBet(streamerId);
  res.json(game);
});

app.post('/bet', (req, res) => {
  const {
    streamerId,
    twitchWatcherId,
    gameId,
    amount,
    optionNumber,
  } = req.body;
  const { error, message, bet } = model.bet({
    streamerId,
    twitchWatcherId,
    gameId,
    amount,
    optionNumber,
  });
  if (error) {
    res.json({ message });
    return;
  }
  res.json(bet);
});

app.post('/game/end', (req, res) => {
  const { streamerId, winnerOption } = req.body;
  const winToken = model.endGame(streamerId, winnerOption);
  res.json(winToken);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
