// Overseer By Kaguya

const { EmbedBuilder } = require('discord.js'); 
const config = require('../config.json'); 
const badWords = [
    "connard", "connasse", "salope", "imbécile", "idiot", "foutre", "pute",
    "bâtard", "gros con", "merde", "va te faire foutre", "crétin", "casse-toi",
    "enculé", "salopard", "sale con", "putain", "petit con", "bitch", "cul",
    "taré", "cocu", "fayot", "débile", "salaud", "abruti", "foutaise",
    "pouffiasse", "mangemort", "gouine", "tarlouze", "louche", "gogole",
    "sucer", "suceur", "travelo", "clochard", "loque", "pédale", "pédé",
    "femmelette", "naïf", "faux cul", "tête de con", "sourd", "baltringue",
    "saligaud", "plan cul", "trompeur", "salope", "connasse", "malotru",
    "goret", "gogol", "truffe", "tête de noeud", "caillera", "bouffon",
    "pouff", "morfale", "mou", "tête de cul", "vulgaire", "idiote", "fille de joie",
    "raclure", "abrutie", "abrut", "cancre", "barge", "crasseux", "cabot",
    "cagole", "crottin", "crapule", "grosse vache", "grosse tache", "imbécile heureux",
    "pouffiasse", "queue de vache", "teubé", "tombé de la dernière pluie",
    "boloss", "nul", "branleur", "saucisse", "poulet", "choupette", "cochon",
    "tête de turc", "mouette", "poulet", "clown", "mimi", "mou du genou", "fdp", "tg", "pd", "ntgrm", "slp"
];
let badWordFilterEnabled = false;
exports.help = {
    name: 'badword',
    aliases: ['bw'],
    description: 'Active ou désactive le filtre de mots inappropriés.',
    use: 'badword on/off',
    category: 'gestions',
};
exports.run = async (bot, message) => {
    badWordFilterEnabled = !badWordFilterEnabled;
    const statusEmbed = new EmbedBuilder()
        .setColor(config.color || '#FFFFFF')
        .setTitle('`⚠️` ▸ Filtre de Mots Inappropriés')
        .setDescription(`*Le filtre de mots inappropriés est maintenant* **${badWordFilterEnabled ? 'activé' : 'désactivé'}**.`)
        .setFooter({ text: 'Overseer - github.com/xwqu', iconURL: message.author.displayAvatarURL({ dynamic: true }) });
    await message.channel.send({ embeds: [statusEmbed] });
    bot.on('messageCreate', async (msg) => {
        if (msg.author.bot) return;
        if (badWordFilterEnabled) {
            const messageContent = msg.content.toLowerCase();
            const containsBadWord = badWords.some(badWord => messageContent.includes(badWord));
            if (containsBadWord) {
                const warningEmbed = new EmbedBuilder()
                    .setColor(config.color || '#FFFFFF')
                    .setTitle('`⚠️` ▸ Avertissement')
                    .setDescription(`> **Votre message a été supprimé car il contenait des mots inappropriés.**`)
                    .setFooter({ text: 'Overseer - github.com/xwqu', iconURL: msg.author.displayAvatarURL({ dynamic: true }) });
                await msg.channel.send({ embeds: [warningEmbed] });
                await msg.delete();
            }
        }
    });
};
