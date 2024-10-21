// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'kiss',
  aliases: ['embrasser'],
  description: 'Embrasse quelqu\'un.',
  use: 'kiss @utilisateur',
  category: 'fun',
};

exports.run = async (bot, message, args, config) => {
  const user = message.mentions.users.first() || message.author;

  const kisses = [
    `> **💋 ${message.author.username} embrasse ${user.username} !**`,
    `> **💖 ${message.author.username} donne un bisou à ${user.username} !**`,
    `> **😘 ${message.author.username} fait un câlin à ${user.username} !**`,
  ];

  const randomKiss = kisses[Math.floor(Math.random() * kisses.length)];

  const embed = new Discord.EmbedBuilder()
    .setTitle("`😘` ▸ Bisous")
    .setDescription(randomKiss)
    .setColor(config.color)
    .setFooter({
      text: 'Overseer - github.com/xwqu',
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    });

  message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
};
