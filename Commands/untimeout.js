// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
    name: 'untimeout',
    aliases: ['liftban', 'removeTimeout'],
    description: 'Lève le timeout d\'un utilisateur.',
    use: 'untimeout @user',
    category: 'moderation',
};

exports.run = async (bot, message, args) => {
    if (!message.member.permissions.has('MANAGE_ROLES')) {
        return message.reply('Vous n\'avez pas la permission de gérer les rôles.');
    }
    const member = message.mentions.members.first();
    if (!member) {
        return message.reply('Veuillez mentionner un utilisateur valide.');
    }
    if (!member.communicationDisabledUntil) {
        return message.reply('Cet utilisateur n\'a pas de timeout actif.');
    }
    try {
        await member.timeout(null);
        message.reply(`${member.user.tag} a été untimeout avec succes.`);
    } catch (error) {
        console.error('Erreur lors de la levée du timeout :', error);
        message.reply('Il y a eu une erreur lors de la levée du timeout. Vérifiez mes permissions et réessayez.');
    }
};
