const Discord = require("discord.js");

module.exports = {
  description: "Reroll a giveaway",

  options: [
    {
      name: "giveaway",
      description: "The giveaway to reroll (message ID or prize)",
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
          ":x: You need to have the manage messages permissions to reroll giveaways.",
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

    if (!giveaway.ended) {
      return interaction.reply({
        content: "The giveaway is not ended yet.",
        ephemeral: true,
      });
    }

    client.giveawaysManager
      .reroll(giveaway.messageId)
      .then(() => {
        interaction.reply("Giveaway rerolled!");
      })
      .catch((e) => {
        interaction.reply({
          content: e,
          ephemeral: true,
        });
      });
  },
};
