// Overseer By Kaguya

const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const config = require('../config.json');

exports.help = {
  name: 'theme',
  aliases: ['color', 'setcolor'],
  description: 'Change la couleur du thème pour les embeds.',
  use: 'theme <#couleur_hex>',
  category: 'bot',
}

exports.run = async (bot, message, args, config) => {
  if (!config.owners.includes(message.author.id)) {
    const embedNotOwner = new Discord.EmbedBuilder()
      .setColor('#FF0000')
      .setFooter({
        text: 'Overseer - github.com/xwqu',
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setDescription('\`❌\` ▸ **Seuls les propriétaires du bot peuvent utiliser cette commande.**');

    return message.reply({ embeds: [embedNotOwner], allowedMentions: { repliedUser: false } });
  }

  const newColor = args[0];
  if (!newColor) {
    const embedNoColor = new Discord.EmbedBuilder()
      .setColor('#FFA500')
      .setFooter({
        text: 'Overseer - github.com/xwqu',
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setDescription('\`❌\` ▸ **Merci de spécifier une couleur hexadécimale. Exemple : `#2b2d31`.**');

    return message.reply({ embeds: [embedNoColor], allowedMentions: { repliedUser: false } });
  }

  const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
  if (!hexRegex.test(newColor)) {
    const embedInvalidColor = new Discord.EmbedBuilder()
      .setColor('#FF0000')
      .setFooter({
        text: 'Overseer - github.com/xwqu',
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setDescription('\`❌\` ▸ **Merci de fournir un code couleur hexadécimal valide (ex: `#2b2d31`).**');

    return message.reply({ embeds: [embedInvalidColor], allowedMentions: { repliedUser: false } });
  }

  config.color = newColor;
  const configPath = path.join(__dirname, '../config.json');
  fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
    if (err) {
      console.error(err);
      const embedErrorSave = new Discord.EmbedBuilder()
        .setColor('#FF0000')
        .setFooter({
          text: 'Overseer - github.com/xwqu',
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setDescription('\`❌\` ▸ **Une erreur est survenue lors de la sauvegarde de la nouvelle couleur.**');

      return message.reply({ embeds: [embedErrorSave], allowedMentions: { repliedUser: false } });
    }

    const embedSuccess = new Discord.EmbedBuilder()
      .setColor(newColor) 
      .setDescription(`\`✅\` ▸ **La couleur du thème a été changée avec succès à ${newColor}.**`)
      .setFooter({
        text: 'Overseer - github.com/xwqu',
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });

    message.reply({ embeds: [embedSuccess], allowedMentions: { repliedUser: false } });
  });
}
