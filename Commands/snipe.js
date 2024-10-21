// Overseer By Kaguya

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { deletedMessages } = require('../Events/messageDelete.js');
const config = require("../config.json")

exports.help = {
  name: 'snipe',
  aliases: ['sn'],
  description: 'Affiche le dernier message supprimé dans le salon.',
  use: 'snipe',
  category: 'utils',
};

exports.run = async (bot, message, args) => {
  const { channel } = message;
  const messages = deletedMessages.get(channel.id);

  if (!messages || messages.length === 0) {
    return message.channel.send('Il n\'y a pas de messages supprimés dans ce salon.');
  }

  const lastMessage = messages[messages.length - 1];
  const author = lastMessage.author;
  if (!author) {
    return message.channel.send('L\'auteur du message supprimé n\'existe plus.');
  }
  const embed = new EmbedBuilder()
    .setColor(config.color)
    .setAuthor({
      name: author.username,
      iconURL: author.displayAvatarURL(),
    })
    .setDescription(`> ${lastMessage.content || 'Le message était vide.'}`)
    .setFooter({
      text: 'Overseer - github.com/xwqu', 
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp(lastMessage.timestamp);
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('delete_embed')
        .setLabel('Supprimer')
        .setStyle(ButtonStyle.Danger)
    );

  const snipeMessage = await message.channel.send({ embeds: [embed], components: [row] });
  const filter = i => i.customId === 'delete_embed' && i.user.id === message.author.id;
  const collector = snipeMessage.createMessageComponentCollector({ filter, time: 60000 });

  collector.on('collect', async i => {
    if (i.customId === 'delete_embed') {
      await snipeMessage.delete();
      await i.reply({ content: 'Suprimé avec succés', ephemeral: true });
    }
  });

  collector.on('end', collected => {
    if (collected.size === 0) {
      snipeMessage.edit({ components: [] });
    }
  });
};
