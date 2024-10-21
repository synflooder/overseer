// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'love',
  aliases: ['amour'],
  description: 'Exprime ton amour.',
  use: 'love @utilisateur',
  category: 'fun',
};

exports.run = async (bot, message, args, config) => {
  const user = message.mentions.users.first() || message.author;

  const loves = [
    `> **❤️ ${message.author.username} aime ${user.username} !**`,
    `> **💞 ${message.author.username} est amoureux de ${user.username} !**`,
    `> **😍 ${message.author.username} a le béguin pour ${user.username} !**`,
  ];

  const randomLove = loves[Math.floor(Math.random() * loves.length)];

  const embed = new Discord.EmbedBuilder()
     .setTitle(`\`❤️\` ▸ Amour avec ${user.username}`)
    .setDescription(randomLove)
    .setColor(config.color)
    .setFooter({
      text: 'Overseer - github.com/xwqu',
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    });

  message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
};
