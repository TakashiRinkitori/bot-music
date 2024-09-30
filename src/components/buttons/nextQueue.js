const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: {
        name: 'nextQueue'
    },
    async execute(client, interaction) {
        const queue = client.distube.getQueue(interaction.guild.id);
        
        if (!queue) {
            return interaction.reply({ content: 'No music is playing!', ephemeral: true });
        }

        // Get the current page from the footer text
        let currentPage = parseInt(interaction.message.embeds[0].footer.text.split(' ')[1].split('-')[0]) - 1;
        const songsPerPage = 5;
        currentPage++;

        const generateQueueEmbed = (page) => {
            page -= 1
            const start = page + songsPerPage;
            const end = start + songsPerPage;
            const limitedQueue = queue.songs.slice(start, end);

            return new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Music Queue')
                .setDescription(limitedQueue.map((song, i) => `${start + i === 0 ? 'Currently playing:' : `${start + i + 1}.`} ${song.name} - \`${song.formattedDuration}\``).join('\n'))
                .setFooter({ text: `Showing ${start + 1}-${Math.min(end, queue.songs.length)} from ${queue.songs.length} song` });
        };

        const queueEmbed = generateQueueEmbed(currentPage);

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

        await interaction.update({ embeds: [queueEmbed], components: [row] });
    }
};