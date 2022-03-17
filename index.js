require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js');
const ABS = require('./ABS.js')
const Settings = require('./settings.js')

const {Client,Intents} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_INTEGRATIONS]});

client.once('ready', () => {
    console.log('ABS is online! Idle...');
});

client.on('guildMemberAdd', member => {
    //var joinrole = member.guild.roles.cache.find(role => role.name === verifiedRole)
    //member.roles.add(joinrole);
});

client.on('message', msg => {
    try{
    if (msg.content === 'verify') {
        var verifiedRole = msg.member.guild.roles.cache.find(role => role.name === Settings.verifiedRoleName);
        if (!msg.member.roles.cache.some(role => role == verifiedRole)) {
            ABS.verify(msg.author, msg.member).then((score) => {
                var trusted = (score >= Settings.threshold);
                if (trusted) {
                    msg.member.roles.add(verifiedRole);
                } else {
                    msg.author.send("<@" + msg.member.id + ">" + "! Our AntiBot-system has evaluated you as suspicious (score: " + score + "). You will not be granted access to this server. If you think this is a mistake, please contact a moderator.").then(function () {
                        if (Settings.kickIfUntrusted)
                            msg.member.kick()
                    });
                }

                msg.delete();
            });
        }
    }

    if(msg.content.length > 500)
    {
        var amountOfSpaces = (msg.content.match(/ /g) || []).length;
        if(amountOfSpaces < 10)
        {
            msg.member.disableCommunicationUntil(Date.now() + (60 * 1000));
            msg.author.send("<@" + msg.member.id + ">" + "! Our AntiBot-system has detected a message as potential spam. Please avoid doing this in the future.")
            msg.delete();
        }
    }
}
catch (err){}
});

//make sure this line is the last line
client.login(Settings.token); //login bot using token