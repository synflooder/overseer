// Overseer By Kaguya

exports.help = {
    name: 'close',
    aliases: ['ticketclose'],
    description: 'Fermer le ticket.',
    use: 'close',
    category: 'gestions',
  };
  
  exports.run = async (bot, message) => {
    const ticketChannel = message.channel;
    if (!ticketChannel.name.startsWith('ticket-')) {
      return message.reply('🚫 Cette commande ne peut être utilisée que dans un salon de ticket.');
    }
    const confirmationMessage = await message.channel.send('Êtes-vous sûr de vouloir fermer ce ticket ? (Répondez par "oui" ou "non")');
  
    const filter = response => {
      return ['oui', 'non'].includes(response.content.toLowerCase()) && response.author.id === message.author.id;
    };
    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
      .then(async collected => {
        const response = collected.first();
        if (response.content.toLowerCase() === 'oui') {
          await ticketChannel.delete();
          message.channel.send('✅ Le ticket a été fermé avec succès.');
        } else {
          message.channel.send('❌ Fermeture du ticket annulée.');
        }
      })
      .catch(() => {
        confirmationMessage.delete();
        message.channel.send('⏰ Temps écoulé. Fermeture du ticket annulée.');
      });
  };
  