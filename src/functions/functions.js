const { MessageEmbed } = require("discord.js");

client.findChannel = function (channelName) {
    try {
        return client.channels.cache.find(x => x.name === channelName)
    } catch (err) {
        return undefined;
    }
};

client.startGame = function (guild, channelId) {
    let harfler = ['a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'g', 'i', 'ı', 'j', 'k', 'l', 'm', 'n', 'o', 'ö', 'p', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z']
    let channel = guild.channels.cache.get(channelId);
    if (channel) {
        let harfNum = Math.floor(Math.random() * harfler.length);
        let data = {
            lastChar: harfler[harfNum],
            words: []
        }
        if(client.game.has(guild.id)) client.game.delete(guild.id);
        client.game.set(guild.id, data);
        channel.send({ embeds: [new MessageEmbed().setAuthor({name: guild.name, iconURL: guild.iconURL({dynamic: true})}).setDescription(`
        Oyun \`${harfler[harfNum]}\` harfi ile başlatıldı.
        
**Bilgilendirme;**
Kelime üretilemeyek harfler geldiği zaman oyun sonlanır.
\`#, !\` ile oyun kanalına mesaj gönderebilirsiniz.`).setColor("GREY")] }).catch(() => {});
    }
}



