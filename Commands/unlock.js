// Overseer By Kaguya

const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

exports.help = {
  name: 'unlock',
  aliases: ['deverrouiller'],
  description: 'Déverrouille le salon actuel pour permettre aux utilisateurs de parler.',
  use: 'unlock',
  category: 'moderation',
};

exports.run = async (bot, message, args) => {
  const channel = message.channel;
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return message.reply('🚫 Vous n\'avez pas la permission de déverrouiller ce salon.');
  }
  try {
    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
      SendMessages: true,
    });
    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setDescription('> 🔓 **Ce salon a été déverrouillé.**')
      .setFooter({
        text: 'Overseer - github.com/xwqu', 
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });
    await message.channel.send({ embeds: [embed] });

  } catch (error) {
    console.error('Erreur lors du déverrouillage du salon:', error);
    const embedError = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('> ❌ **Une erreur est survenue lors du déverrouillage du salon.**')
      .setFooter({
        text: 'Overseer - github.com/xwqu', 
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });
    await message.channel.send({ embeds: [embedError] });
  }
};
