// Util
const fs = require("fs");
const guildDatabase = require('../models/guild');

// Slash Commands
const slash = require("../util/slash");

// CLI
const botLoader = ora("Bot aktif ediliyor.").start();

module.exports = {
  event: "ready",
  oneTime: true,
  ws: false,
  run: async (client) => {
    client.user.setPresence({ activities: [{ type: "PLAYING", name: `kelime oyunu -respect` }], status: 'idle' });
    let guildData = await guildDatabase.find();
    if (guildData.length > 0) {
      await start(guildData)
      setInterval(async () => {
        await checkGame();
      }, 30000);
    }
    const commandFiles = fs
      .readdirSync("./src/commands")
      .filter((file) => file.endsWith(".js"));

    let commandsArray = [];
    commandFiles.forEach((file) => {
      const command = require(`../commands/${file}`);
      client.commands.set(command.data.name, command);

      commandsArray.push(command);
    });

    const finalArray = commandsArray.map((e) => e.data.toJSON());
    slash.register(client.user.id, finalArray);

    botLoader.succeed(`${client.user.tag}, başarıyla giriş yaptım.`);
  },
};

async function start(data) {
  data.forEach(x => {
    let guild = client.guilds.cache.get(x.id);
    if (guild && x.game.status) {
      client.startGame(guild, x.game.channel);
    }
  })
}

async function checkGame() {
  let data = await guildDatabase.find();
  data.forEach(x => {
    let guild = client.guilds.cache.get(x.id);
    let channel = guild.channels.cache.get(x.game.channel);
    if (guild && channel && x.game.status) {
      if (!channel.lastMessage) return;
      if ((channel.lastMessage.createdTimestamp + (1000 * 60 * 60 * 2)) < Date.now()) { //kanaldaki mesaj atılma süresi 2 saatten fazlaysa oyunu yeniden başlatır.
        client.startGame(guild, x.game.channel);
      }
    }
  })
}



