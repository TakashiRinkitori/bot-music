const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createPlaySongEmbed } = require("../../utils/song.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Auto Play Music"),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction);
    if (!queue) {
      const embed = new EmbedBuilder().setDescription(
        "` | There is nothing in the queue right now!`"
      );
      return interaction.reply({ embeds: [embed] });
    }

    const autoplay = queue.toggleAutoplay();
    const song = queue.songs[0];
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
