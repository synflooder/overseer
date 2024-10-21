// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'unhide',
  aliases: ['afficher'],
  description: 'Affiche le salon actuel.',
  usage: 'unhide',
  category: 'gestions',
};

exports.run = async (bot, message, args, config) => {
  if (!message.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
    return message.reply('Vous n\'avez pas la permission de gérer les salons.');
  }

  const channel = message.channel;

  try {
    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { ViewChannel: true });
    message.reply('Ce salon a été affiché avec succès.');
  } catch (error) {
    console.error(error);
    message.reply('Une erreur s\'est produite lors de la tentative d\'afficher le salon.');
  }
};
