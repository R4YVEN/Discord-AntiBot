const {default: axios} = require('axios');
const Discord = require('discord.js');
const Settings = require('./settings.js')

const debug = true;

module.exports = {
    hasBanner: async function (userId) {
        const response = await axios.get("https://discord.com/api/v9/users/" + userId, {
            headers: {
                Authorization: "Bot " + Settings.token
            },
        });

        const { banner,accent_color } = response.data;
        return (banner != null);
    },


    verify: async function (user, member) {

        var trustScore = 1.0;
        var bypass = (user.displayAvatarURL({dynamic: true}).endsWith(".gif") || await this.hasBanner(user.id));   //user has nitro. definitly not a bot
        if(!bypass)
            bypass = (user.discriminator == "1337" || user.discriminator == "6969" || user.discriminator == "0001" || user.discriminator == "9999")

        if (user.username.includes("discord.gg/"))                                                          //does username contain invite link
            trustScore -= 0.5;

        if ((user.createdTimestamp + (86400000 * 3)) > Date.now())                                          //was user created in the last 3 days?
            trustScore -= 0.3;

        if (user.avatar == null)                                                                            //does the user have an avatar?
            trustScore -= 0.2;

        if (member.presence.status.includes("http"))                                                        //link in status?
            trustScore -= 0.1;

        if (user.username.replace(/\D/g, "") > 2500)                                                        //does the users name contain alot of numbers (that are not a year)
            trustScore -= 0.1;

        if (member.presence == null || member.presence.status == "offline")                                 //is user offline? only minor trust-impact
            trustScore -= 0.05;

        if (user.username.includes(" "))                                                                    //most legit accounts have names without spaces while generated accounts often do.
            trustScore -= 0.05;                                                                             //but its only a minor trust-impact

        trustScore = Math.min(Math.max(trustScore, 0.01), 1);
        console.log(user.username + "'s trust-score is: " + trustScore + " (bypass: " + bypass + ")");
        return bypass ? 1.0 : trustScore;
    },
}