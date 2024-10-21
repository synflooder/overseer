// Overseer By Kaguya

module.exports = {
  name: 'ready',
  async execute(bot) {
    await bot.user.setPresence({ 
      activities: [{ name: 'Overseer', type: 'WATCHING' }],
      status: 'dnd'
    });
  },
};
