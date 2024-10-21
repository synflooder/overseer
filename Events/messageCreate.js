// Overseer By Kaguya

const Discord = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, bot, config) {
    try {
      if (!message.guild || message.author.bot) return;
      const sendPrefixEmbed = () => {
        const embed = new Discord.EmbedBuilder()
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setTitle('`🪄` ▸ Prefix')
          .setDescription(`> *Le préfixe du bot est \`${config.prefix}\`.*`)
          .setFooter({
            text: 'Overseer - github.com/xwqu', 
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          })
          .setColor(config.color)
        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      };
      const isBotMentioned = message.content.startsWith(`<@${bot.user.id}>`);
      const prefixUsed = message.content.startsWith(config.prefix);

      let args, commandName;
      
      if (isBotMentioned || prefixUsed) {
        const commandPrefix = isBotMentioned ? `<@${bot.user.id}>` : config.prefix;
        args = message.content.slice(commandPrefix.length).trim().split(/ +/);
        commandName = args.shift()?.toLowerCase();
        if (!commandName) {
          return sendPrefixEmbed();
        }
        const commandFile = bot.commands.get(commandName);
        if (!commandFile) {
          return sendPrefixEmbed();
        }
        await commandFile.run(bot, message, args, config);
      }
    } catch (e) {
      console.error('Error in messageCreate event:', e);
      message.reply('Une erreur est survenue lors du traitement de votre commande.');
    }
  },
};
