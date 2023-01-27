require('dotenv').config()
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const mongoose = require('mongoose');
const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const { EmbedBuilder } = require('discord.js');
const Profile = require('./models/profile')
const cooldowns = new Map();


const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//console.log(client.commands);

client.once('ready', async () => {
    console.log('Ready!');
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content === '!deploy' && message.author.id === client.application?.owner?.id) {
        await message.guild.commands
            .set(client.commands)
            .then(() => {
                message.reply('Deployed!');
            })
            .catch(err => {
                message.reply('Could not deploy commands! Make sure the bot has the application.commands permission!');
                console.error(err);
            });
    }
});

client.on('interactionCreate', async interaction => {
    const command = client.commands.get(interaction.commandName.toLowerCase());
    let profileData = await Profile.findOne({ userID: interaction.user.id, serverID: interaction.guild.id })

    // If cooldowns map doesnt have a command.name key then create one.
    if (profileData) {
        if (command.cooldown) {
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Discord.Collection());
            }

            const current_time = Date.now();
            const time_stamps = cooldowns.get(command.name);
            const cooldown_amount = (command.cooldown) * 1000;
            // If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
            if (time_stamps.has(interaction.user.id + interaction.guild.id)) {
                const expiration_time = time_stamps.get(interaction.user.id + interaction.guild.id) + cooldown_amount;

                if (current_time < expiration_time) {
                    const time_left = (expiration_time - current_time) / 1000;

                    return interaction.reply(`You must wait ${time_left.toFixed()} more seconds before using /${command.name}`);
                }
            }
            // If the author's id is not in time_stamps then add them with the current time.
            time_stamps.set(interaction.user.id + interaction.guild.id, current_time);
            // Delete the user's id once the cooldown is over.
            setTimeout(() => time_stamps.delete(interaction.user.id + interaction.guild.id), cooldown_amount);
        }
    }

    try {
        command.execute(interaction, client, profileData);
    } catch (error) {
        console.error(error);
        interaction.followUp({
            content: 'There was an error trying to execute that command!',
        });
    }
});

mongoose.connect(process.env.DB_CONNECTION).then(() => {
    console.log("Connected to the database!");
}).catch((err) => {
    console.log(err);
});

client.login(process.env.TOKEN);
