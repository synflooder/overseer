// Overseer By Kaguya

const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

exports.help = {
  name: 'lock',
  aliases: ['verrouiller'],
  description: 'Verrouille le salon actuel pour empêcher les utilisateurs de parler.',
  use: 'lock',
  category: 'moderation',
};

exports.run = async (bot, message, args) => {
  const channel = message.channel;
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return message.reply('🚫 Vous n\'avez pas la permission de verrouiller ce salon.');
  }
  try {
    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
      SendMessages: false,
    });
    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setDescription('> 🔒 **Ce salon a été verrouillé.**')
      .setFooter({
        text: 'Overseer - github.com/xwqu', 
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });
    await message.channel.send({ embeds: [embed] });

  } catch (error) {
    console.error('Erreur lors du verrouillage du salon:', error);
    const embedError = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('❌ **Une erreur est survenue lors du verrouillage du salon.**');
    await message.channel.send({ embeds: [embedError] });
  }
};
