// Overseer By Kaguya

const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require("../config.json")

exports.help = {
  name: 'create',
  aliases: ['copyemoji'],
  description: 'Copie des émojis d\'un autre serveur vers le serveur actuel.',
  use: 'create <emoji1> <emoji2> ...',
  category: 'utils',
};

exports.run = async (bot, message, args) => {
  const { guild } = message;

  if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
    return message.channel.send('Je n\'ai pas la permission de gérer les emojis dans ce serveur.');
  }

  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
    return message.channel.send('Vous n\'avez pas la permission de gérer les emojis.');
  }

  if (!args.length) {
    return message.channel.send('Veuillez fournir au moins un émoji à copier.');
  }

  const emojiRegex = /<a?:\w+:(\d+)>/;
  const failedEmojis = [];
  const successfulEmojis = [];

  for (const emoji of args) {
    const match = emoji.match(emojiRegex);

    if (!match) {
      failedEmojis.push(emoji);
      continue;
    }

    const emojiID = match[1];
    const emojiURL = `https://cdn.discordapp.com/emojis/${emojiID}.png`;
    const emojiName = emoji.split(':')[1];

    try {
      const createdEmoji = await guild.emojis.create({
        attachment: emojiURL,
        name: emojiName
      });

      successfulEmojis.push(createdEmoji);
    } catch (error) {
      console.error(`Erreur lors de la création de l'émoji ${emojiName}:`, error);
      failedEmojis.push(emoji);
    }
  }

  const embed = new EmbedBuilder()
    .setColor(config.color)
    .setTitle('Résultat de la copie des émojis')
    .setFooter("Overseer - github.com/xwqu")
    .setTimestamp();

  if (successfulEmojis.length > 0) {
    embed.addFields({
      name: 'Émojis copiés avec succès',
      value: successfulEmojis.map(e => `${e} : \`${e.name}\``).join('\n'),
      inline: false
    });
  }

  if (failedEmojis.length > 0) {
    embed.addFields({
      name: 'Émojis échoués',
      value: failedEmojis.join(', '),
      inline: false
    });
  }

  if (successfulEmojis.length === 0 && failedEmojis.length === 0) {
    embed.setDescription('Aucun émoji n\'a pu être copié.');
  }

  message.channel.send({ embeds: [embed] });
};
