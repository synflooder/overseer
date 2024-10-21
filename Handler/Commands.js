// Overseer By Kaguya

const fs = require('fs');

module.exports = (bot) => {
  bot.commands = new Map();

  const commandFiles = fs.readdirSync('./Commands/').filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const props = require(`../Commands/${file}`);
    if (props.help && props.help.name) {
      bot.commands.set(props.help.name, props);

      if (props.help.aliases && Array.isArray(props.help.aliases)) {
        props.help.aliases.forEach((alias) => {
          bot.commands.set(alias, props);
        });
      }

      //console.log(`[COMMAND] ▸ ${file}`);
    } else {
      console.warn(`Le fichier de commande ${file} ne contient pas d'objet 'help' valide.`);
    }
  }

  const commandSubFolders = fs.readdirSync('./Commands/').filter((folder) => !folder.endsWith('.js'));

  for (const folder of commandSubFolders) {
    const subCommandFiles = fs.readdirSync(`./Commands/${folder}/`).filter((file) => file.endsWith('.js'));

    for (const file of subCommandFiles) {
      const props = require(`../Commands/${folder}/${file}`);
      if (props.help && props.help.name) {
        bot.commands.set(props.help.name, props);

        if (props.help.aliases && Array.isArray(props.help.aliases)) {
          props.help.aliases.forEach((alias) => {
            bot.commands.set(alias, props);
          });
        }

        //console.log(`[COMMAND] ▸ ${file} - ${folder}`);
      } else {
        console.warn(`Le fichier de commande ${file} dans le dossier ${folder} ne contient pas d'objet 'help' valide.`);
      }
    }
  }
};
