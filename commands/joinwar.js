const Profile = require('../models/profile');

module.exports = {
    name: 'joinwar',
    description: "Use this command to participate in the war",
    async execute(interaction, client, profileData) {
        if (profileData) {
            interaction.reply(`${interaction.user.username}, you are already a warrior. Use /profile to see your profile`);
        } else {
            try {
                if (!profileData) {
                    let profile = await Profile.create({
                        userID: interaction.user.id,
                        serverID: interaction.guild.id,
                        name: interaction.user.username,
                        serverName: interaction.guild.name,
                        health: 100,
                        shield: 0,
                        money: 1000,
                    });
                    profile.save();
                }
            } catch (err) {
                interaction.reply("Error in creating your profile!")
                console.log(err);
            }
            interaction.reply(`${interaction.user.username} is now a warrior. Be the last surviver to win money! A profile has been created for you. Use /profile to see it`);
        }
    }
}