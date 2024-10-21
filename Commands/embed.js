// Overseer By Kaguya

const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

exports.help = {
  name: 'embed',
  aliases: ['embed'],
  description: 'Crée un embed interactif.',
  use: 'createembed',
  category: 'gestions',
};

let embedData = {
  title: 'Titre par défaut',
  description: 'Ceci est une description par défaut.',
  color: '#ff0000',
  thumbnail: 'https://prnt.sc/T4lKzCZeCwJD',
  footer: { text: 'Texte de pied de page par défaut', icon: 'https://prnt.sc/T4lKzCZeCwJD' },
};

exports.run = async (bot, message, args) => {
  const initialEmbed = new EmbedBuilder()
    .setTitle('`🛠️` ▸ Création d\'embed')
    .setDescription('*Utilisez les boutons ci-dessous pour définir les champs de l\'embed.*')
    .addFields(
      { name: '> **Titre**', value: embedData.title },
      { name: '> **Description**', value: embedData.description },
      { name: '> **Couleur**', value: embedData.color },
      { name: '> **Thumbnail**', value: embedData.thumbnail || 'Non défini' },
      { name: '> **Footer Text**', value: embedData.footer.text },
      { name: '> **Footer Icon**', value: embedData.footer.icon || 'Non défini' }
    )
    .setColor(config.color);
  const buttonRow1 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder().setCustomId('setTitle').setLabel('📜 Définir le titre').setStyle('Primary'),
      new ButtonBuilder().setCustomId('setDescription').setLabel('📝 Définir la description').setStyle('Primary'),
      new ButtonBuilder().setCustomId('setColor').setLabel('🎨 Définir la couleur').setStyle('Primary'),
      new ButtonBuilder().setCustomId('setThumbnail').setLabel('🖼️ Définir le thumbnail').setStyle('Primary'),
      new ButtonBuilder().setCustomId('sendEmbed').setLabel('📤 Envoyer l\'embed').setStyle('Success')
    );

  const buttonRow2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder().setCustomId('setFooter').setLabel('🦶 Définir le footer').setStyle('Primary')
    );

  const msg = await message.reply({ embeds: [initialEmbed], components: [buttonRow1, buttonRow2] });

  const filter = (interaction) => interaction.user.id === message.author.id;
  const collector = msg.createMessageComponentCollector({ filter, time: 300000 });

  collector.on('collect', async (interaction) => {
    await interaction.deferUpdate();

    if (interaction.customId === 'setTitle') {
      const title = await promptUserInput(interaction, 'Veuillez entrer le **titre** de l\'embed :');
      if (title) embedData.title = title;
    } else if (interaction.customId === 'setDescription') {
      const description = await promptUserInput(interaction, 'Veuillez entrer la **description** de l\'embed :');
      if (description) embedData.description = description;
    } else if (interaction.customId === 'setColor') {
      const color = await promptUserInput(interaction, 'Veuillez entrer la **couleur** de l\'embed (en hexadécimal, ex: #ff0000) :');
      if (color) embedData.color = color;
    } else if (interaction.customId === 'setThumbnail') {
      const thumbnail = await promptUserInput(interaction, 'Veuillez entrer l\'URL du **thumbnail** ou envoyez une image :');
      if (thumbnail) embedData.thumbnail = thumbnail;
    } else if (interaction.customId === 'setFooter') {
      const footerText = await promptUserInput(interaction, 'Veuillez entrer le **texte** du footer :');
      const footerIcon = await promptUserInput(interaction, 'Veuillez entrer l\'URL de l\'**icône** du footer ou envoyez une image :');
      if (footerText) embedData.footer.text = footerText;
      if (footerIcon) embedData.footer.icon = footerIcon;
    } else if (interaction.customId === 'sendEmbed') {
      const channelId = await promptUserInput(interaction, 'Veuillez entrer l\'ID du salon où vous souhaitez envoyer l\'embed ou mentionnez-le :');
      const channel = interaction.guild.channels.cache.get(channelId) || interaction.mentions.channels.first();
      if (!channel) {
        await interaction.followUp('❌ Salon non trouvé. Veuillez vérifier l\'ID ou mentionner le salon.');
        return;
      }
      if (!embedData.title && !embedData.description) {
        await interaction.followUp('❌ Vous devez définir au moins un titre ou une description avant d\'envoyer l\'embed.');
        return;
      }
      const finalEmbed = new EmbedBuilder()
        .setTitle(embedData.title)
        .setDescription(embedData.description)
        .setColor(embedData.color)
        .setThumbnail(embedData.thumbnail || '')
        .setFooter({
          text: embedData.footer.text || 'Texte de pied de page par défaut',
          iconURL: embedData.footer.icon && embedData.footer.icon !== 'null' ? embedData.footer.icon : undefined
        });

      await channel.send({ embeds: [finalEmbed] });
      await interaction.reply('✅ L\'embed a été envoyé dans le salon spécifié !');
      collector.stop();
    }

    const updatedEmbed = new EmbedBuilder()
      .setTitle('`🛠️` ▸ Création d\'embed')
      .setDescription('*Utilisez les boutons ci-dessous pour définir les champs de l\'embed.*')
      .addFields(
        { name: '> **Titre**', value: embedData.title },
        { name: '> **Description**', value: embedData.description },
        { name: '> **Couleur**', value: embedData.color },
        { name: '> **Thumbnail**', value: embedData.thumbnail || 'Non défini' },
        { name: '> **Footer Text**', value: embedData.footer.text },
        { name: '> **Footer Icon**', value: embedData.footer.icon || 'Non défini' }
      )
      .setColor(config.color);

    await msg.edit({ embeds: [updatedEmbed], components: [buttonRow1, buttonRow2] });
  });

  collector.on('end', () => {
    msg.edit({ components: [] });
  });
};

async function promptUserInput(interaction, question) {
  await interaction.followUp(question);
  const filter = (response) => response.author.id === interaction.user.id;
  const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000 });

  if (collected.size > 0) {
    const content = collected.first().content;
    return content || collected.first().attachments.first()?.url;
  } else {
    await interaction.followUp('❌ Temps écoulé !');
    return null;
  }
}
