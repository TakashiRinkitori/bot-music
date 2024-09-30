const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play Music")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Điền Link Music")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply();
        const args = interaction.options.getString('query');
        const memberVC = interaction.member.voice.channel;

        let embed = new EmbedBuilder()
        .setDescription(` | You must be in a voice channel!`)
        if (!memberVC) {
            return interaction.editReply({ embeds : [embed] });
        }

        embed = new EmbedBuilder()
        .setDescription(` | You must be in the same channel as the bot!`)
        const clientVC = interaction.guild.members.me.voice.channel;
        if (clientVC && clientVC !== memberVC) {
            return interaction.editReply({embeds : [embed]});
        }

        try {
            await client.distube.play(memberVC, args, {
                member: interaction.member,
                textChannel: interaction.channel
            });
            embed = new EmbedBuilder()
            .setDescription(` | Now playing: ${args}`)
            return interaction.editReply({embeds : [embed]});
        } catch (error) {
            console.error(error);
            return interaction.editReply(` | There was an error trying to play the music: ${error.message}`);
        }
    }
}