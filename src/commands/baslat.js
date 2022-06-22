const { SlashCommandBuilder } = require("@discordjs/builders");
const guildDatabase = require('../models/guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('başlat')
        .setDescription('Yeni bir kelime oyunu başlatır.'),
    run: async (interaction) => {
        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: `Bu işlemi yapabilmek için yeterli yetkiye sahip değilsin.`, ephemeral: true });
        let guildData = await guildDatabase.findOne({ id: interaction.guild.id });
        if (!guildData) return interaction.reply({ content: `Oyun kurulumu henüz yapılmamış. Lütfen '/kurulum' ile oyun kurulumunu yapın.`, ephemeral: true })
        await guildDatabase.updateOne(
            {
                id: interaction.guild.id
            }, {
            $set: {
                game: {
                    channel: guildData.game.channel,
                    status: true
                }
            }
        });
        client.startGame(interaction.guild, guildData.game.channel);
        interaction.reply({ content: `Kelime oyunu başlatıldı.`, ephemeral: true });
    },
};
