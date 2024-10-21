// Overseer By Kaguya

exports.help = {
    name: 'say',
    description: 'Permet de faire dire un message au bot.',
    use: 'say <message>',
    category: 'fun',
};

exports.run = async (bot, message, args) => {
    if (args.length === 0) {
        return message.reply('Veuillez fournir un message à envoyer.');
    }
    const sayMessage = args.join(' ');
    await message.delete().catch(err => console.error('Impossible de supprimer le message :', err));
    message.channel.send(sayMessage);
};
