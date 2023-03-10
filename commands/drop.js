const Discord = require("discord.js");
const messages = require("../messages");

module.exports = {
  description: "Create a drop giveaway",

  options: [
    {
      name: "winners",
      description: "How many winners the giveaway should have",
      type: Discord.ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "prize",
      description: "What the prize of the giveaway should be",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "channel",
      description: "The channel to start the giveaway in",
      type: Discord.ApplicationCommandOptionType.Channel,
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
          ":x: You need to have the manage messages permissions to start giveaways.",
        ephemeral: true,
      });
    }

    const giveawayChannel = interaction.options.getChannel("channel");
    const giveawayWinnerCount = interaction.options.getInteger("winners");
    const giveawayPrize = interaction.options.getString("prize");

    if (!giveawayChannel.isTextBased()) {
      return interaction.reply({
        content: ":x: Selected channel is not text-based.",
        ephemeral: true,
      });
    }

    client.giveawaysManager.start(giveawayChannel, {
      winnerCount: giveawayWinnerCount,

      prize: giveawayPrize,

      hostedBy: interaction.user,

      isDrop: true,

      messages,
    });

    interaction.reply(`Giveaway started in ${giveawayChannel}!`);
  },
};
