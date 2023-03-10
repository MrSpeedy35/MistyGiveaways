const Discord = require("discord.js");

module.exports = {
  description: "End a giveaway",

  options: [
    {
      name: "giveaway",
      description: "The giveaway to end (message ID or giveaway prize)",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has("MANAGE_MESSAGES") &&
      !interaction.member.roles.cache.some((r) => r.name === "Giveaways")
    ) {
      return interaction.reply({
        content:
          ":x: You need to have the manage messages permissions to end giveaways.",
        ephemeral: true,
      });
    }

    const query = interaction.options.getString("giveaway");

    const giveaway =
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === query && g.guildId === interaction.guild.id
      ) ||
      client.giveawaysManager.giveaways.find(
        (g) => g.messageId === query && g.guildId === interaction.guild.id
      );

    if (!giveaway) {
      return interaction.reply({
        content: "Unable to find a giveaway for `" + query + "`.",
        ephemeral: true,
      });
    }

    if (giveaway.ended) {
      return interaction.reply({
        content: "This giveaway is already ended.",
        ephemeral: true,
      });
    }

    client.giveawaysManager
      .end(giveaway.messageId)

      .then(() => {
        interaction.reply("Giveaway ended!");
      })
      .catch((e) => {
        interaction.reply({
          content: e,
          ephemeral: true,
        });
      });
  },
};
