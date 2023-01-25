const Profile = require('../models/profile');

module.exports = {
    name: 'beg',
    description: "Beg for money",
    cooldown: 3600,
    async execute(interaction, client, profileData) {
        if (!profileData) return interaction.reply(`You do not have an active profile! Use /joinwar to make one`);

        const randomNumber = Math.floor(Math.random() * 500) + 1;
        await Profile.findOneAndUpdate({
            userID: interaction.user.id,
            serverID: interaction.guild.id,
        }, {
            $inc: {
                money: randomNumber,
            }
        });
        return interaction.reply(`${interaction.user.username} begged and revieved $${randomNumber}`);
    }
}