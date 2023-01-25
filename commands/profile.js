const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'profile',
    description: "Check your profile",
    execute(interaction, client, profileData) {
        if (!profileData) return interaction.reply(`You do not have an active profile! Use /joinwar to make one`);

        let color = interaction.member.displayHexColor;
        if (color == '#000000') color = '#00245e';
        const newEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`${interaction.user.username}'s Profile`)
            .addFields(
                { name: 'Name', value: `${profileData.name}` },
                { name: 'Health', value: `${profileData.health}` },
                { name: 'Shield', value: `${profileData.shield}` },
                { name: 'Money', value: `$${profileData.money}` }
            )

        interaction.reply({ embeds: [newEmbed] });
    }
}