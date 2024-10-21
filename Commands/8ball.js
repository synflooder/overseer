// Overseer By Kaguya

const { EmbedBuilder } = require('discord.js');
const config = require("../config.json");

exports.help = {
  name: '8ball',
  aliases: ['magic8'],
  description: 'Pose une question et la Magic 8 Ball te répondra.',
  use: '8ball <question>',
  category: 'fun',
};

exports.run = async (bot, message, args) => {
  if (message) {
    const question = args.join(' ');

    if (!question) {
      return message.reply('❗ Veuillez poser une question.');
    }

    const responses = [
      'Oui.',
      'Non.',
      'Peut-être.',
      'Je ne sais pas.',
      'Absolument.',
      'C’est certain.',
      'Je ne peux pas le dire maintenant.',
    ];

    const answer = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('🎱 Réponse de la Magic 8 Ball')
      .setDescription(`> **Question:** ${question}\n> **Réponse:** ${answer}`)
      .setFooter({
        text: 'Overseer - github.com/xwqu',
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    await message.reply({ embeds: [embed] });
  } else if (interaction) {
    const question = interaction.options.getString('question');

    if (!question) {
      return interaction.reply('❗ Veuillez poser une question.');
    }

    const responses = [
      'Oui.',
      'Non.',
      'Peut-être.',
      'Je ne sais pas.',
      'Absolument.',
      'C’est certain.',
      'Je ne peux pas le dire maintenant.',
    ];

    const answer = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('🎱 Réponse de la Magic 8 Ball')
      .setDescription(`> **Question:** ${question}\n> **Réponse:** ${answer}`)
      .setFooter({
        text: 'Overseer - github.com/xwqu',
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    await interaction.reply({ embeds: [embed] });
  }
};
