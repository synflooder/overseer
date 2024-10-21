// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'unmute',
  aliases: ['annulermute'],
  description: 'Rend un utilisateur à nouveau audible.',
  use: 'unmute @user',
  category: 'moderation',
}

exports.run = async (bot, message, args, config) => {
  const member = message.mentions.members.first();
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return message.reply('🚫 Vous n\'avez pas la permission de déverrouiller ce salon.');
  }
  if (!member) {
    return message.reply('Veuillez mentionner un utilisateur à débloquer.');
  }

  await member.voice.setMute(false);
  message.reply(`${member.user.tag} n'est plus mute.`);
}
