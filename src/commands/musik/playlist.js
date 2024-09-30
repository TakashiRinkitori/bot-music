const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Playlist Music")
        .addStringOption(option =>
            option.setName("mode")
                .setDescription("Play List")
                .addChoices(
                    {name: 'Forever Playlist',value: 'https://www.youtube.com/watch?v=TTyDNCyoUeY&list=RDTTyDNCyoUeY&start_radio=1'},
                    {name: 'TopTikTok playlist',value: 'https://www.youtube.com/watch?v=4rM0SPFeEP0&list=PLpEkrxMFJxi_A9LFNRtoNA_xUMOvY122Z'}
                )
                .setRequired(true),
        ),
    async execute(interaction, client) {
        await interaction.deferReply();
        const args = interaction.options.getString('mode')
        const memberVC = interaction.member.voice.channel;
        let embed = new EmbedBuilder()
        .setDescription(` | You must be in a voice channel!`)
        if (!memberVC) return interaction.reply({ embeds : [embed] });

        const clientVC = interaction.guild.members.me.voice.channel;
        embed = new EmbedBuilder()
        .setDescription(` | You must be in the same channel as!`)
        if (clientVC && clientVC !== memberVC) return interaction.reply({ embeds : [embed] })
        try{
        await client.distube.play(memberVC, args, {
            member: interaction.member,
            textChannel: interaction.channel
        });
        embed = new EmbedBuilder()
        .setDescription("Request Accepted")
        .setColor(`Green`)
        return interaction.editReply({ embeds : [embed] })
    } catch (error) {
        console.log(error)
    }
    }
}