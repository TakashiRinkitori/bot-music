module.exports = {
  data: {
    name: "pause",
  },
  execute: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue) {
      return await interaction.reply({
        content: "There is no song playing right now!",
        ephemeral: true,
      });
    }

    if (queue.paused) {
      queue.resume();
      await interaction.reply({
        content: "Resumed the song!",
        ephemeral: true,
      });
    } else {
      queue.pause();
      await interaction.reply({
        content: "Paused the song!",
        ephemeral: true,
      });
    }
  },
};
