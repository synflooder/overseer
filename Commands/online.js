// Overseer By Kaguya

const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

exports.run = async (client, message) => {
  if (!config.owners.includes(message.author.id)) {
    return message.reply('🚫 Vous n\'avez pas la permission de changer le statut.');
  }

  await client.user.setStatus('online');
  
  const embed = new EmbedBuilder()
    .setColor(config.color)
    .setTitle("Statut Modifié")
    .setDescription("Le statut a été changé en **Online**.");
  
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: "online",
  description: "Change le statut du bot en \"Online\".",
  category: "bot"
};
