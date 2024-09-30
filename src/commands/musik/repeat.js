const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createPlaySongEmbed } = require("../../utils/song.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("repeat")
    .setDescription("Repeat")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Chọn chế độ:")
        .addChoices(
          { name: "off", value: "off" },
          { name: "song", value: "song" },
          { name: "queue", value: "queue" }
        )
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const hasil = interaction.options.getString("mode");
    const queue = client.distube.getQueue(interaction);
    let embed = new EmbedBuilder().setDescription(
      ` | There is nothing playing!`
    );
    if (!queue) return interaction.channel.send({ embeds: [embed] });
    let mode = null;
    switch (hasil) {
      case "off":
        mode = 0;
        break;
      case "song":
        mode = 1;
        break;
      case "queue":
        mode = 2;
        break;
    }
    mode = queue.setRepeatMode(mode);
    const song = queue.songs[0];
    mode = mode ? (mode === 2 ? "queue" : "song") : "Off";
    const { playSongEmbed, row } = createPlaySongEmbed(song, queue, client);
    const oldNotifications = await queue.textChannel.messages.fetch({
      limit: 1,
    });
    oldNotifications.forEach(async (message) => {
      await message.delete().catch(console.error);
    });
    interaction.reply({ embeds: [playSongEmbed], components: [row] });
  },
};
