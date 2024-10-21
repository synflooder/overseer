// Overseer By Kaguya

const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

exports.help = {
  name: 'serverlist',
  aliases: ['servers'],
  description: 'Affiche la liste des serveurs dans lesquels le bot est présent.',
  use: 'serverlist',
  category: 'bot',
};

exports.run = async (bot, message, args) => {
  if (!config.owners.includes(message.author.id)) {
    return message.reply('⚠️ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.');
  }

  const serverList = bot.guilds.cache.map(guild => `• **${guild.name}** - ${guild.memberCount} membres (ID : ${guild.id})`).join('\n');
  const embed = new EmbedBuilder()
    .setTitle('📜 Liste des serveurs')
    .setDescription(serverList || 'Le bot n\'est dans aucun serveur.')
    .setColor(config.color)
    .setFooter({
      text: `Overseer - ${bot.guilds.cache.size} serveurs`,
      iconURL: bot.user.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();
  message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
};
