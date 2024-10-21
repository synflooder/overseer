// Overseer By Kaguya

const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const config = require("../config.json");

exports.run = async (client, message) => {
    const botAdmins = message.guild.members.cache.filter(member => member.user.bot && member.permissions.has(PermissionsBitField.Flags.Administrator));
    const botAdminList = botAdmins.map(bot => `<@${bot.id}> (${bot.id})`).join("\n") || "Aucun bot administrateur trouvé.";
    
    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle("`🤖` ▸ Liste des Bots Administrateurs")
        .setDescription(`**Voici la liste des bots administrateurs dans ce serveur :**\n>>> ${botAdminList}`)
        .setFooter({
            text: 'Overseer - github.com/xwqu', 
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        });
    
    message.channel.send({ embeds: [embed] });
};

exports.help = {
    name: 'allbotadmin',
    description: 'Affiche la liste des bots administrateurs dans le serveur.',
    usage: 'allbotadmin',
    category: "moderation"
};
