// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'hug',
  aliases: ['câlin'],
  description: 'Fais un câlin à quelqu\'un.',
  use: 'hug @utilisateur',
  category: 'fun',
};

exports.run = async (bot, message, args, config) => {
  const user = message.mentions.users.first() || message.author;

  const hugs = [
    `> **🤗 ${message.author.username} fait un câlin à ${user.username} !**`,
    `> **💕 ${message.author.username} prend ${user.username} dans ses bras !**`,
    `> **🥰 ${message.author.username} enveloppe ${user.username} d'amour !**`,
  ];

  const randomHug = hugs[Math.floor(Math.random() * hugs.length)];

  const embed = new Discord.EmbedBuilder()
    .setTitle('`🤗` ▸ Calin')
    .setDescription(randomHug)
    .setColor(config.color)
    .setFooter({
      text: 'Overseer - github.com/xwqu',
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    });

  message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
};
