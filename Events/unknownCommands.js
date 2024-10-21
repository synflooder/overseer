// Overseer By Kaguya

const { EmbedBuilder } = require('discord.js');
const config = require("../config.json");

module.exports = {
  name: 'unknownCommand',
  async execute(message) {
    const prefix = config.prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName);
    if (!command) {
      const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle('`❌` ▸  Commande non reconnue')
        .setDescription(`> **La commande \`${commandName}\` n'existe pas.**`)
        .setFooter({ 
          text: `Tapez \`${prefix}help\` pour voir la liste des commandes.`,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        });

      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
  },
};
