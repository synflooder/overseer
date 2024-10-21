// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'setname',
  aliases: ['name'],
  description: 'Change le nom du bot.',
  use: 'setname <nom>',
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

  const newName = args.join(' ');
  if (!newName) {
    const embedNoName = new Discord.EmbedBuilder()
      .setColor('#FF0000')
      .setFooter({ text: 'Overseer - github.com/xwqu' })
      .setDescription('❌ Veuillez spécifier un nouveau nom.');

    return message.reply({ embeds: [embedNoName], allowedMentions: { repliedUser: false } });
  }

  try {
    await bot.user.setUsername(newName);
    const embedSuccess = new Discord.EmbedBuilder()
      .setColor(config.color)
      .setFooter({ text: 'Overseer - github.com/xwqu' })
      .setDescription(`✅ Le nom du bot a été changé en **${newName}**.`);

    message.reply({ embeds: [embedSuccess], allowedMentions: { repliedUser: false } });
  } catch (error) {
    console.error(error);
    const embedError = new Discord.EmbedBuilder()
      .setColor('#FF0000')
      .setFooter({ text: 'Overseer - github.com/xwqu' })
      .setDescription('❌ Une erreur est survenue lors du changement de nom.');

    message.reply({ embeds: [embedError], allowedMentions: { repliedUser: false } });
  }
};
