const { SlashCommandBuilder } = require("discord.js")
const { ViewCredits } = require("../embeds")
const { getDoc, doc } = require("firebase/firestore")
const db = require("../firebase")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("credits")
        .setDescription("View your Social Credits")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("target @member")
        ),
    async execute(interaction) {
        const target = await interaction.options.getUser("target")
        if (!target) {
            getDoc(doc(db, interaction.guild.id, interaction.user.id)).then((docSnap) => {
                if (docSnap.exists()) {
                    let embed;
                    embed = ViewCredits(interaction.user.username, docSnap.data().credits)
                    interaction.deferReply().then(() => {
                        interaction.editReply({ embeds: [embed] })
                    })
                } else {
                    interaction.deferReply().then(() => {
                        interaction.editReply({ content: "Error: User does not exist. DM longhua for support." })
                    })
                }
            })
        } else if (!(target.bot)) {
            getDoc(doc(db, interaction.guild.id, target.id)).then((docSnap) => {
                if (docSnap.exists()) {
                    let embed;
                    embed = ViewCredits(target.username, docSnap.data().credits)
                    interaction.deferReply().then(() => {
                        interaction.editReply({ embeds: [embed] })
                    })
                } else {
                    interaction.deferReply().then(() => {
                        interaction.editReply({ content: "Error: User does not exist. DM longhua for support." })
                    })
                }
            })
        } else {
            interaction.reply({ content: "Bots cannot have credits", ephemeral: true })
        }
    }
}