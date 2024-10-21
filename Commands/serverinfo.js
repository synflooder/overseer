// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'serverinfo',
  aliases: ['info-serveur'],
  description: 'Affiche des informations détaillées sur le serveur.',
  use: 'serverinfo',
  category: 'utils',
}

exports.run = async (bot, message, args, config) => {
  const embed = new Discord.EmbedBuilder()
    .setTitle(`\`🏰\` ▸ Informations sur le serveur : ${message.guild.name}`)
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .addFields(
      { name: '> ▸ 🆔 *ID*', value: message.guild.id, inline: true },
      { name: '> ▸ 👑 *Propriétaire*', value: `<@${message.guild.ownerId}>`, inline: true },
      { name: '> ▸ 🌍 *Région*', value: message.guild.preferredLocale || 'Inconnue', inline: true },
      { name: '> ▸ 📅 *Créé le*', value: message.guild.createdAt.toDateString(), inline: true },
      { name: '> ▸ 📜 *Nombre de rôles*', value: message.guild.roles.cache.size.toString(), inline: true },
      { name: '> ▸ 📺 *Nombre de canaux*', value: message.guild.channels.cache.size.toString(), inline: true },
      { name: '> ▸ 🚀 *Boosts*', value: message.guild.premiumSubscriptionCount.toString(), inline: true },
      { name: '> ▸ 🔝 *Niveau de Boost*', value: `Niveau ${message.guild.premiumTier}`, inline: true },
      { name: '> ▸ 👥 *Membres*', value: message.guild.memberCount.toString(), inline: true }
    )
    .setFooter({
      text: 'Overseer - github.com/xwqu', 
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setColor(config.color)

  message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
}
