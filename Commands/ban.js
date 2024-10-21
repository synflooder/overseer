// Overseer By Kaguya

const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../config.json');
exports.help = {
  name: 'ban',
  aliases: ['bannir'],
  description: 'Bannit un membre du serveur.',
  use: 'ban @user ou ban <user_id>',
  category: 'moderation',
}
exports.run = async (bot, message, args, config) => {
  if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('`🚫` ▸ Vous n\'avez pas la permission de bannir des membres.');
    return message.reply({ embeds: [embed] });
  }
  const member = message.mentions.members.first();
  const userId = args[0] ? args[0].replace(/\D/g, '') : null;

  if (!member && !userId) {
    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setDescription('`⚠️` ▸ Veuillez mentionner un membre ou fournir son ID à bannir.');
    return message.reply({ embeds: [embed] });
  }

  const userToBan = member ? member.user : await bot.users.fetch(userId).catch(() => null);
  
  if (member && !member.bannable) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('`⚠️` ▸ *Je ne peux pas bannir ce membre. Il se peut qu\'il ait un rôle plus élevé que le mien.*');
    return message.reply({ embeds: [embed] });
  }

  try {
    await message.guild.bans.create(userToBan.id, { reason: `Banni par ${message.author.tag}` });
    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('`✅` ▸ Ban Effectué')
      .setDescription(`> ***${userToBan.tag}*** *a été banni.*`)
      .setFooter({
        text: 'Overseer - github.com/xwqu',
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });
    message.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Erreur lors du bannissement:', error);
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('`❌` ▸ **Je n\'ai pas pu bannir le membre. Vérifiez mes permissions ou assurez-vous que l\'ID est correct.**');
    message.reply({ embeds: [embed] });
  }
}
