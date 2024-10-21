// Overseer By Kaguya

const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const configPath = path.join(__dirname, '../config.json');

exports.help = {
  name: 'ownerlist',
  aliases: ['owners'],
  description: 'Affiche la liste des propriétaires du bot.',
  use: 'ownerlist',
  category: 'bot',
};

exports.run = async (bot, message, args) => {
  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    return message.reply('❌ Impossible de lire la configuration.');
  }
  if (!config.owners.includes(message.author.id)) {
    return message.reply('🚫 Vous n\'avez pas la permission de voir la liste des propriétaires.');
  }
  const ownerList = config.owners.map((ownerId, index) => `**${index + 1}.** <@${ownerId}>`).join('\n');
  const ownerListEmbed = new EmbedBuilder()
    .setColor(config.color)
    .setTitle('👑 Liste des Propriétaires')
    .setDescription(ownerList.length > 0 ? ownerList : 'Aucun propriétaire trouvé.')
    .setFooter({
        text: 'Overseer - github.com/xwqu', 
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
    .setTimestamp()
    .setThumbnail(bot.user.displayAvatarURL());
  message.channel.send({ embeds: [ownerListEmbed] });
};
