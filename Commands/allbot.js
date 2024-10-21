// Overseer By Kaguya

const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

exports.run = async (client, message) => {
    const bots = message.guild.members.cache.filter(member => member.user.bot);
    const botList = bots.map(bot => `<@${bot.id}> (${bot.id})`).join("\n") || "Aucun bot trouvé.";
    
    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle("`🤖` ▸ Liste des Bots")
        .setDescription(`**Voici la liste des bots dans ce serveur :**\n>>> ${botList}`)
        .setFooter({
            text: 'Overseer - github.com/xwqu', 
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        });
    
    message.channel.send({ embeds: [embed] });
};

exports.help = {
    name: "allbot",
    description: "Affiche la liste des bots dans le serveur.",
    use: 'allbot',
    category: 'moderation',
};
