const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require('openai');
const config = require('./../../config.json'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Hỏi chat GPT')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Câu hỏi dành cho AI')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        console.log('Key API:', config.openai_key);

        const openai = new OpenAI({
            apiKey: config.openai_key 
        });

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'Bạn đang nói chuyện với ChatGPT.',
                    },
                    {
                        role: 'user',
                        content: interaction.options.getString('prompt'),
                    },
                ],
            });

            await interaction.reply(response.choices[0].message.content); 
        } catch (error) {
            console.error('OpenAi error:', error); 
            if (error.code === 'insufficient_quota') {
                await interaction.reply('Hạn ngạch API OpenAI đã bị vượt quá. Vui lòng thử lại sau hoặc liên hệ với quản trị viên bot.');
            } else {
                await interaction.reply('Đã xảy ra lỗi khi xử lý yêu cầu của bạn.');
            }
        }
    }
};
