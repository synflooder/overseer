// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'timeout',
  aliases: ['mute_temp', "to"],
  description: 'Met un utilisateur en timeout pour une durée spécifiée.',
  use: 'timeout @user <durée>',
  category: 'moderation',
}

exports.run = async (bot, message, args, config) => {
  const member = message.mentions.members.first();
  const duration = parseInt(args[1]) * 1000;

  if (!member || isNaN(duration)) {
    return message.reply('Veuillez mentionner un utilisateur et spécifier une durée valide en secondes.');
  }

  await member.timeout(duration);
  message.reply(`${member.user.tag} a été mis en timeout pour ${args[1]} secondes.`);
}
