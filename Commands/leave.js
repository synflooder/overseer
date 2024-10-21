// Overseer By Kaguya

const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

exports.help = {
  name: 'leave',
  aliases: ['quitter'],
  description: 'Force le bot à quitter un serveur spécifique.',
  use: 'leave <server_id>',
  category: 'bot',
};

exports.run = async (bot, message, args) => {
  if (!config.owners.includes(message.author.id)) {
    return message.reply('⚠️ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.');
  }
  const serverId = args[0];
  if (!serverId) {
    return message.reply('❌ Vous devez fournir l\'ID du serveur à quitter.');
  }
  const guild = bot.guilds.cache.get(serverId);
  if (!guild) {
    return message.reply('❌ Aucun serveur trouvé avec cet ID.');
  }
  const embed = new EmbedBuilder()
    .setTitle('⚠️ Quitter le serveur ?')
    .setDescription(`Êtes-vous sûr de vouloir que le bot quitte le serveur **${guild.name}** ?`)
    .setColor(config.color)
    .setFooter({
      text: 'Réagissez avec ✅ pour confirmer.',
      iconURL: bot.user.displayAvatarURL({ dynamic: true }),
    });
  const confirmationMessage = await message.reply({ embeds: [embed] });
  await confirmationMessage.react('✅');
  await confirmationMessage.react('❌');
  const filter = (reaction, user) => {
    return ['✅', '❌'].includes(reaction.emoji.name) && config.owners.includes(user.id);
  };
  const collector = confirmationMessage.createReactionCollector({ filter, max: 1, time: 30000 });
  collector.on('collect', async (reaction) => {
    if (reaction.emoji.name === '✅') {
      await message.reply(`Le bot quitte maintenant le serveur **${guild.name}**.`);
      guild.leave();
    } else {
      message.reply('Opération annulée.');
    }
    confirmationMessage.delete();
  });

  collector.on('end', () => {
    if (!collector.collected.size) {
      message.reply('⏳ Temps écoulé, opération annulée.');
    }
  });
};
