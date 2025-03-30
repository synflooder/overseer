// Overseer By Kaguya

const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');

exports.help = {
  name: 'fuck',
  aliases: ['insulter'],
  description: 'Insulte quelqu\'un (à utiliser avec précaution).',
  use: 'fuck @utilisateur',
  category: 'fun',
};

exports.run = async (bot, message, args, config) => {
  const user = message.mentions.users.first() || message.author;
  const insults = [
    `> **🤬 ${message.author.username} dit à ${user.username} : "Va te faire encule !"**`,
    `> **👎 ${message.author.username} n'aime pas ${user.username} !**`,
    `> **😠 ${message.author.username} est en colère contre ${user.username} !**`,
    `> **🔥 ${message.author.username} pense que ${user.username} devrait se calmer un peu !**`,
    `> **💥 ${user.username} vient de se faire détruire par ${message.author.username} !**`,
  ];
  const randomInsult = insults[Math.floor(Math.random() * insults.length)];
  const embed = new EmbedBuilder()
    .setTitle('`💢` ▸ Insulte')
    .setDescription(randomInsult)
    .setColor(config.color)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setFooter({
      text: 'Overseer - github.com/xwqu',
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();
  message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
};
