require('dotenv').config()

const fs = require('fs')
const discord = require('discord.js')
const request = require("request")
const API = process.env.API
const newMembers = []

const Client = require('./client.js')
const client = new Client()
client.commands = new discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity("!bantu & !new")
})

client.once('reconnecting', () => {
	console.log('Reconnecting!')
})

client.once('disconnect', () => {
	console.log('Disconnect!')
})

client.on("guildMemberAdd", (member) => {
    const guild = member.guild
    if (!newMembers[guild.id]) newMembers[guild.id] = new discord.Collection()
    newMembers[guild.id].set(member.id, member.user)

    if (newMembers[guild.id].size >= 1) {
        const userlist = newMembers[guild.id].map(u => u.toString()).join(" ")
        guild.channels.find(channel => channel.id === process.env.MAIN_CHANNEL_ID).send(`Selamat datang ${userlist} hihihi. Cek <#${process.env.RULE_CHANNEL_ID}> untuk membaca peraturan server dan <#${process.env.GUIDE_CHANNEL_ID}> untuk petunjuk hidup. Jangan lupa juga perkenalkan diri kamu di sini, uwu. *Happy roleplaying*! Sambutan dari admin:`, {
            files: ['https://cdn.discordapp.com/attachments/488307706655014967/623519993438535699/welcome.png']
        })
        newMembers[guild.id].clear()
    }
})

client.on("guildMemberRemove", (member) => {
    const guild = member.guild
    if (newMembers[guild.id].has(member.id)) newMembers.delete(member.id)
})

client.on('message', message => {
    let found = false
    let command = ''

    message.mentions.users.forEach(tagged => {
        if (client.user.id == tagged.id) found = true
    })

    if (message.content.toLowerCase().startsWith('nicollo, play') || message.content.toLowerCase().startsWith('nicollo play')) {
        command = 'play'
        let commandExec = client.commands.get(command)
        try {
            commandExec.execute(message, client)
        } catch (error) {
            console.error(error)
            message.reply('There was an error trying to execute that command!')
        }
    } else if (message.content.startsWith('!') && (message.isMentioned(client.user) || found) && !message.author.bot) {
        let ay = ['cuh', 'ayyyy', 'hmmm', 'TAT', 'ihihihihi', 'kya kya']
        const res = Math.floor(Math.random() * ay.length) + 1
        return message.reply(ay[res] + '! If you need some help, use `!bantu`')
    } else if (!message.content.startsWith('!') && (message.isMentioned(client.user) || found) && !message.author.bot) {
        let options = {
            method: 'GET',
            url: `${API}reminders/count`
        }
        request(options, (error, response, body) => {
            if (error) throw new Error(error)

            body = parseInt(body)
            if (isNaN(body)) body = 16
            let res = 'a'
            while (isNaN(res)) res = Math.floor(Math.random() * body) + 1

            let options = {
                method: 'GET',
                url: `${API}reminders`,
                qs: {
                    quote_id: res
                }
            }

            request(options, (error, response, body) => {
                if (error) throw new Error(error)

                if (!body.startsWith('<')) body = JSON.parse(body)
                else body = ''

                if (body.length > 0) return message.reply(body[0].quote + ' If you need some help, use `!bantu`')
                else {
                    console.log("Reminder Error: " + res)
                    return message.reply('Yah, ada error! Coba lagi atau cek `!bantu` deh.')
                }
            })
        })
    } else if (!message.content.startsWith('!') || message.author.bot) return
    else {
        let args = message.content.split(/ +/)
        if (command !== 'play') command = args.shift().toLowerCase().replace('!', '')
        let commandExec = client.commands.get(command)
        
        try {
            if (commandExec && commandExec.name) {
                commandExec.execute(message, client)
            } else if (command === 'bantu') {
                let listAll = Array.from(client.commands)
                let options = {
                    method: 'GET',
                    url: `${API}commands`
                }

                request(options, (error, response, body) => {
                    if (error) throw new Error(error)

                    if (!body.startsWith('<')) body = JSON.parse(body)
                    else body = ''
                    commands = []

                    if (body.length > 0) {
                        body.forEach(v => {
                            if(!client.commands.get(v.command.replace('!', ''))) commands.push(v.command)
                        })
                    }

                    commands = commands.join(", ")

                    let rcommands = '**tagih <mention orangnya>** untuk tagih repp, boleh tag lebih dari satu.\n'
                    rcommands += '**!guide <mention orangnya>** untuk mengarahkan orang, boleh tag lebih dari satu.\n'
                    rcommands += '**!pukpuk <mention orangnya>** untuk ngepukpuk.\n'

                    let tcommands = ''

                    let ecommands = '**!gosip** gosip seputar eleftheria\n'

                    let search = '**!search -parent (nama dewa/i atau UNCLAIMED)**, search berdasarkan orang tua.\n'
                    search += '**!search -ability (nama ability)**, search berdasarkan ability.\n'
                    search += '**!search -sort (Post/EXP/HP/ATK/DEF)**, search berdasarkan jumlah post/EXP/HP points.\n - Untuk post masih dapat menggunakan !top <limit>\n - Untuk EXP masih dapat menggunakan !topexp <limit>'

                    listAll.forEach(command => {
                        if (command[1].type === 'interaction') {
                            rcommands += `**!${command[1].name} ${command[1].parameter}** ${command[1].description}\n`
                        }
                        if (command[1].type === 'tools') {
                            tcommands += `**!${command[1].name} ${command[1].parameter}** ${command[1].description}\n`
                        }
                        if (command[1].type === 'eleftheria') {
                            ecommands += `**!${command[1].name} ${command[1].parameter}** ${command[1].description}\n`
                        }
                    })

                    message.channel.send({
                        embed: {
                            color: 3447003,
                            author: {
                                name: client.user.username,
                                icon_url: client.user.avatarURL
                            },
                            title: 'Eleftheria Bot Helper',
                            description: 'Commands untuk pakai bot.',
                            thumbnail: {
                                url: client.user.avatarURL,
                            },
                            fields: [{
                                name: 'Commands Interaksi',
                                value: rcommands
                            }, {
                                name: 'Tools Commands',
                                value: tcommands
                            }, {
                                name: 'Members Search',
                                value: search
                            }, {
                                name: 'Eleftheria',
                                value: ecommands
                            }, {
                                name: 'Cobain sendiri aja ihi',
                                value: commands
                            }],
                            timestamp: new Date()
                        }
                    })
                })
            } else if (command === 'new') {
                let rcommands = '**Deleted commands:** !howto, !love, !convert\n'
                rcommands += '**New Commands:**\n'
                rcommands += '- **Nicollo, play (lagu)** tahulah ya buat apa. Untuk lebih singkat, bisa pakai `!play (apagitu)`\n'
                rcommands += '**Database:**\n'
                rcommands += 'Untuk database karakter sekarang bisa diakses lewat https://eleftheria.prosa.id. Untuk submit gosip bisa lewat https://eleftheria.prosa.id/submit\n'
                rcommands += '**Help:**\n'
                rcommands += 'Buat bantu bangun Nicollo, buka https://github.com/flavea/eleftheria-bot'

                message.channel.send({
                    embed: {
                        color: 3447003,
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: 'Eleftheria Bot Update',
                        description: 'What is new?',
                        thumbnail: {
                            url: client.user.avatarURL,
                        },
                        fields: [{
                            name: 'September 17th - October 15th 2019',
                            value: rcommands
                        }],
                        timestamp: new Date()
                    }
                })
            } else {
                let mentioned = ''
                command = `!${command}`

                if (message.mentions.users.size) {
                    mentioned = args.join(' ')
                }

                let options = {
                    method: 'GET',
                    url: `${API}commands`,
                    qs: {
                        command: command
                    }
                }

                request(options, (error, response, body) => {
                    if (error) throw new Error(error)

                    if (!body.startsWith('<')) body = JSON.parse(body)
                    else body = ''

                    if (body.length > 0) {
                        body.forEach(v => {
                            if (v.attachment != '') {
                                message.channel.send(v.message == '' ? mentioned : mentioned + ' ' + v.message, {
                                    files: [v.attachment == null ? '' : v.attachment]
                                })
                            } else if (v.message != null) {
                                message.channel.send(v.message)
                            }
                        })
                    }
                })
            }
        } catch (error) {
            console.error(error)
            message.reply('There was an error trying to execute that command!')
        }
    }
})

process.on('unhandledRejection', err => {
    throw err
})

client.login(process.env.BOT_TOKEN)