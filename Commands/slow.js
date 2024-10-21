// Overseer By Kaguya

const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require("../config.json");

exports.help = {
  name: 'slowmode',
  aliases: ['mode-lent', "slow"],
  description: 'Active le mode lent dans le salon actuel.',
  use: 'slowmode <durée>',
  category: 'moderation',
}

exports.run = async (bot, message, args) => {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return message.reply('🚫 Vous n\'avez pas la permission de gérer les salons.');
  }

  const duration = parseInt(args[0]);

  if (isNaN(duration)) {
    return message.reply('❗ Veuillez spécifier une durée valide en secondes.');
  }

  try {
    await message.channel.setRateLimitPerUser(duration);
    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('`⏳` ▸ Mode Lent Activé')
      .setDescription(`Le mode lent a été activé pour **${duration} secondes** dans ce salon.`)
      .setFooter({
        text: 'Overseer - github.com/xwqu', 
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });

    message.channel.send({ embeds: [embed] });

  } catch (error) {
    console.error('Erreur lors de l\'activation du mode lent:', error);
    message.reply('❌ Une erreur est survenue lors de l\'activation du mode lent.');
  }
};
