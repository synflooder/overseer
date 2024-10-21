// Overseer By Kaguya

const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../config.json');

exports.help = {
  name: 'renew',
  aliases: ['renouveller'],
  description: 'Renouvelle un salon en le supprimant et en le recréant avec les mêmes paramètres.',
  use: 'renew',
  category: 'moderation',
}

exports.run = async (bot, message, args) => {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return message.reply('🚫 Vous n\'avez pas la permission de gérer les salons.');
  }

  const channel = message.channel;
  const channelName = channel.name;
  const channelType = channel.type;
  const options = {
    name: channelName,
    type: channelType,
    topic: channel.topic,
    nsfw: channel.nsfw,
    parent: channel.parentId,
    permissionOverwrites: channel.permissionOverwrites.cache.map((overwrite) => ({
      id: overwrite.id,
      allow: overwrite.allow,
      deny: overwrite.deny
    })),
    rateLimitPerUser: channel.rateLimitPerUser,
    position: channel.position
  };

  try {
    const embed = new EmbedBuilder()
      .setTitle('`🔄`  ▸  Salon Renew')
      .setDescription(`> *Le salon **${channelName}** a été recréé avec succès. 🎉*`)
      .setColor(config.color)
      .setFooter({
        text: 'Overseer - github.com/xwqu', 
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });

    await channel.delete();
    const newChannel = await message.guild.channels.create(options);
    await newChannel.send({ embeds: [embed] });

  } catch (error) {
    console.error('Erreur lors du renouvellement du salon:', error);
    await message.reply("❌ Une erreur est survenue lors du renouvellement du salon.");
  }
};
