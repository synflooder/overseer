const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ChannelType } = require('discord.js');
const config = require('../config.json');

// Overseer By Kaguya

const logsConfig = {
  message_logs: '',
  moderation_logs: '',
  voice_logs: '',
  raid_logs: '',
};

exports.help = {
  name: 'setlogs',
  aliases: ['configlogs'],
  description: 'Configurer les salons de logs pour les messages, modération, voix, et raid.',
  use: 'setlogs',
  category: 'gestions',
};

exports.run = async (bot, message) => {
  const embed = new EmbedBuilder()
    .setTitle('`👆` ▸ Configuration des Salons de Logs')
    .setDescription('*Sélectionnez un type de log à configurer.*')
    .setColor(config.color)
    .setFooter({ text: 'Overseer - github.com/xwqu', iconURL: message.author.displayAvatarURL({ dynamic: true }) });

  const menu = new StringSelectMenuBuilder()
    .setCustomId('setlogs-menu')
    .setPlaceholder('👆 ▸ Choisissez une option...')
    .addOptions([
      { label: '> Logs de Messages', description: 'Configurer le salon pour les logs de messages.', value: 'message_logs' },
      { label: '> Logs de Modération', description: 'Configurer le salon pour les logs de modération.', value: 'moderation_logs' },
      { label: '> Logs de Voix', description: 'Configurer le salon pour les logs vocaux.', value: 'voice_logs' },
      { label: '> Logs de Raid', description: 'Configurer le salon pour les logs de raid.', value: 'raid_logs' },
    ]);

  const row = new ActionRowBuilder().addComponents(menu);

  const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

  const filter = i => i.user.id === message.author.id;
  const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

  collector.on('collect', async interaction => {
    if (!interaction.isStringSelectMenu()) return;
    const selected = interaction.values[0];
    await interaction.reply({ content: `Veuillez mentionner un salon pour les ${selected.replace('_', ' ')}.`, ephemeral: true });

    const responseFilter = response => response.author.id === message.author.id;
    const collected = await message.channel.awaitMessages({ filter: responseFilter, max: 1, time: 30000 });
    
    if (collected.size === 0) {
      return interaction.followUp({ content: '⏰ Temps écoulé. Commande annulée.', ephemeral: true });
    }
    const channelMention = collected.first().content.trim();
    let channelId;
    if (collected.first().mentions.channels.size > 0) {
      channelId = collected.first().mentions.channels.first().id;
    } else if (channelMention.startsWith('<#') && channelMention.endsWith('>')) {
      channelId = channelMention.slice(2, -1);
    } else {
      channelId = channelMention;
    }
    const channel = await message.guild.channels.fetch(channelId).catch(() => null);
    if (!channel || channel.type !== ChannelType.GuildText) {
      return interaction.followUp({ content: '🚫 Ce n\'est pas un salon texte valide.', ephemeral: true });
    }
    logsConfig[selected] = channelId;

    interaction.followUp({ content: `✅ Salon pour les ${selected.replace('_', ' ')} mis à jour avec succès !`, ephemeral: true });
    
  });

  collector.on('end', () => {
    sentMessage.edit({ components: [] });
  });


  bot.on('messageCreate', async msg => {
    if (logsConfig.message_logs && !msg.author.bot) {
      const logChannel = bot.channels.cache.get(logsConfig.message_logs);
      if (logChannel) {
        const embedMessage = new EmbedBuilder()
          .setColor(config.color)
          .setTitle('*Nouveau Message*')
          .addFields(
            { name: '> **Utilisateur**:', value: msg.author.tag, inline: true },
            { name: '> **Message**:', value: msg.content || 'Aucun contenu', inline: true }
          )
          .setFooter({
            text: 'Overseer - github.com/xwqu', 
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          })
        logChannel.send({ embeds: [embedMessage] });
      }
    }
  });

  bot.on('messageDelete', async msg => {
    if (logsConfig.message_logs) {
      const logChannel = bot.channels.cache.get(logsConfig.message_logs);
      if (logChannel) {
        const embedMessage = new EmbedBuilder()
          .setColor(config.color)
          .setTitle('*Message Supprimé*')
          .addFields(
            { name: '> **Utilisateur**', value: msg.author.tag, inline: true },
            { name: '> **Message**', value: msg.content || 'Aucun contenu', inline: true }
          )
          .setFooter({
            text: 'Overseer - github.com/xwqu', 
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          })
        logChannel.send({ embeds: [embedMessage] });
      }
    }
  });

  const logModerationAction = (action, user) => {
    const logChannel = bot.channels.cache.get(logsConfig.moderation_logs);
    if (logChannel) {
      const embedMessage = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(`*Action de Modération*: ${action}`)
        .addFields(
          { name: '> **Utilisateur**', value: user.tag, inline: true }
        )
        .setFooter({
          text: 'Overseer - github.com/xwqu', 
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
      logChannel.send({ embeds: [embedMessage] });
    }
  };

  bot.on('guildMemberBan', member => logModerationAction('Ban', member.user));
  bot.on('guildMemberUnban', async (guild, user) => logModerationAction('Unban', user));
  bot.on('guildMemberKick', member => logModerationAction('Kick', member.user));
  bot.on('guildMemberMute', member => logModerationAction('Mute', member.user));
  bot.on('guildMemberUnmute', member => logModerationAction('Unmute', member.user));
  bot.on('guildMemberTimeout', member => logModerationAction('Timeout', member.user));
  bot.on('guildMemberUntimeout', member => logModerationAction('Untimeout', member.user));

  bot.on('voiceStateUpdate', (oldState, newState) => {
    const logChannel = bot.channels.cache.get(logsConfig.voice_logs);
    if (logChannel) {
      if (oldState.channelId === null && newState.channelId !== null) {
        const embedMessage = new EmbedBuilder()
          .setColor(config.color)
          .setTitle('*Rejoint un Salon Vocal*')
          .addFields(
            { name: '> **Utilisateur**:', value: newState.member.user.tag, inline: true },
            { name: '> **Salon**:', value: newState.channel.name, inline: true }
          )
          .setFooter({
            text: 'Overseer - github.com/xwqu', 
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          })
        logChannel.send({ embeds: [embedMessage] });
      } else if (oldState.channelId !== null && newState.channelId === null) {
        const embedMessage = new EmbedBuilder()
          .setColor(config.color)
          .setTitle('*Quitte un Salon Vocal*')
          .addFields(
            { name: '> **Utilisateur**:', value: newState.member.user.tag, inline: true },
            { name: '> **Salon**:', value: oldState.channel.name, inline: true }
          )
          .setFooter({
            text: 'Overseer - github.com/xwqu', 
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          })
        logChannel.send({ embeds: [embedMessage] });
      }
    }
  });

  const logRaidAction = (action, details) => {
    const logChannel = bot.channels.cache.get(logsConfig.raid_logs);
    if (logChannel) {
      const embedMessage = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(`*Action de Raid*: ${action}`)
        .addFields(
          { name: '> **Détails**', value: details }
        )
        .setFooter({
          text: 'Overseer - github.com/xwqu', 
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
      logChannel.send({ embeds: [embedMessage] });
    }
  };
  bot.on('guildUpdate', (oldGuild, newGuild) => {
    logRaidAction('*Mise à jour du serveur*', `> **Nom**: **${newGuild.name}**\n > **ID**: **${newGuild.id}**`);
  });

  bot.on('channelCreate', channel => {
    logRaidAction('*Création de Salon*', `> **Salon**: **${channel.name}**\n > **ID**: **${channel.id}**`);
  });

  bot.on('channelDelete', channel => {
    logRaidAction('*Suppression de Salon*', `> **Salon**: **${channel.name}**\n > **ID**: **${channel.id}**`);
  });

  bot.on('guildBanAdd', (guild, user) => {
    logRaidAction('*Bot Banni*', `> **Utilisateur**: **${user.tag}**\n > **ID**: **${user.id}**`);
  });

  bot.on('guildBanRemove', (guild, user) => {
    logRaidAction('*Bot Ajouté*', `> **Utilisateur**: **${user.tag}**\n > **ID**: **${user.id}**`);
  });
};
