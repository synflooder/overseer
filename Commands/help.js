// Overseer By Kaguya

const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const config = require("../config.json");

exports.help = {
  name: 'help',
  aliases: ['h'],
  description: 'Affiche la liste des commandes ou des informations sur une commande spécifique.',
  use: 'help [commande]',
  category: 'utils',
};

exports.run = async (bot, message, args) => {
  const commands = bot.commands;
  let commandList = {
    'moderation': new Set(),
    'utils': new Set(),
    'gestions': new Set(),
    'bot': new Set(),
    'fun': new Set(),
    'autres': new Set(),
  };

  commands.forEach((command) => {
    const category = command.help.category ? command.help.category.toLowerCase() : 'autres';
    const aliases = Array.isArray(command.help.aliases) ? command.help.aliases.join(', ') : 'Aucun';
    const commandDisplay = `> \`${config.prefix}${command.help.name}\` / alias : \`${aliases}\``;

    if (commandList[category]) {
      commandList[category].add(`${commandDisplay}\n*${command.help.description}*`);
    } else {
      console.error(`La catégorie ${category} n'existe pas dans commandList.`);
    }
  });

  Object.keys(commandList).forEach((key) => {
    commandList[key] = Array.from(commandList[key]);
  });

  const categories = Object.keys(commandList).filter(category => commandList[category].length > 0).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1));

  const generateEmbed = (page) => {
    const category = categories[page].toLowerCase();
    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle(`Commandes - ${category.charAt(0).toUpperCase() + category.slice(1)}`)
      .setDescription(commandList[category].join('\n\n'))
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setFooter({ 
        text: `Page ${page + 1} sur ${categories.length} - Overseer`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });

    return embed;
  };

  let currentPage = 0;
  const embed = generateEmbed(currentPage);

  const selectMenuOptions = categories.map((category, index) => 
    new StringSelectMenuOptionBuilder()
      .setLabel(category)
      .setValue(index.toString())
  );

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('page_select')
    .setPlaceholder('Choisissez une page...')
    .addOptions(selectMenuOptions);

  const row = new ActionRowBuilder().addComponents(selectMenu);
  const msg = await message.channel.send({ embeds: [embed], components: [row] });
  const collector = msg.createMessageComponentCollector({ time: 60000 });

  collector.on('collect', async (interaction) => {
    if (interaction.customId === 'page_select') {
      currentPage = parseInt(interaction.values[0]);
      const updatedEmbed = generateEmbed(currentPage);
      const updatedRow = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.update({ embeds: [updatedEmbed], components: [updatedRow] });
    }
  });

  collector.on('end', () => {
    const disabledRow = new ActionRowBuilder().addComponents(selectMenu.setDisabled(true));
    msg.edit({ components: [disabledRow] });
  });
};
