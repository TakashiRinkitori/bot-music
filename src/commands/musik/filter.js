const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createPlaySongEmbed } = require("../../utils/song.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Lọc Music")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Chọn chế độ:")
        .addChoices(
          { name: "off", value: "off" },
          { name: "3d", value: "3d" },
          { name: "Tăng Âm", value: "bassboost" },
          { name: "Tiếng Vọng", value: "echo" },
          { name: "karaoke", value: "karaoke" },
          { name: "nightcore", value: "nightcore" },
          { name: "vaporwave", value: "vaporwave" },
          { name: "flanger", value: "flanger" },
          { name: "gate", value: "gate" },
          { name: "haas", value: "haas" },
          { name: "reverse", value: "reverse" },
          { name: "surround", value: "surround" },
          { name: "mcompand", value: "mcompand" },
          { name: "tremolo", value: "tremolo" },
          { name: "earwax", value: "earwax" }
        )
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction);

    if (!queue) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`❌ | There is nothing in the queue right now!`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const song = queue.songs[0];
    const filter = interaction.options.getString("mode");
    const oldMessages = await queue.textChannel.messages.fetch({ limit: 1 });
    const oldMessage = oldMessages.first();

    if (filter === "off" && queue.filters.size) {
      queue.filters.clear();
      const { playSongEmbed, row } = createPlaySongEmbed(song, queue, client);
      return interaction.reply({ embeds: [playSongEmbed], components: [row] });
    } else if (Object.keys(client.distube.filters).includes(filter)) {
      if (queue.filters.has(filter)) {
        queue.filters.remove(filter);
        const { playSongEmbed, row } = createPlaySongEmbed(song, queue, client);
        return interaction.reply({
          embeds: [playSongEmbed],
          components: [row],
        });
      } else {
        queue.filters.add(filter);
        const { playSongEmbed, row } = createPlaySongEmbed(song, queue, client);
        return interaction.reply({
          embeds: [playSongEmbed],
          components: [row],
        });
      }
    } else {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`❌ | Not a valid filter.`);
      return interaction.reply({ embeds: [embed] });
    }
  },
};
