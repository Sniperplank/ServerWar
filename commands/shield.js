const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'shield',
    description: "Show how much shield you have",
    async execute(interaction, client, profileData) {
        if (!profileData) return interaction.reply(`You do not have an active profile! Use /joinwar to make one`);

        let color = interaction.member.displayHexColor;
        if (color == '#000000') color = '#00245e';
        const newEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`${interaction.user.username}`)
            .addFields(
                { name: 'Shield', value: `${profileData.shield} / 100` }
            )

        interaction.reply({ embeds: [newEmbed] });
    }
}