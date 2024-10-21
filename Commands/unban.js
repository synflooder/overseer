// Overseer By Kaguya

const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

exports.help = {
  name: 'unban',
  aliases: ['debannir'],
  description: 'Débanni un membre du serveur avec son ID.',
  use: 'unban <user_id>',
  category: 'moderation',
}

exports.run = async (bot, message, args, config) => {
  if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('`🚫` ▸ Vous n\'avez pas la permission de débannir des membres.');
    return message.reply({ embeds: [embed] });
  }

  const userId = args[0];
  if (!userId) {
    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setDescription('`⚠️` ▸ Veuillez fournir l\'ID d\'un membre à débannir.');
    return message.reply({ embeds: [embed] });
  }

  try {
    const user = await bot.users.fetch(userId);
    await message.guild.members.unban(userId);
    
    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('`✅` ▸ Débannissement Effectué')
      .setDescription(`> ***${user.tag}*** *a été débanni.*`)
      .setFooter({
        text: 'Overseer - github.com/xwqu',
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });
      
    return message.reply({ embeds: [embed] });
  } catch (error) {
    if (error.code === 50013) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('`❌` ▸ **Je n\'ai pas les permissions nécessaires pour débannir ce membre.**');
      return message.reply({ embeds: [embed] });
    } else if (error.code === 10026) {
      const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setDescription('`⚠️` ▸ **L\'utilisateur n\'est pas banni.**');
      return message.reply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setDescription('`❌` ▸ **Je n\'ai pas pu débannir le membre. Assurez-vous que l\'ID est correct et que le membre est banni.**');
    console.error('Erreur lors du débannissement:', error);
    return message.reply({ embeds: [embed] });
  }
}
