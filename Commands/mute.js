// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'mute',
  aliases: ['silence'],
  description: 'Rend un utilisateur muet.',
  use: 'mute @user',
  category: 'moderation',
}

exports.run = async (bot, message, args, config) => {
  const member = message.mentions.members.first();
  if (!member) {
    return message.reply('Veuillez mentionner un utilisateur à rendre muet.');
  }

  await member.voice.setMute(true);
  message.reply(`${member.user.tag} est maintenant muet.`);
}
