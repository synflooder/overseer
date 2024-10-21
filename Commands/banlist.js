// Overseer By Kaguya

const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

exports.run = async (client, message) => {
    const bans = await message.guild.bans.fetch();
    const banList = bans.map(ban => `<@${ban.user.id}> (${ban.user.id})`).join("\n") || "Aucun utilisateur banni.";

    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle("`📍` ▸ Liste des Utilisateurs Bannis")
        .setDescription(`**Voici la liste des utilisateurs actuellement bannis :**\n> ${banList}`)
        .setFooter({
            text: 'Overseer - github.com/xwqu', 
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          });
    
    message.channel.send({ embeds: [embed] });
};

exports.help = {
    name: "banlist",
    description: "Affiche la liste des utilisateurs bannis.",
    category: "moderation"
};
