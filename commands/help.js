const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Help on how to participate in the war.',
    execute(interaction) {
        let color = interaction.member.displayHexColor;
        if (color == '#000000') color = '#00245e';
        const newEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`Help`)
            .addFields(
                { name: 'Participating', value: `Use /joinwar to participate in the war. A profile will be created for you.` },
                { name: 'Goal', value: `Eliminate other players to win money and prizes.` },
                { name: 'Commands', value: `Use /commands to see a list of all available commands` }
            )
        interaction.reply({ embeds: [newEmbed] })
    },
};
