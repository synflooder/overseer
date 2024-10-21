// Overseer By Kaguya

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const config = require('../config.json');

let ticketConfig = {
  ticketCategory: '',
  enableClaimButton: false,
  embedColor: '#0099ff',
  ticketChannelId: '',
};
const activeTickets = new Set();
exports.help = {
  name: 'ticket',
  aliases: ['setticket'],
  description: 'Configurer le système de tickets avec un embed et des boutons.',
  use: 'ticket',
  category: 'gestions',
};

exports.run = async (bot, message) => {
  const embed = new EmbedBuilder()
    .setTitle('`🎫` ▸ Configurer le Système de Tickets')
    .setDescription('*Sélectionnez une option pour configurer le système de tickets.*')
    .setColor(config.color);

  const options = [
    new StringSelectMenuOptionBuilder().setLabel('🎫 ▸ Définir la catégorie').setValue('setcategory'),
    new StringSelectMenuOptionBuilder().setLabel('🎫 ▸ Activer/Désactiver le bouton de revendication').setValue('setclaim'),
    new StringSelectMenuOptionBuilder().setLabel('🎫 ▸ Définir la couleur de l\'embed').setValue('setcolor'),
    new StringSelectMenuOptionBuilder().setLabel('🎫 ▸ Définir le salon pour l\'embed').setValue('setchannel'),
    new StringSelectMenuOptionBuilder().setLabel('🎫 ▸ Terminer la configuration').setValue('finish'),
  ];

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('ticket_config')
    .setPlaceholder('🎫 ▸ Sélectionnez une option')
    .addOptions(options);

  const row = new ActionRowBuilder().addComponents(selectMenu);
  await message.channel.send({ embeds: [embed], components: [row] });
  const filter = i => i.customId === 'ticket_config' && i.user.id === message.author.id;
  const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 });

  collector.on('collect', async (interaction) => {
    switch (interaction.values[0]) {
      case 'setcategory':
        await interaction.reply('Veuillez entrer l\'ID de la catégorie où les tickets seront créés.');
        const categoryFilter = m => m.author.id === message.author.id;
        const categoryCollected = await message.channel.awaitMessages({ filter: categoryFilter, max: 1, time: 30000 });
        if (categoryCollected.size === 0) {
          return interaction.followUp('⏰ Temps écoulé. Commande annulée.');
        }
        const categoryId = categoryCollected.first().content;
        const categoryChannel = message.guild.channels.cache.get(categoryId);
        if (!categoryChannel || categoryChannel.type !== ChannelType.GuildCategory) {
          return interaction.followUp('🚫 Ce n\'est pas une catégorie valide.');
        }
        ticketConfig.ticketCategory = categoryId;
        await interaction.followUp(`✅ Catégorie des tickets mise à jour : <#${categoryChannel.id}>`);
        break;

      case 'setclaim':
        ticketConfig.enableClaimButton = !ticketConfig.enableClaimButton;
        await interaction.reply(`✅ Bouton de revendication ${ticketConfig.enableClaimButton ? 'activé' : 'désactivé'}.`);
        break;

      case 'setcolor':
        await interaction.reply('Veuillez entrer la couleur de l\'embed en hexadécimal (ex: #0099ff).');
        const colorFilter = m => m.author.id === message.author.id;
        const colorCollected = await message.channel.awaitMessages({ filter: colorFilter, max: 1, time: 30000 });
        if (colorCollected.size === 0) {
          return interaction.followUp('⏰ Temps écoulé. Commande annulée.');
        }
        const color = colorCollected.first().content;
        ticketConfig.embedColor = color;
        await interaction.followUp(`✅ Couleur de l'embed mise à jour : ${color}`);
        break;

      case 'setchannel':
        await interaction.reply('Veuillez entrer l\'ID ou mentionner le salon où l\'embed de création de ticket sera envoyé.');
        const channelFilter = m => m.author.id === message.author.id;
        const channelCollected = await message.channel.awaitMessages({ filter: channelFilter, max: 1, time: 30000 });
        if (channelCollected.size === 0) {
          return interaction.followUp('⏰ Temps écoulé. Commande annulée.');
        }
        const channelId = channelCollected.first().content.replace(/<#|>/g, '');
        const ticketChannel = message.guild.channels.cache.get(channelId);
        if (!ticketChannel || ticketChannel.type !== ChannelType.GuildText) {
          return interaction.followUp('🚫 Ce n\'est pas un salon valide.');
        }
        ticketConfig.ticketChannelId = ticketChannel.id;
        await interaction.followUp(`✅ Salon pour l'embed de ticket mis à jour : <#${ticketChannel.id}>`);
        break;

      case 'finish':
        collector.stop(); 
        await interaction.reply('✅ Configuration terminée.');
        break;
    }

    const configEmbed = new EmbedBuilder()
      .setTitle('`🎫` ▸ Configuration Actuelle des Tickets')
      .addFields(
        { name: '🎫 ▸ Catégorie des Tickets', value: ticketConfig.ticketCategory ? `<#${ticketConfig.ticketCategory}>` : 'Non définie' },
        { name: '🎫 ▸ Bouton de Revendication', value: ticketConfig.enableClaimButton ? 'Activé' : 'Désactivé' },
        { name: '🎫 ▸ Couleur de l\'Embed', value: ticketConfig.embedColor },
        { name: '🎫 ▸ Salon pour l\'Embed', value: ticketConfig.ticketChannelId ? `<#${ticketConfig.ticketChannelId}>` : 'Non défini' }
      )
      .setColor(config.color);

    await interaction.followUp({ embeds: [configEmbed], ephemeral: true });
  });

  collector.on('end', async (collected) => {
    if (collected.size === 0) {
      message.channel.send('⏰ Temps écoulé. Configuration annulée.');
    } else {
      if (ticketConfig.ticketChannelId) {
        const ticketChannel = bot.channels.cache.get(ticketConfig.ticketChannelId);
        if (!ticketChannel) {
          return message.channel.send('🚫 Salon pour l\'embed de ticket non trouvé.');
        }

        const ticketEmbed = new EmbedBuilder()
          .setTitle('`🔍` ▸ Créer un Ticket')
          .setDescription('*Cliquez sur le bouton ci-dessous pour créer un ticket.*')
          .setColor(ticketConfig.embedColor)
          .setFooter({ text: 'Overseer - github.com/xwqu', iconURL: message.author.displayAvatarURL({ dynamic: true }) });

        const openTicketButton = new ButtonBuilder()
          .setCustomId('open_ticket')
          .setLabel('🔍 ▸ Ouvrir un Ticket')
          .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(openTicketButton);
        ticketChannel.send({ embeds: [ticketEmbed], components: [row] });
      } else {
        message.channel.send('🚫 Salon pour l\'embed de ticket non défini. Utilisez `ticket setchannel` pour le définir.');
      }
    }
  });

  bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'open_ticket') {
      if (activeTickets.has(interaction.user.id)) {
        return interaction.reply({ content: '❌ Vous avez déjà un ticket ouvert. Fermez votre ticket actuel avant d\'en créer un nouveau.', ephemeral: true });
      }

      if (!ticketConfig.ticketCategory) {
        return interaction.reply({ content: '❌ La catégorie des tickets n\'est pas définie. Veuillez utiliser la commande `ticket setcategory`.', ephemeral: true });
      }

      const ticketName = `ticket-${interaction.user.username}-${Date.now()}`;
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: ChannelType.GuildText,
        parent: ticketConfig.ticketCategory,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ['ViewChannel'],
          },
          {
            id: interaction.user.id,
            allow: ['ViewChannel'],
          },
        ],
        topic: `Ticket ouvert par ${interaction.user.username}`,
      });

      const ticketEmbedMessage = new EmbedBuilder()
        .setTitle(`\`🔍\` ▸ Ticket ouvert par ${interaction.user.username}`)
        .setDescription(`*Merci d'avoir contacté le support. Un membre du staff va vous répondre dès que possible.*`)
        .setColor(ticketConfig.embedColor)
        .setFooter({ text: 'Overseer - github.com/xwqu', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
      const ticketRow = new ActionRowBuilder();
      if (ticketConfig.enableClaimButton) {
        const claimButton = new ButtonBuilder()
          .setCustomId('claim_ticket')
          .setLabel('✅ ▸ Revendiquer le Ticket')
          .setStyle(ButtonStyle.Success);
        ticketRow.addComponents(claimButton);
      }

      const closeButton = new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('❌ ▸ Fermer le Ticket')
        .setStyle(ButtonStyle.Danger);
      ticketRow.addComponents(closeButton);

      await ticketChannel.send({ embeds: [ticketEmbedMessage], components: [ticketRow] });
      activeTickets.add(interaction.user.id);
      await interaction.reply({ content: `✅ Votre ticket a été créé : ${ticketChannel}`, ephemeral: true });
    } else if (interaction.customId === 'close_ticket') {
      await interaction.reply({ content: 'Fermeture du ticket en cours...', ephemeral: true });
      const ticketChannel = interaction.channel;
      await ticketChannel.delete();
      activeTickets.delete(interaction.user.id);
    } else if (interaction.customId === 'claim_ticket') {
      await interaction.reply({ content: 'Ticket revendiqué.', ephemeral: true });
    }
  });
};
