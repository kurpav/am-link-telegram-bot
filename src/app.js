const Promise = require("bluebird");
Promise.config({
  cancellation: true
});

const { TELEGRAM_BOT_KEY, NODE_ENV, HEROKU_URL, PORT } = process.env;

const Bot = require("node-telegram-bot-api");
const { getSongMetadata } = require("./scrapper");
const { searchSongs } = require("./soundcloud");

// replace the value below with the Telegram token you receive from @BotFather
const token = TELEGRAM_BOT_KEY;
let bot;

if (NODE_ENV === "production") {
  bot = new Bot(token, {
    webHook: {
      port: PORT || 443
    }
  });
  // This informs the Telegram servers of the new webhook.
  // Note: we do not need to pass in the cert, as it already provided
  bot.setWebHook(`${HEROKU_URL}/bot${token}`);
} else {
  bot = new Bot(token, { polling: true });
}

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", async msg => {
  const chatId = msg.chat.id;
  // TODO: check if url is valid
  const songUrl = msg.text;

  const metadata = await getSongMetadata(songUrl);
  const songs = await searchSongs(metadata);

  const result = songs.slice(0, 2).join("\n") || "Nothing Found 🤷‍♂️";
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, result);
});
