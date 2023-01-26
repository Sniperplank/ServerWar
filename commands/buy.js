const { ApplicationCommandOptionType } = require('discord.js');
const Profile = require('../models/profile');

module.exports = {
    name: 'buy',
    description: "Buy items to help in the war",
    cooldown: 60,
    options: [
        {
            name: 'item',
            type: ApplicationCommandOptionType.String,
            description: 'Choose an item',
            required: true,
            choices: [
                { name: 'Health', value: 'health' },
                { name: 'Shield', value: 'shield' },
            ]
        },
    ],
    async execute(interaction, client, profileData) {
        if (!profileData) return interaction.reply(`You do not have an active profile! Use /joinwar to make one`);
        const chosenItem = interaction.options.getString('item');

        if (chosenItem == 'health') {
            if (profileData.money > 1000) {
                await Profile.findOneAndUpdate({
                    userID: interaction.user.id,
                    serverID: interaction.guild.id,
                }, {
                    $inc: {
                        money: -1000,
                    },
                    $set: {
                        health: 100
                    }
                });
                return interaction.reply(`${interaction.user.username} bought ${chosenItem}`)
            } else {
                return interaction.reply(`${interaction.user.username} you do not have enough money to buy ${chosenItem}`)
            }
        }

        if (chosenItem == 'shield') {
            if (profileData.money > 1000) {
                await Profile.findOneAndUpdate({
                    userID: interaction.user.id,
                    serverID: interaction.guild.id,
                }, {
                    $inc: {
                        money: -1000,
                    },
                    $set: {
                        shield: 100
                    }
                });
                return interaction.reply(`${interaction.user.username} bought ${chosenItem}`)
            } else {
                return interaction.reply(`${interaction.user.username} you do not have enough money to buy ${chosenItem}`)
            }
        }

        return interaction.reply(`${chosenItem}`);
    }
}