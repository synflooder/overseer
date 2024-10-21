// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'slap',
  aliases: ['gifler'],
  description: 'Donne une gifle à quelqu\'un.',
  use: 'slap @utilisateur',
  category: 'fun',
};

exports.run = async (bot, message, args, config) => {
  const user = message.mentions.users.first() || message.author;

  const slaps = [
    `> **👋 ${message.author.username} gifle ${user.username} !**`,
    `> **😡 ${message.author.username} a donné une claque à ${user.username} !**`,
    `> **😂 ${message.author.username} a donné une bonne claque à ${user.username} !**`,
  ];

  const randomSlap = slaps[Math.floor(Math.random() * slaps.length)];

  const embed = new Discord.EmbedBuilder()
    .setTitle('`👏` ▸ Gifle')
    .setDescription(randomSlap)
    .setColor(config.color)
    .setFooter({
      text: 'Overseer - github.com/xwqu',
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    });

  message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
};
