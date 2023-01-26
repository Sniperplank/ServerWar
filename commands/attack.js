const { ApplicationCommandOptionType } = require('discord.js');
const Profile = require('../models/profile');

module.exports = {
    name: 'attack',
    description: "Attack another player",
    cooldown: 10,
    options: [
        {
            name: 'target',
            type: ApplicationCommandOptionType.User,
            description: 'The player you want to attack',
            required: true,
        },
    ],
    async execute(interaction, client, profileData) {
        if (!profileData) return interaction.reply(`You do not have an active profile! Use /joinwar to make one`);

        const randomNumber = Math.floor(Math.random() * 5) + 1;

        const target = interaction.options.getUser('target');

        const targetData = await Profile.findOne({ userID: target.id, serverID: interaction.guild.id });
        if (!targetData) return interaction.reply(`${target.username} doesn't have an active profile!`);

        // Check if target is dead
        if ((targetData.health - randomNumber) <= 0) {
            await Profile.findOneAndUpdate({
                userID: interaction.user.id,
                serverID: interaction.guild.id,
            }, {
                $inc: {
                    money: 1000,
                }
            });
            await Profile.findOneAndUpdate({
                userID: target.id,
                serverID: interaction.guild.id,
            }, {
                $inc: {
                    money: -500,
                },
                $set: {
                    health: 100,
                    shield: 0,
                }
            });
            return interaction.reply(`${interaction.user} killed ${target} and has been rewarded $1000. ${target} lost $500 and respawned with 100 health.`);
        }

        if (targetData.shield > 0) {
            await Profile.findOneAndUpdate({
                userID: target.id,
                serverID: interaction.guild.id,
            }, {
                $inc: {
                    shield: -randomNumber,
                }
            });
            if ((targetData.shield + randomNumber) <= 0) {
                await Profile.findOneAndUpdate({
                    userID: target.id,
                    serverID: interaction.guild.id,
                }, {
                    $set: {
                        shield: 0,
                    }
                });
            }
        } else {
            await Profile.findOneAndUpdate({
                userID: target.id,
                serverID: interaction.guild.id,
            }, {
                $inc: {
                    health: -randomNumber,
                }
            });
        }

        return interaction.reply(`${interaction.user} attacked ${target} and did ${randomNumber} damage`);
    }
}