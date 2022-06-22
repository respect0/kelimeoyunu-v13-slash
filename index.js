// Util
const { Client, Collection } = require('discord.js')
const mongoose = global.mongoose = require('mongoose');
const settings = global.settings = require('./src/settings/settings.json')
const ora = global.ora = require('ora');

//Client
const client = (global.client = new Client({ intents: [32767] }))

//Mongoose
const mongo = ora("Bot aktif ediliyor.").start();

mongoose.connect(settings.bot.mongoURL, {
    useNewUrlParser: true,
    autoIndex: false,
    connectTimeoutMS: 10000,
    family: 4,
    noDelay: true,
    maxPoolSize: 10,
    keepAlive: true,
    keepAliveInitialDelay: 300000
});

mongoose.connection.on("connected", () => {
    mongo.succeed(`MongoDB başarıyla bağlanıldı.`);
});

mongoose.connection.on("disconnected", () => {
    mongo.warn(`MongoDB bağlantısı koptu.`);
});

//Functions
require('./src/functions/functions');

// Slash Commands
require('./src/util/event').load(client);
const slash = require('./src/util/slash')

// Collections
client.game = new Collection();
client.commands = new Collection()

//Login
client.login(settings.bot.token)