// Overseer By Kaguya

const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const config = require('../config.json');

exports.help = {
  name: 'dm',
  description: 'Envoyer un message personnalisé dans les DM d\'un utilisateur.',
  use: '+dm @utilisateur',
  category: 'utils',
};

exports.run = async (bot, message, args) => {
  if (!message.member.permissions.has('MANAGE_MESSAGES')) {
    return message.channel.send('❌ Vous devez avoir la permission de gérer les messages pour utiliser cette commande.');
  }
  const user = message.mentions.users.first();
  if (!user) return message.channel.send('❌ Mentionnez un utilisateur pour lui envoyer un message dans ses DM.');
  const configEmbed = new EmbedBuilder()
    .setTitle('`✉️` ▸ Configuration du DM')
    .setDescription('*Sélectionnez une option pour configurer l\'embed à envoyer.*')
    .setColor(config.color);
  const options = [
    new StringSelectMenuOptionBuilder().setLabel('✏️ ▸ Définir le titre').setValue('settitle'),
    new StringSelectMenuOptionBuilder().setLabel('📝 ▸ Définir la description').setValue('setdescription'),
    new StringSelectMenuOptionBuilder().setLabel('🖼️ ▸ Ajouter une image').setValue('setimage'),
    new StringSelectMenuOptionBuilder().setLabel('🔒 ▸ Envoyer en anonyme ?').setValue('setanonymous'),
    new StringSelectMenuOptionBuilder().setLabel('✉️ ▸ Envoyer le DM').setValue('senddm'),
  ];
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('dm_config')
    .setPlaceholder('✏️ ▸ Choisissez une option')
    .addOptions(options);
  const row = new ActionRowBuilder().addComponents(selectMenu);
  const configMsg = await message.channel.send({ embeds: [configEmbed], components: [row] });
  let embedTitle = '';
  let embedDescription = '';
  let embedImage = '';
  let isAnonymous = false;
  const filter = i => i.customId === 'dm_config' && i.user.id === message.author.id;
  const collector = configMsg.createMessageComponentCollector({ filter, time: 60000 });
  collector.on('collect', async interaction => {
    switch (interaction.values[0]) {
      case 'settitle':
        await interaction.reply('✏️ Entrez le titre de l\'embed :');
        const titleFilter = m => m.author.id === message.author.id;
        const titleCollected = await message.channel.awaitMessages({ filter: titleFilter, max: 1, time: 30000 });
        if (titleCollected.size === 0) return interaction.followUp('⏰ Temps écoulé. Commande annulée.');
        embedTitle = titleCollected.first().content;
        await interaction.followUp(`✅ Titre défini : **${embedTitle}**`);
        break;
      case 'setdescription':
        await interaction.reply('📝 Entrez la description de l\'embed :');
        const descriptionFilter = m => m.author.id === message.author.id;
        const descriptionCollected = await message.channel.awaitMessages({ filter: descriptionFilter, max: 1, time: 30000 });
        if (descriptionCollected.size === 0) return interaction.followUp('⏰ Temps écoulé. Commande annulée.');
        embedDescription = descriptionCollected.first().content;
        await interaction.followUp(`✅ Description définie : **${embedDescription}**`);
        break;
      case 'setimage':
        await interaction.reply('🖼️ Entrez l\'URL de l\'image ou envoyez une pièce jointe contenant l\'image :');
        const imageFilter = m => m.author.id === message.author.id;
        const imageCollected = await message.channel.awaitMessages({ filter: imageFilter, max: 1, time: 30000 });
        if (imageCollected.size === 0) return interaction.followUp('⏰ Temps écoulé. Commande annulée.');
        const attachment = imageCollected.first().attachments.first();
        if (attachment && attachment.contentType.startsWith('image/')) {
          embedImage = attachment.url;
          await interaction.followUp('✅ Image ajoutée via pièce jointe.');
        } else {
          const imageUrl = imageCollected.first().content;
          embedImage = imageUrl;
          await interaction.followUp('✅ Image ajoutée via URL.');
        }
        break;
      case 'setanonymous':
        isAnonymous = !isAnonymous;
        await interaction.reply(`✅ Message sera envoyé ${isAnonymous ? 'de manière anonyme' : 'avec votre nom'}.`);
        break;
      case 'senddm':
        if (!embedTitle && !embedDescription) return interaction.followUp('❌ Vous devez définir au moins un titre ou une description.');
        const dmEmbed = new EmbedBuilder()
          .setTitle(embedTitle)
          .setDescription(embedDescription)
          .setColor(config.color)
          .setFooter({ text: 'Overseer - github.com/xwqu', iconURL: message.author.displayAvatarURL({ dynamic: true }) });
        if (embedImage) dmEmbed.setImage(embedImage);
        if (!isAnonymous) dmEmbed.setFooter({ text: `Message envoyé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
        try {
          await user.send({ embeds: [dmEmbed] });
          await interaction.reply(`✉️ Message envoyé avec succès dans les DM de ${user.tag}.`);
        } catch (error) {
          await interaction.reply('❌ Impossible d\'envoyer le message dans les DM de cet utilisateur.');
        }
        collector.stop();
        break;
    }
  });

  collector.on('end', collected => {
    if (collected.size === 0) {
      configMsg.edit({ content: '⏰ Temps écoulé. Commande annulée.', components: [] });
    }
  });
};
