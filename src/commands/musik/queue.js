const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Hàng Đợi"),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id);

        if (!queue) {
            return interaction.reply(` | Dont have music`);
        }

        // Membatasi antrian hanya 5 lagu teratas untuk awalnya
        let currentPage = 0;
        const songsPerPage = 5;

        const generateQueueEmbed = (page) => {
            const start = page * songsPerPage;
            const end = start + songsPerPage;
            const limitedQueue = queue.songs.slice(start, end);

            return new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Hàng Đợi')
                .setDescription(limitedQueue.map((song, i) => `${start + i === 0 ? 'Đang chạy:' : `${start + i + 1}.`} ${song.name} - \`${song.formattedDuration}\``).join('\n'))
                .setFooter({ text: `Hiện thị ${start + 1}-${Math.min(end, queue.songs.length)} Từ ${queue.songs.length} Bài` });
        };

        const queueEmbed = generateQueueEmbed(currentPage);

        let row;
        if (queue.songs.length > songsPerPage) {
            row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("prevQueue")
                  .setEmoji("⬅️")
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(currentPage === 0),
                new ButtonBuilder()
                  .setCustomId("nextQueue")
                  .setEmoji("➡️")
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled((currentPage + 1) * songsPerPage >= queue.songs.length),
                new ButtonBuilder()
                .setCustomId("remove")
                .setLabel("Remove List")
                .setStyle(ButtonStyle.Danger)
            );
        }

        const messageOptions = { embeds: [queueEmbed], fetchReply: true };
        if (row) {
            messageOptions.components = [row];
        }

        await interaction.reply(messageOptions);
    }
};
