// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'roleinfo',
  aliases: ['info-role'],
  description: 'Affiche des informations sur un rôle.',
  use: 'roleinfo <role>',
  category: 'utils',
}

exports.run = async (bot, message, args, config) => {
  const role = message.guild.roles.cache.find(r => r.name === args.join(' '));
  if (!role) {
    return message.reply('Veuillez spécifier un rôle valide.');
  }

  const embed = new Discord.EmbedBuilder()
    .setTitle(`Informations sur le rôle : ${role.name}`)
    .addFields(
      { name: 'ID', value: role.id },
      { name: 'Couleur', value: role.color.toString() },
      { name: 'Créé le', value: role.createdAt.toDateString() }
    )
    .setColor(role.color);

  message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
}
