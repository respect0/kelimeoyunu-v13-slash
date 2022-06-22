const axios = require('axios');
const guildDatabase = require('../models/guild')

module.exports = {
  event: "messageCreate",
  oneTime: false,
  ws: false,
  run: async (message) => {
    let guildData = await guildDatabase.findOne({ content: message.guild.id });
    if (!guildData) return;
    if (!guildData.game.status) return;
    if (message.channel.id != guildData?.game.channel) return;
    if (message.member.user.bot) return;
    let chars = [...message.content.toLowerCase()];
    const yaziKarakterleri = ['#', '!']
    if (yaziKarakterleri.includes(chars[0])) return;
    await axios({
      method: 'get',
      url: 'https://sozluk.gov.tr/gts?ara=' + message.content.toLowerCase().replaceAll('ı', '%C4%B1').replaceAll('ç', '%C3%A7').replaceAll('ö', '%C3%B6').replaceAll('ş', '%C5%9F').replaceAll('ü', '%C3%BC').replaceAll('ğ', '%C4%9F'),
    }).then(async function (response) {
      if (response.data.error) {
        await message.delete();
      } else {
        if (client.game.has(message.guild.id)) {
          if (client.game.get(message.guild.id).lastChar == chars[0] && !client.game.get(message.guild.id).words.includes(message.content) && chars.length >= 2) {
            if (chars[chars.length - 1] == 'ğ') {
              message.channel.send({ content: `Son harf \`ğ\` olduğundan dolayı oyun sona erdi.` });
              client.game.delete(interaction.guild.id);
              client.startGame(message.guild, guildData.game.channel);
              return;
            }
            let data = {
              lastChar: chars[chars.length - 1],
              words: client.game.get(message.guild.id).words.concat(message.content)
            }
            client.game.set(message.guild.id, data);
          } else return await message.delete();
        } else return /*{
          let data = {
            lastChar: chars[chars.length - 1],
            words: []
          }
          client.game.set(message.guild.id, data);
        }*/
      }
    });
  },
};
