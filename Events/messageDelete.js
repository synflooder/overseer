// Overseer By Kaguya

const { Events } = require('discord.js');

const deletedMessages = new Map();

module.exports = {
  name: Events.MessageDelete,
  execute(message) {
    if (!message.guild || !message.channel || !message.content) return;
    if (!deletedMessages.has(message.channel.id)) {
      deletedMessages.set(message.channel.id, []);
    }
    const messages = deletedMessages.get(message.channel.id);
    messages.push({
      content: message.content,
      author: message.author,
      timestamp: Date.now(),
    });
    if (messages.length > 50) {
      messages.shift();
    }
  },
  deletedMessages,
};
