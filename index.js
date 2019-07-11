require('dotenv').config()

const discord = require('discord.js')
const eleftheria = require('./eleftheria.js')
const tools = require('./tools.js')
const search = require('./search.js')
const request = require("request")
const client = new discord.Client()
const API = process.env.API
const newMembers = []

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity("with the curves of your body")
})

client.on("guildMemberAdd", (member) => {
    const guild = member.guild
    if (!newMembers[guild.id]) newMembers[guild.id] = new discord.Collection()
    newMembers[guild.id].set(member.id, member.user)

    if (newMembers[guild.id].size >= 1) {
        const userlist = newMembers[guild.id].map(u => u.toString()).join(" ")
        guild.channels.find(channel => channel.id === process.env.MAIN_CHANNEL_ID).send(`Selamat datang ${userlist} hihihi. Cek <#${process.env.RULE_CHANNEL_ID}> untuk membaca peraturan server dan <#${process.env.GUIDE_CHANNEL_ID}> untuk petunjuk hidup. Jangan lupa juga perkenalkan diri kamu di sini, uwu. *Happy roleplaying*!`)
        newMembers[guild.id].clear()
    }
})

client.on("guildMemberRemove", (member) => {
    const guild = member.guild
    if (newMembers[guild.id].has(member.id)) newMembers.delete(member.id)
})

client.on('message', message => {
    let found = false
    let options = {}

    message.mentions.users.forEach(tagged => {
        if (client.user.id == tagged.id) found = true
    })
    if (message.content.startsWith('!') && (message.isMentioned(client.user) || found) && !message.author.bot) {
        let ay = ['cuh', 'ayyyy', 'hmmm', 'TAT', 'ihihihihi', 'kya kya']
        const res = Math.floor(Math.random() * ay.length) + 1
        return message.reply(ay[res] + '! If you need some help, use `!bantu`')
    } else if (!message.content.startsWith('!') && (message.isMentioned(client.user) || found) && !message.author.bot) {
        options = {
            method: 'GET',
            url: `${API}reminders/count`
        }

        request(options, (error, response, body) => {
            if (error) throw new Error(error)

            body = parseInt(body)
            const res = Math.floor(Math.random() * body) + 1

            let options = {
                method: 'GET',
                url: `${API}reminders`,
                qs: {
                    quote_id: res
                }
            }

            request(options, (error, response, body) => {
                if (error) throw new Error(error)

                body = JSON.parse(body)

                if (body.length > 0) return message.reply(body[0].quote + ' If you need some help, use `!bantu`')
                else {
                    console.log("Reminder Error: " + res)
                    return message.reply('Yah, ada error! Coba lagi atau cek `!bantu` deh.')
                }
            })
        })
    } else if (!message.content.startsWith('!') || message.author.bot) return
    else {
        const args = message.content.split(/ +/)
        const command = args.shift().toLowerCase()
        let mentioned = ''

        switch (command) {
            default:
                options = {
                    method: 'GET',
                    url: `${API}commands`,
                    qs: {
                        command: command
                    }
                }

                request(options, (error, response, body) => {
                    if (error) throw new Error(error)

                    body = JSON.parse(body)

                    if (body.length > 0) {
                        body.forEach(v => {
                            if (v.attachment != '') {
                                message.channel.send(v.message == '' ? '' : v.message, {
                                    files: [v.attachment == null ? '' : v.attachment]
                                })
                            } else if (v.message != null) {
                                message.channel.send(v.message)
                            }
                        })
                    }
                })
                break
            case '!curse':
                if (!message.mentions.users.size) {
                    return message.reply('Tag dulu orangnya woy.')
                }

                options = {
                    method: 'GET',
                    url: `${API}curses/count`
                }

                request(options, (error, response, body) => {
                    if (error) throw new Error(error)

                    body = parseInt(body)

                    message.mentions.users.forEach(tagged => {
                        const res = Math.floor(Math.random() * body) + 1

                        options = {
                            method: 'GET',
                            url: `${API}curses`,
                            qs: {
                                curse_id: res
                            }
                        }

                        request(options, (error, response, body) => {
                            if (error) throw new Error(error)

                            body = JSON.parse(body)

                            if (body.length > 0) message.channel.send(`${body[0].curse} kamu, <@${tagged.id}>!`)
                            else {
                                console.log("Curse Error: " + res)
                                return message.reply('Yah, ada error! Coba lagi atau cek `!bantu` deh.')
                            }
                        })

                    })
                })

                break
            case '!praise':
                if (!message.mentions.users.size) {
                    return message.reply('Tag dulu orangnya woy.')
                }

                options = {
                    method: 'GET',
                    url: `${API}curses/count`
                }

                request(options, (error, response, body) => {
                    if (error) throw new Error(error)

                    body = parseInt(body)

                    message.mentions.users.forEach(tagged => {
                        const res = Math.floor(Math.random() * body) + 1

                        options = {
                            method: 'GET',
                            url: `${API}curses`,
                            qs: {
                                curse_id: res
                            }
                        }

                        request(options, (error, response, body) => {
                            if (error) throw new Error(error)

                            body = JSON.parse(body)

                            if (body.length > 0) message.channel.send(`${body[0].curse} kamu, <@${tagged.id}>!`)
                            else {
                                console.log("Curse Error: " + res)
                                return message.reply('Yah, ada error! Coba lagi atau cek `!bantu` deh.')
                            }
                        })

                    })
                })
                break
            case '!remind':

                options = {
                    method: 'GET',
                    url: `${API}reminders/count`
                }

                request(options, (error, response, body) => {
                    if (error) throw new Error(error)

                    body = parseInt(body)

                    if (!message.mentions.users.size) {
                        const res = Math.floor(Math.random() * body) + 1

                        options = {
                            method: 'GET',
                            url: `${API}reminders`,
                            qs: {
                                quote_id: res
                            }
                        }

                        request(options, (error, response, body) => {
                            if (error) throw new Error(error)

                            body = JSON.parse(body)

                            if (body.length > 0) return message.reply(body[0].quote)
                            else {
                                console.log("Reminder Error: " + res)
                                return message.reply('Yah, ada error! Coba lagi atau cek `!bantu` deh.')
                            }
                        })
                    }

                    message.mentions.users.forEach(tagged => {
                        const res = Math.floor(Math.random() * body) + 1

                        options = {
                            method: 'GET',
                            url: `${API}reminders`,
                            qs: {
                                quote_id: res
                            }
                        }

                        request(options, (error, response, body) => {
                            if (error) throw new Error(error)

                            body = JSON.parse(body)

                            if (body.length > 0) message.channel.send(`<@${tagged.id}> ${body[0].quote}`)
                            else {
                                console.log("Reminder Error: " + res)
                                return message.reply('Yah, ada error! Coba lagi atau cek `!bantu` deh.')
                            }
                        })
                    })
                })

                break

            case '!gosip':

                options = {
                    method: 'GET',
                    url: `${API}egossips/count`
                }

                request(options, (error, response, body) => {
                    if (error) throw new Error(error)

                    body = parseInt(body)

                    const res = Math.floor(Math.random() * body) + 1

                    options = {
                        method: 'GET',
                        url: `${API}egossips`,
                        qs: {
                            gossip_id: res
                        }
                    }

                    request(options, (error, response, body) => {
                        if (error) throw new Error(error)

                        body = JSON.parse(body)

                        if (body.length > 0) return message.reply(body[0].gossip)
                        else {
                            console.log("Gosip Error: " + res)
                            return message.reply('Yah, ada error! Coba lagi atau cek `!bantu` deh.')
                        }
                    })
                })

                break
            case '!topexp':
                let count = 10
                if (typeof args[0] != 'undefined') count = args[0]
                if (count > 25) return message.reply('MAKSIMAL 25 YA!!')

                search.buildParams(message, client, ['--sort'], ['exp'])

                break
            case '!ddr':
                if (typeof args[0] == 'undefined') return message.reply('Mana parameternyaa')
                else tools.rollMessage(message, args[0])
                break
            case '!latest':
                let amount = 10
                if (typeof args[0] == 'undefined') amount = 10
                else if (isNaN(parseInt(args[0]))) return message.reply('Parameter harus angka oi.')
                else amount = parseInt(args[0])

                message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                eleftheria.fetchLatestTopics(client, message, amount)
                break
            case '!top':
                let limit = 10
                if (typeof args[0] == 'undefined') limit = 10
                else if (isNaN(parseInt(args[0]))) return message.reply('Parameter harus angka oi.')
                else limit = parseInt(args[0])

                if (limit > 20) return message.reply('Limit maksimal 20!')

                message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                eleftheria.getTopCampers(client, message, limit)
                break

            case '!toptoday':
                message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                eleftheria.getTopToday(client, message)
                break
            case '!search':
                if (typeof args[0] == 'undefined') return message.reply('Mau nyari siapa oi oi.')
                if (!args[0].startsWith('--')) {
                    let name = args[0]
                    if (args.length > 1) name = args.join(' ')
                    if (name.length < 3) message.reply('Minimal 3 karakter lah nyarinya :(')
                    else {
                        message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                        eleftheria.searchCampers(client, message, name)
                    }
                } else {
                    var arguments = []
                    var queries = []

                    args.forEach((arg, idx) => {
                        if (arg.startsWith("--")) {
                            let new_idx = idx + 1
                            let params = []
                            if (typeof args[new_idx] == 'undefined' || args[new_idx].startsWith("--")) return message.reply('Salah satu filter pencarian tak memiliki parameter.')
                            else {
                                while (typeof args[new_idx] != 'undefined' && !args[new_idx].startsWith("--")) {
                                    params.push(args[new_idx])
                                    new_idx++
                                }
                            }
                            arguments.push(arg.toLowerCase())
                            queries.push(params.join(' '))
                        }
                    })

                    search.buildParams(message, client, arguments, queries)
                }
                break
            case '!detail':
                if (typeof args[0] == 'undefined') return message.reply('Mau nyari siapa oi oi.')
                else if (isNaN(parseInt(args[0]))) return message.reply('Harus angka oi.')
                else {
                    message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                    eleftheria.getUser(client, message, args[0])
                }
                break
            case '!pvp':
                if (typeof args[0] == 'undefined' || typeof args[1] == 'undefined') return message.reply('Harus ada dua id user oi.')
                else if (isNaN(parseInt(args[0])) || isNaN(parseInt(args[1]))) return message.reply('Harus angka oi ID-nya.')
                else if (message.content.trim() == '!pvp 286 286') return message.reply('Maaf, pvp Nicollo vs Nicollo tanpa limit ronde diban, lelah lihatnya.')
                else if (message.content.trim() == '!pvp 189 189') return message.reply('Maaf, pvp Dorcas vs Dorcas juga  diban kalau tanpa limit ronde, *please have mercy*.')
                else if (message.content.trim() == '!pvp 228 228') return message.reply('Maaf, pvp Lorcan vs Lorvan juga  diban kalau tanpa limit ronde, *please have mercy*.')
                else if (message.content.trim() == '!pvp 286 189' || message.content.trim() == '!pvp 189 286' || message.content.trim() == '!pvp 189 228' || message.content.trim() == '!pvp 228 189' || message.content.trim() == '!pvp 286 228' || message.content.trim() == '!pvp 228 286') return message.reply('PvP ini diban. *please have mercy*.')
                else {
                    let ronde = ''
                    if (typeof args[2] != 'undefined' && !isNaN(parseInt(args[2]))) ronde = parseInt(args[2])
                    if (ronde > 300) return message.reply('Maaf, ronde gak boleh lebih dari 300. Cape.')
                    message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                    eleftheria.PvP(client, message, args[0], args[1], ronde)
                }
                break
            case '!tagih':
                if (!message.mentions.users.size) {
                    message.channel.send("", {
                        files: ["https://cdn.discordapp.com/attachments/572834275456450561/592364385083588608/3f00896020f874f55f19fb1ef39445ae.png"]
                    })
                } else {
                    message.mentions.users.forEach(tagged => {
                        mentioned += `<@${tagged.id}> `
                    })

                    message.channel.send(mentioned, {
                        files: ["https://cdn.discordapp.com/attachments/572834275456450561/592364385083588608/3f00896020f874f55f19fb1ef39445ae.png"]
                    })
                }
                break
            case '!guide':
                if (!message.mentions.users.size) {
                    return message.reply('Tag orang dulu.')
                }

                message.mentions.users.forEach(tagged => {
                    mentioned += `<@${tagged.id}> `
                })

                message.channel.send(mentioned, {
                    files: ["https://cdn.discordapp.com/attachments/572834275456450561/592226480713367553/IMG_20190422_153330.jpg"]
                })
                break
            case '!kangen':
                if (typeof args[0] == 'undefined' && !message.mentions.users.size) return message.reply('Makasih, tapi aku gak kangen kamu.')
                else if (typeof args[0] != 'undefined' && !message.mentions.users.size) {
                    name = args.join(' ')
                    let user = message.guild.members.find(user => user.nickname == name)
                    if (user == null) user = message.guild.members.find(user => user.username == name)

                    if (user != null) {
                        if (message.author.id == user.id) return message.reply('Apa-apaan kangen diri sendiri. Cuh.')
                        else message.channel.send(`<@${user.id}>, katanya <@${message.author.id}> kangen nich. Unch, unch, ucu deh kalian. `)
                    } else return message.reply(`Uhmmm, ${name} gak ketemu di sini, coba cek lagi nicknamenya atau suruh orangnya bikin nama satu nama aja. Atau, lebih oke lagi, langsung ngomong ke orangnya.`)
                } else if (message.mentions.users.size) {
                    message.mentions.users.forEach(tagged => {
                        mentioned += `<@${tagged.id}> `
                    })

                    message.channel.send(`${mentioned}, katanya <@${message.author.id}> kangen nich. Unch, unch, ucu deh kalian.`)
                }
                break
            case '!pukpuk':
                if (!message.mentions.users.size) {
                    return message.reply('Semangat! You can go through this! You are strooong~ https://i.gifer.com/7MPC.gif')
                }

                message.mentions.users.forEach(tagged => {
                    mentioned += `<@${tagged.id}>`
                })

                message.channel.send(mentioned + ' Semangat! You can go through this! You are strooong~ https://i.gifer.com/7MPC.gif')
                break

            case '!hempas':
                if (typeof args[0] == 'undefined' && !message.mentions.users.size) return message.reply('Maaf, aku unhempasable.')
                else if (typeof args[0] != 'undefined' && !message.mentions.users.size) {
                    name = args.join(' ')
                    let user = message.guild.members.find(user => user.nickname == name)
                    if (user == null) user = message.guild.members.find(user => user.username == name)

                    if (user != null) {
                        if (message.author.id == user.id) return message.reply('Wah kamu maso ya hempas diri sendiri.')
                        else message.channel.send(`Dan <@${message.author.id}> pun berkata pada <@${user.id}>, "Maaf, aku terlalu baik untukmu. Lebih baik kamu pilih yang lain."`)
                    } else return message.reply(`Uhmmm, ${name} gak ketemu di sini, coba cek lagi nicknamenya atau suruh orangnya bikin nama satu nama aja. Atau, lebih oke lagi, langsung ngomong ke orangnya.`)
                } else if (message.mentions.users.size) {
                    message.mentions.users.forEach(tagged => {
                        mentioned += `<@${tagged.id}>, `
                    })

                    message.channel.send(`Dan <@${message.author.id}> pun berkata pada <@${mentioned}>, "Maaf, aku terlalu baik untukmu. Lebih baik kamu pilih yang lain."`)
                }
                break
            case '!bantu':
                options = {
                    method: 'GET',
                    url: `${API}commands`
                }

                request(options, (error, response, body) => {
                    if (error) throw new Error(error)

                    body = JSON.parse(body)
                    commands = []

                    if (body.length > 0) {
                        body.forEach(v => {
                            commands.push(v.command)
                        })
                    }

                    commands.push('!gosip')
                    commands = commands.join(", ")

                    let rcommands = '**!curse <mention orangnya>** untuk merutuki orang, boleh tag lebih dari satu.\n'
                    rcommands += '**!praise <mention orangnya>**, boleh tag lebih dari satu.\n'
                    rcommands += '**!remind <mention orangnya>** untuk mengingatkan orang, boleh tag lebih dari satu.\n**!tagih <mention orangnya>** untuk tagih repp, boleh tag lebih dari satu.\n'
                    rcommands += '**!guide <mention orangnya>** untuk mengarahkan orang, boleh tag lebih dari satu.\n'
                    rcommands += '**!pukpuk <mention orangnya>** untuk ngepukpuk.\n'
                    rcommands += '**!kangen <nickname di server ini>** untuk bilang kangen via Nicollo.\n'
                    rcommands += '**!ddr 1d5** untuk dice roll'


                    let ecommands = '**!latest <angka>** untuk melihat latest topics di forum\n'
                    ecommands += '**!detail <userid>** untuk melihat data karakter agak lebih lengkap, ID bisa dicari pakai !search\n'
                    ecommands += '**!pvp <userid1> <userid2> <ronde>** simulasi PVP, ID bisa dicari pakai !search, kalau mau coba di channel yang sepi deh.\n'
                    ecommands += '**!toptoday** untuk melihat member terajin hari ini.\n'

                    let search = '**!search --parent (nama dewa/i atau UNCLAIMED)**, search berdasarkan orang tua.\n'
                    search += '**!search --ability (nama ability)**, search berdasarkan ability.\n'
                    search += '**!search --sort (Post/EXP/HP/ATK/DEF)**, search berdasarkan jumlah post/EXP/HP points.\n - Untuk post masih dapat menggunakan !top <limit>\n - Untuk EXP masih dapat menggunakan !topexp <limit>'

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
                break
        }
    }
})

process.on('unhandledRejection', err => {
    throw err
})

client.login(process.env.BOT_TOKEN)