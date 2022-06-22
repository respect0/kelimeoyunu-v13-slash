const { SlashCommandBuilder } = require("@discordjs/builders");
const guild = require("../models/guild");
const guildDatabase = require('../models/guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('durdur')
        .setDescription('Mevcut kelime oyununu durdurur.'),
    run: async (interaction) => {
        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: `Bu işlemi yapabilmek için yeterli yetkiye sahip değilsin.`, ephemeral: true });
        let guildData = await guildDatabase.findOne({ id: interaction.guild.id });
        if (!guildData) return interaction.reply({ content: `Oyun kurulumu henüz yapılmamış. Lütfen '/kurulum' ile oyun kurulumunu yapın.`, ephemeral: true })
        if (!guildData.game.status) return interaction.reply({ content: `Oyun zaten durdurulmuş.`, ephemeral: true });
        await guildDatabase.updateOne(
            {
                id: interaction.guild.id
            }, {
            $set: {
                game: {
                    channel: guildData.game.channel,
                    status: false
                }
            }
        });
        client.game.delete(interaction.guild.id)
        interaction.reply({ content: `Kelime oyunu durduruldu. Tekrar başlatmak için '/başlat' komutunu kullanabilirsiniz.`, ephemeral: true });
    },
};
