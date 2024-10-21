// Overseer By Kaguya

const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'guildCreate',
  async execute(guild, bot) {
    const owners = config.owners;
    if (!owners || owners.length === 0) {
      console.error('⚠️ Aucun owner défini dans le config.json.');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('🔔 Nouveau Serveur !')
      .setDescription(`Le bot a été ajouté au serveur **${guild.name}**.\nVoulez-vous que le bot reste dans ce serveur ?`)
      .addFields(
        { name: '📜 Nom du serveur', value: guild.name, inline: true },
        { name: '🆔 ID du serveur', value: guild.id, inline: true },
        { name: '👥 Nombre de membres', value: guild.memberCount.toString(), inline: true }
      )
      .setColor('#ffcc00')
      .setTimestamp()
      .setFooter({ text: `Overseer - Nouveau serveur`, iconURL: bot.user.displayAvatarURL({ dynamic: true }) });

    for (const ownerId of owners) {
      try {
        const owner = await bot.users.fetch(ownerId);
        const messageDM = await owner.send({ embeds: [embed] });
        
        await messageDM.react('✅');
        await messageDM.react('❌');

        const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === ownerId;
        const collector = messageDM.createReactionCollector({ filter, time: 60000, max: 1 });

        collector.on('collect', async (reaction) => {
          if (reaction.emoji.name === '❌') {
            await guild.leave();
            await owner.send(`Le bot a quitté le serveur **${guild.name}**.`);
          } else {
            await owner.send(`Le bot restera dans le serveur **${guild.name}**.`);
          }
        });

        collector.on('end', collected => {
          if (collected.size === 0) {
            owner.send('⏳ Temps écoulé, le bot reste dans le serveur par défaut.');
          }
        });
      } catch (error) {
        console.error(`❌ Impossible d'envoyer un message à l'owner ID : ${ownerId}`, error);
      }
    }
  }
};
