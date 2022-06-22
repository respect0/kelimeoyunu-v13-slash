const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const guildDatabase = require('../models/guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kurulum')
        .setDescription('Oyun kurulumunu yapar.')
        .addChannelOption(x => x.setName("kanal").setDescription("Kelime oyunu kanalı.").setRequired(true)),
    run: async (interaction) => {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: `Bu işlemi yapabilmek için yeterli yetkiye sahip değilsin.`, ephemeral: true });
        const channel = interaction.options.getChannel("kanal")
        if (channel.type == "GUILD_TEXT") {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("🟢")
                        .setStyle("SECONDARY")
                        .setCustomId("btnGameStart"),
                );
            let guildData = await guildDatabase.findOne({ id: interaction.guild.id });
            if (guildData) {
                await guildDatabase.updateOne(
                    {
                        id: interaction.guild.id
                    }, {
                    $set: {
                        game: {
                            channel: channel.id,
                            status: true
                        }
                    }
                });
                return interaction.reply({ content: `Oyun kanalı ${channel} olarak güncellendi. Oyun aktif durumdayken kanalı değiştirdiyseniz mevcut kanaldan oyuna devam edilebilir. Oyunu tekrar başlatmak isterseniz '/başlat' kullanabilirsiniz veya aşağıdaki düğmeye tıklayarak başlatabilirsiniz.`, ephemeral: true, components: [row] }).then(async (x) => {
                    let collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', max: 1, time: 30000 });
                    collector.on("collect", async (button) => {
                        if (button.customId == "btnGameStart") {
                            client.startGame(interaction.guild, channel.id);
                            button.update({ content: `Kelime oyunu başlatıldı.`, components: [] });
                        }
                    })
                    collector.on("end", async (button) => {
                    });
                });
            } else {
                await new guildDatabase({
                    id: interaction.guild.id,
                    game: {
                        channel: channel.id,
                        status: false,
                    }
                }).save().catch(() => { });
                return interaction.reply({ content: `Kurulum tamamlandı ve oyun kanalı ${channel} olarak ayarlandı. Oyun kanalında '/başlat' kullanarak veya aşağıdaki düğmeye tıklayarak oyunu başlatabilirsiniz. Oyun sonlandığında otomatik olarak tekrar başlayacaktır.`, ephemeral: true, components: [row] }).then(async (x) => {
                    let collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', max: 1, time: 30000 });
                    collector.on("collect", async (button) => {
                        if (button.customId == "btnGameStart") {
                            client.startGame(interaction.guild, channel.id);
                            button.update({ content: `Kelime oyunu başlatıldı.`, components: [] });
                        }
                    })
                    collector.on("end", async (button) => {
                    });
                });
            }
        } else interaction.reply({ content: `Kanal türü sadece metin olabilir.`, ephemeral: true });
    },
};
