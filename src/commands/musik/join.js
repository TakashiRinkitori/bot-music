const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Bot Discord Join"),
    async execute(interaction, client) {"src/commands/musik/join.js"
        let voiceChannel = interaction.member.voice.channel
        let embed = new EmbedBuilder()
        .setDescription(` | You must be in a voice channel or enter a voice channel id!`)
        .setColor(`DarkButNotBlack`)
        if (!voiceChannel) {
            return interaction.reply(
                { embeds : [embed]}
            )
        }
        client.distube.voices.join(voiceChannel)
        embed = new EmbedBuilder()
        .setTitle(`Joined ${voiceChannel}`)
        .setDescription(`Requested by <@${interaction.member.user.id}> `)
        .setColor('DarkBlue');
        return await interaction.reply({embeds:[embed]})
    }
}