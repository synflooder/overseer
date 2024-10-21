// Overseer By Kaguya

const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

exports.help = {
  name: 'info',
  aliases: ['infos', 'botinfo'],
  description: 'Affiche des informations sur le bot.',
  category: 'utils',
};

exports.run = async (bot, message, args, config) => {
  const infoEmbed = new EmbedBuilder()
    .setTitle(`\`🛠️\` ▸ Informations sur le bot 🐾`)
    .setDescription('*Voici quelques détails concernant le bot.*')
    .setColor(config.color)
    .addFields(
      { name: '> ▸ 👨‍💻 **Développeur**', value: 'Kaguya : <@1284206341438832663>', inline: true },
      { name: '> ▸ 🔧 **Version du bot**', value: '1.0.0', inline: true },
      { name: '> ▸ 📚 **Librairie utilisée**', value: 'Discord.js', inline: true },
      { name: '> ▸ 🌐 **Serveurs**', value: `${bot.guilds.cache.size}`, inline: true },
      { name: '> ▸ 👥 **Utilisateurs**', value: `${bot.users.cache.size}`, inline: true },
      { name: '> ▸ 📅 **Date de création**', value: new Date(bot.user.createdTimestamp).toLocaleDateString(), inline: true }
    )
    .setThumbnail(bot.user.displayAvatarURL())
    .setFooter({
        text: 'Overseer - github.com/xwqu', 
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
  await message.reply({ embeds: [infoEmbed], allowedMentions: { repliedUser: false } });
};
