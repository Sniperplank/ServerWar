const Profile = require('../models/profile');

module.exports = {
    name: 'quitwar',
    description: "Use this command to quit the war and delete your profile",
    async execute(interaction, client, profileData) {
        if (!profileData) return interaction.reply(`You do not have an active profile!`);

        await Profile.findOneAndDelete({ userID: interaction.user.id, serverID: interaction.guild.id });

        interaction.reply(`${interaction.user.username} is no longer participating in the war. ${interaction.user.username}'s profile is now deleted.`);
    }
}