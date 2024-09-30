const { SlashCommandBuilder } = require ('@discordjs/builders');

module.exports = {
    data : new SlashCommandBuilder ()
    .setName('ping')
    .setDescription('Testing'),
    async execute(interaction) {
        await interaction.reply(`Check`);
    },
};