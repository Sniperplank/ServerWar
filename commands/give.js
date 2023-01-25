const { ApplicationCommandOptionType } = require('discord.js');
const Profile = require('../models/profile');

module.exports = {
    name: 'give',
    description: "Give another player money",
    cooldown: 60,
    options: [
        {
            name: 'player',
            type: ApplicationCommandOptionType.User,
            description: 'The player you want to give to',
            required: true,
        },
        {
            name: 'amount',
            type: ApplicationCommandOptionType.Integer,
            description: 'How much you want to give them',
            required: true,
        },
    ],
    async execute(interaction, client, profileData) {
        if (!profileData) return interaction.reply(`You do not have an active profile! Use /joinwar to make one`);


        const amount = interaction.options.getInteger('amount');
        const player = interaction.options.getUser('player');

        const targetData = await Profile.findOne({ userID: player.id, serverID: interaction.guild.id });
        if (!targetData) return interaction.reply(`${player.username} doesn't have an active profile!`);

        if (amount > profileData.money) return interaction.reply(`You do not have that much money to give!`)

        await Profile.findOneAndUpdate({
            userID: player.id,
            serverID: interaction.guild.id,
        }, {
            $inc: {
                money: amount,
            }
        });
        await Profile.findOneAndUpdate({
            userID: interaction.user.id,
            serverID: interaction.guild.id,
        }, {
            $inc: {
                money: -amount,
            }
        });
        return interaction.reply(`${interaction.user.username} gave ${player} $${amount}`);
    }
}