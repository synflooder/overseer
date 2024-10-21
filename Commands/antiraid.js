const { Events, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionsBitField } = require('discord.js');
const config = require("../config.json");

const antiraidSettings = {
  antiLink: false,
  antiMassJoin: false,
  antiCustomServer: false,
  antiDelRole: false,
  antiAddRole: false,
  antiMassBan: false,
  antiMassKick: false,
  antiAddBot: false,
  antiLockInvite: false,
  antiSpam: false,
};

let joinCounts = {};
let originalInviteLink = '';
let spamCounts = {};
const isAntiRaidEnabled = (feature) => antiraidSettings[feature];

exports.help = {
  name: 'antiraid',
  aliases: ['anti-raid'],
  description: 'Gère les paramètres d\'anti-raid.',
  usage: 'antiraid',
  category: 'gestions',
};

exports.run = async (bot, message, args) => {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
    return message.reply('🚫 Vous n\'avez pas la permission de gérer les paramètres anti-raid.');
  }

  const embed = createEmbed(message.author);
  const menuOptions = [
    { value: 'antiLink', label: `🔗 Anti Link: ${antiraidSettings.antiLink ? '✅ Activé' : '❌ Désactivé'}` },
    { value: 'antiMassJoin', label: `👥 Anti Mass Join: ${antiraidSettings.antiMassJoin ? '✅ Activé' : '❌ Désactivé'}` },
    { value: 'antiCustomServer', label: `🏴 Anti Custom Server: ${antiraidSettings.antiCustomServer ? '✅ Activé' : '❌ Désactivé'}` },
    { value: 'antiDelRole', label: `❌ Anti Suppression de Rôle: ${antiraidSettings.antiDelRole ? '✅ Activé' : '❌ Désactivé'}` },
    { value: 'antiAddRole', label: `➕ Anti Ajout de Rôle: ${antiraidSettings.antiAddRole ? '✅ Activé' : '❌ Désactivé'}` },
    { value: 'antiMassBan', label: `🚫 Anti Mass Ban: ${antiraidSettings.antiMassBan ? '✅ Activé' : '❌ Désactivé'}` },
    { value: 'antiMassKick', label: `👢 Anti Mass Kick: ${antiraidSettings.antiMassKick ? '✅ Activé' : '❌ Désactivé'}` },
    { value: 'antiAddBot', label: `🤖 Anti Ajout de Bot: ${antiraidSettings.antiAddBot ? '✅ Activé' : '❌ Désactivé'}` },
    { value: 'antiLockInvite', label: `🔒 Lock URL: ${antiraidSettings.antiLockInvite ? '✅ Activé' : '❌ Désactivé'}` },
    { value: 'antiSpam', label: `🚫 Anti Spam: ${antiraidSettings.antiSpam ? '✅ Activé' : '❌ Désactivé'}` },
  ];

  const options = menuOptions.map(option => (
    new StringSelectMenuOptionBuilder()
      .setLabel(option.label)
      .setValue(option.value)
  ));

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('antiraid_select')
    .setPlaceholder('Choisissez une option...')
    .addOptions(options);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

  const filter = (interaction) => interaction.customId === 'antiraid_select' && interaction.user.id === message.author.id;

  const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

  collector.on('collect', async (interaction) => {
    const selectedValue = interaction.values[0];

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: '🚫 Vous n\'avez pas la permission de gérer les paramètres anti-raid.', ephemeral: true });
    }

    if (selectedValue in antiraidSettings) {
      antiraidSettings[selectedValue] = !antiraidSettings[selectedValue];
      const updatedEmbed = createEmbed(interaction.user);

      const updatedOptions = menuOptions.map(option => (
        new StringSelectMenuOptionBuilder()
          .setLabel(`${option.label.replace(/✅ Activé|❌ Désactivé/, antiraidSettings[option.value] ? '✅ Activé' : '❌ Désactivé')}`)
          .setValue(option.value)
      ));

      const updatedSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('antiraid_select')
        .setPlaceholder('Choisissez une option...')
        .addOptions(updatedOptions);

      const updatedRow = new ActionRowBuilder().addComponents(updatedSelectMenu);

      await interaction.update({ embeds: [updatedEmbed], components: [updatedRow] });
    }
  });

  collector.on('end', async () => {
    await sentMessage.edit({ components: [] });
  });

  bot.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot) return;

    if (isAntiRaidEnabled('antiSpam')) {
      spamCounts[msg.author.id] = (spamCounts[msg.author.id] || 0) + 1;

      if (spamCounts[msg.author.id] < 3) {
        if (spamCounts[msg.author.id] === 1) {
          await msg.channel.send(`⚠️ ${msg.author}, c'est votre premier avertissement pour spam! Veuillez ralentir.`);
        } else if (spamCounts[msg.author.id] === 2) {
          await msg.channel.send(`⚠️ ${msg.author}, c'est votre deuxième avertissement! Une troisième fois et vous serez expulsé.`);
        }
      } else if (spamCounts[msg.author.id] === 3) {
        await msg.delete();
        await msg.channel.send(`🚫 ${msg.author}, vous avez été expulsé pour spam!`);

        const member = msg.guild.members.cache.get(msg.author.id);
        if (member) {
          await member.kick('Spam détecté après 3 avertissements');
        }

        delete spamCounts[msg.author.id];
      }

      setTimeout(() => {
        delete spamCounts[msg.author.id];
      }, 30000);
    }

    if (isAntiRaidEnabled('antiLink')) {
      const linkPattern = /https?:\/\/[^\s]+|<(?:(?:ht|f)t(?:ps)?:\/\/)?(?:[\w\-]+\.)+[a-zA-Z]{2,6}(?:\/[^\s]*)?>|<ht\s*tp\s*:\s*\/\\%6c%69%65%6e\.%63%6f%6d>/i;

      if (linkPattern.test(msg.content)) {
        await msg.delete();
        msg.channel.send(`🚫 ${msg.author}, les liens ne sont pas autorisés ici.`);
      }
    }
  });

  bot.on(Events.GuildMemberAdd, async (member) => {
    if (isAntiRaidEnabled('antiMassJoin')) {
      const guildId = member.guild.id;
      joinCounts[guildId] = (joinCounts[guildId] || 0) + 1;

      setTimeout(() => {
        joinCounts[guildId] = 0;
      }, 60000);

      if (joinCounts[guildId] > 5) {
        const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_JOIN' });
        const logEntry = auditLogs.entries.first();

        if (logEntry) {
          const { executor } = logEntry;
          await member.guild.members.ban(executor, { reason: 'Anti-Mass Join Triggered' });
          member.guild.owner.send(`⚠️ Anti-Mass Join: ${executor.tag} a été banni pour avoir joint trop de membres rapidement.`);
        }
      }
    }

    if (isAntiRaidEnabled('antiAddBot') && member.user.bot) {
      await member.kick('Anti-Bot Add Triggered');
      member.guild.owner.send(`⚠️ Anti-Bot Add: ${member.user.tag} a été expulsé car les bots ne sont pas autorisés.`);
    }
  });

  bot.on(Events.GuildRoleDelete, async (role) => {
    if (isAntiRaidEnabled('antiDelRole')) {
      const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_DELETE' });
      const logEntry = auditLogs.entries.first();

      if (logEntry) {
        const { executor } = logEntry;
        await role.guild.members.ban(executor, { reason: 'Anti-Role Deletion Triggered' });
        role.guild.owner.send(`⚠️ Anti-Role Deletion: ${executor.tag} a été banni pour avoir supprimé un rôle.`);
      }
    }
  });

  bot.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
    if (isAntiRaidEnabled('antiAddRole')) {
      const auditLogs = await oldRole.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_UPDATE' });
      const logEntry = auditLogs.entries.first();

      if (logEntry) {
        const { executor } = logEntry;

        if (!oldRole.permissions.has(PermissionsBitField.Flags.Administrator) && newRole.permissions.has(PermissionsBitField.Flags.Administrator)) {
          await newRole.guild.members.ban(executor, { reason: 'Anti-Add Role Permissions Triggered' });
          newRole.guild.owner.send(`⚠️ Anti-Add Role: ${executor.tag} a été banni pour avoir ajouté des permissions administratives.`);
        }
      }
    }
  });
};

function createEmbed(author) {
  const embed = new EmbedBuilder()
    .setTitle('🛡️ Paramètres Anti-Raid')
    .setDescription('Sélectionnez une option ci-dessous pour activer ou désactiver les paramètres anti-raid.')
    .setColor('Blue')
    .setTimestamp()
    .setFooter({ text: `Demandé par ${author.username}`, iconURL: author.displayAvatarURL() });

  return embed;
}
