let gameCount = 0;
let allGames = {};
let twitchWatchers = {};

function calculateTotal(streamerId) {
  const game = allGames[streamerId];
  let total = 0;
  const optionAmount = game.options.map(() => 0);
  game.bets.forEach(b => {
    optionAmount[b.optionNumber] += b.amount;
    total += b.amount;
  });
  return {
    total,
    optionAmount
  };
}

function getTwitchWater(id) {
  const twitchWatcher = twitchWatchers[id];
  return twitchWatcher || { token: 0 };
}

function cashIn(twitchWatcherId, amount) {
  console.log("log: ", twitchWatcherId, amount);
  if (!twitchWatchers[twitchWatcherId]) {
    twitchWatchers[twitchWatcherId] = { token: 0 };
  }
  const twitchWatcher = twitchWatchers[twitchWatcherId];
  twitchWatcher.token += amount;
  return twitchWatcher;
}

function getGame(streamerId) {
  const game = allGames[streamerId];
  return game;
}

function getBetOptionAmount(streamerId) {
  const game = allGames[streamerId];
  if (!game) {
    return [];
  }
  const amounts = game.options.map(() => 0);
  game.bets.forEach(b => {
    amounts[b.optionNumber] += b.amount;
  });
  return amounts;
}

function getPayout(streamerId) {
  const { total, optionAmount } = calculateTotal(streamerId);
  const payout = optionAmount.map(a => total / a);
  return payout;
}

function createGame({
  streamerId,
  title,
  description,
  countdown,
  options = []
}) {
  const game = {
    id: gameCount,
    streamerId,
    title,
    description,
    countdown,
    options: options.map(option => ({
      option,
      total: 0,
      people: {}
    })),
    createdAt: new Date(),
    bets: [],
    winner: null,
    betStop: false,
    isEnd: false
  };
  gameCount++;
  allGames[streamerId] = game;
  return game;
}

function gameStopBet(streamerId) {
  const game = allGames[streamerId];
  game.betStop = true;
  res.json(game);
}

function bet({ streamerId, twitchWatcherId, amount, optionNumber }) {
  const game = allGames[streamerId];
  const twitchWatcher = twitchWatchers[twitchWatcherId];


  if (!game) {
    return {
      error: true,
      message: "no game"
    };
  }

  if (!twitchWatcher || !twitchWatcher.token || twitchWatcher.token < amount) {
    return {
      error: true,
      message: "not enough token"
    };
  }

  

  if (game.betStop) {
    return {
      error: true,
      message: "bet stop"
    };
  }

  if (!game.options[optionNumber]) {
    return {
      error: true,
      message: "no option"
    };
  }

  const bet = {
    streamerId,
    twitchWatcherId,
    amount,
    optionNumber
  };

  game.options[optionNumber].people[twitchWatcherId] = true;
  game.options[optionNumber].total += amount;
  twitchWatcher.token -= amount;
  game.bets.push(bet);

  return { bet };
}

function endGame(streamerId, winnerOption) {
  const game = allGames[streamerId];
  const { total, optionAmount } = calculateTotal(streamerId);
  const winners = {};
  game.winner = winnerOption;
  game.bets.forEach(b => {
    const { twitchWatcherId, amount, optionNumber } = b;

    if (optionNumber === winnerOption) {
      if (!winners[twitchWatcherId]) {
        winners[twitchWatcherId] = 0;
      }
      token = (total / optionAmount[winnerOption]) * amount;
      winners[twitchWatcherId] += token;
      twitchWatchers[twitchWatcherId].token += token;
    }
  });
  game.isEnd = true;
  game.winners = winners;
  return winners;
}

function getAllData() {
  return {
    gameCount,
    allGames,
    twitchWatchers
  };
}

function reset() {
  gameCount = 0;
  allGames = {};
  twitchWatchers = {};
}

module.exports = {
  calculateTotal,
  getTwitchWater,
  cashIn,
  getGame,
  getBetOptionAmount,
  getPayout,
  createGame,
  gameStopBet,
  bet,
  endGame,
  getAllData,
  reset,
};
