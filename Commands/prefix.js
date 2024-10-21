// Overseer By Kaguya

const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

exports.run = async (bot, message, args) => {
  if (!config.owners.includes(message.author.id)) {
    return message.reply('🚫 Vous n\'avez pas la permission de changer le préfixe.');
  }

  const newPrefix = args[0];
  if (!newPrefix) {
    return message.reply('❗ Veuillez fournir un nouveau préfixe.');
  }
  if (newPrefix.length > 3) {
    return message.reply('❗ Le préfixe doit être de 3 caractères ou moins.');
  }

  config.prefix = newPrefix; // Set the new prefix
  fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
    if (err) {
      console.error(err);
      return message.reply('❌ Une erreur est survenue lors de la sauvegarde du nouveau préfixe.');
    }

    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('`🔧` ▸ Changement de Préfixe')
      .setDescription(`> **Le nouveau préfixe est maintenant \`${newPrefix}\`**`)
      .setFooter({ text: 'Overseer - github.com/xwqu', iconURL: message.author.displayAvatarURL({ dynamic: true }) });

    message.channel.send({ embeds: [embed] });
  });
};

exports.help = {
  name: 'prefix',
  aliases: ['setprefix'],
  description: 'Change le préfixe du bot.',
  usage: 'prefix <prefix>',
  category: 'bot',
};
