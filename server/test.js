const model = require('./game');

function debug() {
  console.log('---');
  console.log(JSON.stringify(model.getAllData(), null, 2));
}

model.createGame({
  streamerId: 'gordon',
  title: 'title',
  description: 'description',
  options: ['a', 'b', 'c'],
});

debug();

model.cashIn('a', 10);
model.cashIn('b', 10);
model.cashIn('c', 10);
model.cashIn('a', 10);

debug();

model.bet({
  streamerId: 'gordon',
  twitchWatcherId: 'a',
  optionNumber: 0,
  amount: 10,
});
model.bet({
  streamerId: 'gordon',
  twitchWatcherId: 'b',
  optionNumber: 1,
  amount: 10,
});
model.bet({
  streamerId: 'gordon',
  twitchWatcherId: 'a',
  optionNumber: 2,
  amount: 5,
});
model.bet({
  streamerId: 'gordon',
  twitchWatcherId: 'c',
  optionNumber: 0,
  amount: 5,
});
debug();

model.endGame('gordon', 0);

debug();
