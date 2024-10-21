// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'hide',
  aliases: ['cacher'],
  description: 'Cache le salon actuel.',
  usage: 'hide',
  category: 'gestions',
};

exports.run = async (bot, message, args, config) => {
  if (!message.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
    return message.reply('Vous n\'avez pas la permission de gérer les salons.');
  }

  const channel = message.channel;

  try {
    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { ViewChannel: false });
    message.reply('Ce salon a été caché avec succès.');
  } catch (error) {
    console.error(error);
    message.reply('Une erreur s\'est produite lors de la tentative de cacher le salon.');
  }
};
