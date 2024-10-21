// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'setavatar',
  aliases: ['avatar'],
  description: 'Change l\'avatar du bot.',
  use: 'setavatar [fichier d\'image]',
  category: 'bot',
};

exports.run = async (bot, message, args, config) => {
  if (!config.owners.includes(message.author.id)) {
    const embedNotOwner = new Discord.EmbedBuilder()
      .setColor('#FF0000')
      .setFooter({ text: 'Overseer - github.com/xwqu' })
      .setDescription('❌ Seuls les propriétaires du bot peuvent utiliser cette commande.');

    return message.reply({ embeds: [embedNotOwner], allowedMentions: { repliedUser: false } });
  }

  const attachment = message.attachments.first();
  if (!attachment) {
    const embedNoAttachment = new Discord.EmbedBuilder()
      .setColor('#FF0000')
      .setFooter({ text: 'Overseer - github.com/xwqu' })
      .setDescription('❌ Veuillez joindre un fichier d\'image à votre message.');

    return message.reply({ embeds: [embedNoAttachment], allowedMentions: { repliedUser: false } });
  }
  const imageUrl = attachment.url;
  const cleanUrl = imageUrl.split('?')[0];
  const validImageFormats = ['.png', '.jpg', '.jpeg', '.gif'];
  const isValidImage = validImageFormats.some((format) =>
    cleanUrl.toLowerCase().endsWith(format)
  );
  if (!isValidImage) {
    const embedInvalidFormat = new Discord.EmbedBuilder()
      .setColor('#FF0000')
      .setFooter({ text: 'Overseer - github.com/xwqu' })
      .setDescription('❌ Le fichier joint doit être une image (PNG, JPG, JPEG, GIF).');

    return message.reply({ embeds: [embedInvalidFormat], allowedMentions: { repliedUser: false } });
  }

  try {
    await bot.user.setAvatar(imageUrl);
    const embedSuccess = new Discord.EmbedBuilder()
      .setColor(config.color)
      .setFooter({ text: 'Overseer - github.com/xwqu' })
      .setDescription('✅ L\'avatar du bot a été changé avec succès.');

    message.reply({ embeds: [embedSuccess], allowedMentions: { repliedUser: false } });
  } catch (error) {
    console.error(error);
    const embedError = new Discord.EmbedBuilder()
      .setColor('#FF0000')
      .setFooter({ text: 'Overseer - github.com/xwqu' })
      .setDescription('❌ Une erreur est survenue lors du changement d\'avatar.');

    message.reply({ embeds: [embedError], allowedMentions: { repliedUser: false } });
  }
};
