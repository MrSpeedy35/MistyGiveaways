module.exports = (client, interaction) => {

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return void interaction.reply({
        content: `A command named \`${interaction.commandName}\` was not found! \nIf you think this is an error, DM MrSpeedy#7901.`,
        ephemeral: true
    });
  
    command.run(client, interaction);
};