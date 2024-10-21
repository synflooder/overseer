// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'userinfo',
  aliases: ['info-user', ''],
  description: 'Affiche des informations sur un utilisateur.',
  use: 'userinfo @user | userID',
  category: 'utils',
}

exports.run = async (bot, message, args, config) => {
  let member;
  if (message.mentions.members.size) {
    member = message.mentions.members.first();
  } else if (args[0]) {
    try {
      const userId = args[0];
      const user = await bot.users.fetch(userId);
      member = await message.guild.members.fetch(user.id).catch(() => null);
    } catch (error) {
      return message.reply("❌ **Utilisateur non trouvé.** Assurez-vous d'utiliser un ID valide ou de mentionner un utilisateur.");
    }
  }
  if (!member) {
    member = message.member;
  }

  const roles = member.roles ? member.roles.cache
    .filter(role => role.id !== message.guild.id)
    .map(role => role.name)
    .join(', ') || 'Aucun rôle' : 'Aucun rôle';

  const embed = new Discord.EmbedBuilder()
    .setTitle(`\`🔍\` ▸ Informations sur l'utilisateur : ${member.user.tag}`)
    .addFields(
      { name: '> ▸ 🆔 *ID*', value: member.id, inline: true },
      { name: '> ▸ 📅 *Créé le*', value: member.user.createdAt.toDateString(), inline: true },
      { name: '> ▸ 📅 *Arrivé le*', value: member.joinedAt ? member.joinedAt.toDateString() : 'Non applicable', inline: true },
      { name: '> ▸ 🟢 *Statut*', value: member.presence ? member.presence.status : 'Hors ligne', inline: true },
      { name: '> ▸ 🎮 *Activité*', value: member.presence?.activities.length > 0 ? member.presence.activities.map(activity => activity.name).join(', ') : 'Aucune', inline: true },
      { name: '> ▸ 👥 *Rôles*', value: roles, inline: false },
    )
    .setFooter({
      text: 'Overseer - github.com/xwqu', 
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setColor(config.color)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

  message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
}
