const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createPlaySongEmbed } = require("../../utils/song.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change to the volume you want")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The number of volumes you want to change. Example: 10")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction);
    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "You must be in a voice channel to use this command.!"
            ),
        ],
        ephemeral: true,
      });
    }

    const player = client.distube.getQueue(interaction.guild.id);
    if (!player || !player.playing) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("No music is playing."),
        ],
        ephemeral: true,
      });
    }

    const vol = interaction.options.getNumber("jumlah");

    if (!vol || vol < 1 || vol > 125) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFA500")
            .setDescription(
              `:loud_sound: | Current volume**${player.volume}**`
            ),
        ],
        ephemeral: true,
      });
    }

    // Mengatur volume player
    player.setVolume(vol);
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
