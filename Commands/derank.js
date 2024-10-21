// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
    name: 'derank',
    aliases: ['retirerrole'],
    description: 'Retire un rôle à un utilisateur (par mention ou par ID).',
    use: 'derank <userID> <roleID|all>',
    category: 'utils',
};

exports.run = async (bot, message, args) => {
    if (!message.member.permissions.has('MANAGE_ROLES')) {
        return message.reply('Vous n\'avez pas la permission de gérer les rôles.');
    }

    const userID = args[0];
    const member = message.guild.members.cache.get(userID) || await message.guild.members.fetch(userID).catch(() => null);

    if (!member) {
        return message.reply('Veuillez fournir un user valide.');
    }

    if (args[1] && args[1].toLowerCase() === 'all') {
        try {
            const rolesToRemove = member.roles.cache.filter(role => role.name !== '@everyone');
            await member.roles.remove(rolesToRemove);
            return message.reply(`Tous les rôles ont été retirés à <@${member.id}>, sauf le rôle @everyone.`);
        } catch (error) {
            console.error('Erreur lors de la suppression des rôles :', error);
            return message.reply('Il y a eu une erreur en essayant de retirer tous les rôles. Vérifiez mes permissions et la hiérarchie des rôles.');
        }
    }

    const roleID = args[1];
    const role = message.guild.roles.cache.get(roleID);

    if (!role) {
        return message.reply('Veuillez spécifier un ID de rôle valide à retirer.');
    }

    if (message.guild.me.roles.highest.position <= role.position) {
        return message.reply('Je ne peux pas retirer ce rôle, car il est plus élevé que mon rôle.');
    }
    if (!member.roles.cache.has(role.id)) {
        return message.reply(`${member.user.tag} n'a pas le rôle ${role.name}.`);
    }

    try {
        await member.roles.remove(role);
        message.reply(`${member.user.tag} a perdu le rôle ${role.name} avec succès.`);
    } catch (error) {
        console.error('Erreur lors de la suppression du rôle :', error);
        message.reply('Il y a eu une erreur en essayant de retirer le rôle. Vérifiez mes permissions et la hiérarchie des rôles.');
    }
};
