// Overseer By KaguyaS

const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const config = require("../config.json");

exports.run = async (client, message) => {
    const admins = message.guild.members.cache.filter(member => member.permissions.has(PermissionsBitField.Flags.Administrator));
    const adminList = admins.map(admin => `<@${admin.id}> (${admin.id})`).join("\n") || "Aucun administrateur trouvé.";
    
    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle("`👑` ▸ Liste des Administrateurs")
        .setDescription(`**Voici la liste des administrateurs dans ce serveur :**\n>>> ${adminList}`)
        .setFooter({
            text: 'Overseer - github.com/xwqu', 
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        });
    
    message.channel.send({ embeds: [embed] });
};

exports.help = {
    name: "alladmin",
    description: "Affiche la liste des administrateurs du serveur.",
    use: 'alladmin',
    category: 'moderation',
};
