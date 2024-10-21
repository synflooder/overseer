// Overseer By Kaguya

const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');

const isOwner = (userId) => {
  const config = JSON.parse(fs.readFileSync(configPath));
  return config.owners.includes(userId);
};

exports.help = {
  name: 'owner',
  aliases: ['addowner'],
  description: 'Ajoute un propriétaire du bot.',
  use: 'owner @user',
  category: 'bot',
};

exports.run = async (bot, message, args) => {
  if (!isOwner(message.author.id)) {
    return message.reply('🚫 Vous n\'avez pas la permission d\'ajouter des propriétaires.');
  }

  const member = message.mentions.members.first();
  if (!member) {
    return message.reply('Veuillez mentionner un utilisateur.');
  }

  const config = JSON.parse(fs.readFileSync(configPath));

  if (config.owners.includes(member.id)) {
    return message.reply(`${member.user.tag} est déjà propriétaire.`);
  }

  config.owners.push(member.id);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  message.reply(`${member.user.tag} a été ajouté en tant que propriétaire.`);
};
