// Overseer By Kaguya

const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require("../config.json");

exports.help = {
  name: 'clear',
  aliases: ['purge'],
  description: 'Supprime un certain nombre de messages.',
  use: 'clear <nombre>',
  category: 'moderation',
};

exports.run = async (bot, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return message.reply('🚫 Vous n\'avez pas la permission de gérer les messages.');
  }
  const amount = parseInt(args[0]);
  if (isNaN(amount) || amount < 1 || amount > 100) {
    return message.reply('❗ Le nombre de messages à supprimer doit être compris entre 1 et 100.');
  }

  try {
    await message.channel.bulkDelete(amount, true);
    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setDescription(`> 🧹 **J'ai supprimé \`${amount}\` messages.**`)
      .setFooter({
        text: 'Overseer - github.com/xwqu', 
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });

    const replyMessage = await message.channel.send({ embeds: [embed] });
    setTimeout(() => replyMessage.delete(), 5000);
    
  } catch (error) {
    console.error(error);
    message.reply('❌ Une erreur est survenue lors de la suppression des messages.');
  }
};
