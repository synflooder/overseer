// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'devinenombre',
  aliases: ['guessnumber', 'nombre'],
  description: 'Devine un nombre entre 1 et 10.',
  use: 'devinenombre',
  category: 'fun',
};

exports.run = async (bot, message, args, config) => {
  const numberToGuess = Math.floor(Math.random() * 10) + 1;

  const embed = new Discord.EmbedBuilder()
    .setTitle('Devine le nombre !')
    .setDescription(`Je pense à un nombre entre 1 et 10. Essaye de deviner !`)
    .setColor(config.color)
    .setFooter({
      text: 'Overseer - github.com/xwqu',
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    });

  const filter = (response) => {
    return response.author.id === message.author.id && !isNaN(response.content);
  };

  message.channel.send({ embeds: [embed] });
  
  const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });

  const userGuess = parseInt(collected.first().content);

  if (userGuess === numberToGuess) {
    message.channel.send(`Bravo ! Tu as deviné le bon nombre : ${numberToGuess} ! 🎉`);
  } else {
    message.channel.send(`Dommage ! Le nombre était : ${numberToGuess}.`);
  }
};
