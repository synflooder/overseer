// Overseer By Kaguya

const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require("../config.json");

exports.help = {
  name: 'kick',
  aliases: ['expulser'],
  description: 'Expulse un membre du serveur.',
  use: 'kick @user',
  category: 'moderation',
};

exports.run = async (bot, message, args) => {
  if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
    return message.reply('🚫 Vous n\'avez pas la permission d\'expulser des membres.');
  }
  const member = message.mentions.members.first();
  if (!member) {
    return message.reply('❗ Veuillez mentionner un membre à expulser.');
  }
  if (!member.kickable) {
    return message.reply('❌ Je ne peux pas expulser ce membre. Il se peut qu\'il ait des permissions plus élevées ou égales aux miennes.');
  }
  try {
    await member.kick();
    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setDescription(`> 🔨 **${member.user.tag} a été expulsé(e) avec succès.**`);

    await message.channel.send({ embeds: [embed] });

  } catch (error) {
    console.error(error);
    message.reply('❌ Une erreur est survenue lors de l\'expulsion du membre.');
  }
};
