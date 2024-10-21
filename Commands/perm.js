// Overseer By Kaguya

const Discord = require('discord.js');

exports.help = {
  name: 'perm',
  aliases: ['permissions'],
  description: 'Vérifie les permissions d\'un utilisateur.',
  use: 'perm @user',
  category: 'utils',
}

exports.run = async (bot, message, args, config) => {
  const member = message.mentions.members.first() || message.member;
  const permissions = member.permissions.toArray();
  
  if (permissions.length === 0) {
    return message.reply('Cet utilisateur n\'a aucune permission.');
  }

  const chunkSize = 10;
  const chunks = [];
  
  for (let i = 0; i < permissions.length; i += chunkSize) {
    chunks.push(permissions.slice(i, i + chunkSize));
  }

  let page = 0;

  const embed = new Discord.EmbedBuilder()
    .setTitle(`Permissions pour : ${member.user.tag}`)
    .setDescription(chunks[page].map(perm => `- ${perm.replace(/_/g, ' ')}`).join('\n'))
    .setFooter({ text: `Page ${page + 1} sur ${chunks.length} - Overseer` })
    .setColor(config.color);

  const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  await msg.react('◀️');
  await msg.react('▶️');

  const filter = (reaction, user) => {
    return ['◀️', '▶️'].includes(reaction.emoji.name) && !user.bot;
  };

  const collector = msg.createReactionCollector({ filter, time: 60000 });

  collector.on('collect', (reaction, user) => {
    if (reaction.emoji.name === '◀️') {
      page = page > 0 ? page - 1 : chunks.length - 1;
    } else {
      page = page < chunks.length - 1 ? page + 1 : 0;
    }

    embed.setDescription(chunks[page].map(perm => `- ${perm.replace(/_/g, ' ')}`).join('\n'));
    embed.setFooter({ text: `Page ${page + 1} sur ${chunks.length} - Overseer` });
    msg.edit({ embeds: [embed] });
    reaction.users.remove(user.id).catch(console.error);
  });

  collector.on('end', () => {
    msg.reactions.removeAll().catch(console.error);
  });
}
