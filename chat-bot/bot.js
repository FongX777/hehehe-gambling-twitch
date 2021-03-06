const tmi = require("tmi.js");
const fetch = require("node-fetch");

const BOT_USERNAME = "coolsino";
const OAUTH_TOKEN =
  // "oauth:f4v0j7pmqshcx0wcaq2qlmgx1k3nli"  || //Tx
  // "oauth:q8ftfv7trz06cwj3s3uinm2jkf8omp"; || // geniustanley
  "oauth:fc5u99iuoh6zx4lkaheab5rt8fq8f8";
const CHANNEL_NAME = "geniustanley";
// Define configuration options
const opts = {
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN
  },
  channels: [CHANNEL_NAME, "txdragongaming", "geniusgordon"],
  options: {
    clientId: "qqlkimct46qhykax6n3p8iur7ddnns",
    debug: true
  }
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

async function bet(streamerId, twitchWatcherId, amount, optionNumber) {
  const body = {
    streamerId,
    twitchWatcherId,
    amount,
    optionNumber
  };
  const res = await fetch("http://localhost:3000/bet", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  });
  const json = await res.json();
  console.log("bet result: ", json);
  return json;
}

async function cashIn(twitchWatcherId, amount) {
  const body = {
    twitchWatcherId,
    amount
  };
  const res = await fetch("http://localhost:3000/cash-in", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  });
  const json = await res.json();
  return json.token;
}

async function getToken(id) {
  const res = await fetch(
    `http://localhost:3000/twitch-watcher?twitchWatcherId=${id}`
  );
  const json = await res.json();
  console.log("getToken: ", json);
  return json.token;
}

async function parseCashIn(target, context, commandName) {
  if (commandName.startsWith("!cashIn")) {
    const token = await cashIn(context["user-id"], 100);
    if (token) {
      console.log("target: ", target);
      client.say(target, `${context.username} 存了 100 元, 總共 ${token} 元`);
    }
  }
}

async function parseGetToken(target, context, commandName) {
  if (commandName.match(/^!token$/)) {
    // get token
    console.log('get: ', commandName);
    const token = await getToken(context["user-id"]);
    if (!isNaN(token)) {
      client.say(target, `${context.username} 有 ${token} 元`);
    }
  }
}

async function parseBet(target, context, commandName) {
  if (commandName.startsWith("!bet")) {
    const parseStringArray = commandName.split(" ");
    console.log(`* Parse: `, parseStringArray);
    if (parseStringArray[0].match(/^!bet$/gi)) {
      if (parseStringArray.length > 3 || parseStringArray.length < 3) {
        console.log(`* Invalid command ${commandName}`);
        return;
      }

      // option
      const optionMatch = parseStringArray[1].match(/^\d+$/g);
      if (!optionMatch) {
        console.log(`* Invalid option`);
        return;
      }
      const option = parseInt(optionMatch[0]);
      console.log(`* Option: ${option}`);

      // money
      const moneyMatch = parseStringArray[2].match(/^\d+$/g);

      if (!moneyMatch) {
        console.log(`* Invalid money`);
        return;
      }
      const money = parseInt(moneyMatch[0]);
      console.log(`* Money: ${money}`);

      console.log(`* Executed "bet ${option} ${money} command`);
      const result = await bet(12345, context["user-id"], money, option - 1);
      if (result.message === "not enough token") {
        client.say(target, `${context.username} 哭哭沒錢ㄛ`);
        return;
      }
      if (result.message === "no option") {
        client.say(target, `${context.username} 沒這選項捏`);
        return;
      }
      if (result.message === "no game") {
        client.say(target, `${context.username} 現在沒賭盤ㄛ`);
        return;
      }
      if (!isNaN(result.optionNumber) && !isNaN(result.amount)) {
        client.say(
          target,
          `${context.username} 已下注 ${result.optionNumber + 1} 號選項 ${
            result.amount
          } 元`
        );
      }
    } else {
      console.log(`* Unknown command ${commandName}`);
    }
  }
}

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot
  console.log("userState: ", context);
  // Remove whitespace from chat message
  const commandName = msg.trim();
  parseBet(target, context, commandName);
  parseGetToken(target, context, commandName);

  parseCashIn(target, context, commandName);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
