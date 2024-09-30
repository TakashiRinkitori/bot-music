// src/utils/embedUtils.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const createPlaySongEmbed = (song, queue, client) => {
  const playSongEmbed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle(`${client.emotes.play} | Playing \`${song.name}\``)
    .setDescription(`Requested by: ${song.user}`)
    .addFields(
      { name: "Volume", value: `${queue.volume}%`, inline: true },
      {
        name: "Filter",
        value: `${queue.filters.names.join(", ") || "Off"}`,
        inline: true,
      },
      {
        name: "Loop",
        value: `${
          queue.repeatMode
            ? queue.repeatMode === 2
              ? "All Queue"
              : "This Song"
            : "Off"
        }`,
        inline: true,
      },
      {
        name: "Autoplay",
        value: `${queue.autoplay ? "On" : "Off"}`,
        inline: true,
      }
    )
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("previous")
      .setEmoji("◀️")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("pause")
      .setEmoji("⏹️")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("skip")
      .setEmoji("▶️")
      .setStyle(ButtonStyle.Secondary)
  );

  return { playSongEmbed, row };
};

module.exports = { createPlaySongEmbed };
