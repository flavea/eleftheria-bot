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
    client.user.setActivity("!bantu & !new")
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
        const args = message.content.split(/ +/)
        const command = args.shift().toLowerCase()

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

                    if (!body.startsWith('<')) body = JSON.parse(body)
                    else body = ''

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
                    if (isNaN(body)) body = 16
                    let res = 'a'
                    while (isNaN(res)) res = Math.floor(Math.random() * body) + 1

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

                            if (!body.startsWith('<')) body = JSON.parse(body)
                            else body = ''

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
                    if (isNaN(body)) body = 16
                    let res = 'a'
                    while (isNaN(res)) res = Math.floor(Math.random() * body) + 1

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

                            if (!body.startsWith('<')) body = JSON.parse(body)
                            else body = ''

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
                    if (isNaN(body)) body = 16
                    let res = 'a'
                    while (isNaN(res)) res = Math.floor(Math.random() * body) + 1

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

                            if (!body.startsWith('<')) body = JSON.parse(body)
                            else body = ''

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

                            if (!body.startsWith('<')) body = JSON.parse(body)
                            else body = ''

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
                    if (isNaN(body)) body = 16
                    let res = 'a'
                    while (isNaN(res)) res = Math.floor(Math.random() * body) + 1

                    options = {
                        method: 'GET',
                        url: `${API}egossips`,
                        qs: {
                            gossip_id: res
                        }
                    }

                    request(options, (error, response, body) => {
                        if (error) throw new Error(error)

                        if (!body.startsWith('<')) body = JSON.parse(body)
                        else body = ''

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
                if (args.length > 0) count = args[0]
                if (count > 25) return message.reply('MAKSIMAL 25 YA!!')

                search.buildParams(message, client, ['-sort'], ['exp'])

                break
            case '!ddr':
                if (args.length == 0) return message.reply('Mana parameternyaa')
                else tools.rollMessage(message, args[0])
                break
            case '!latest':
                let amount = 10
                if (args.length == 0) amount = 10
                else if (isNaN(parseInt(args[0]))) return message.reply('Parameter harus angka oi.')
                else amount = parseInt(args[0])

                message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                eleftheria.fetchLatestTopics(client, message, amount)
                break
            case '!top':
                let limit = 10
                if (args.length == 0) limit = 10
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
                if (args.length == 0) return message.reply('Mau nyari siapa oi oi.')
                if (!args[0].startsWith('-')) {
                    let name = args[0]
                    if (args.length > 1) name = args.join(' ')
                    if (name.length < 3) message.reply('Minimal 3 karakter lah nyarinya :(')
                    else {
                        message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                        eleftheria.searchCampers(client, message, name)
                    }
                } else {
                    var pars = tools.paramBuilder(message, client, args)
                    var arguments = pars[0]
                    var queries = pars[1]

                    search.buildParams(message, client, arguments, queries)
                }
                break
            case '!detail':
                if (args.length == 0) return message.reply('Mau nyari siapa oi oi.')
                else if (isNaN(parseInt(args[0]))) return message.reply('Harus angka oi.')
                else {
                    message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                    eleftheria.getUser(client, message, args[0])
                }
                break
            case '!pvp':
                if (args.length == 0 || typeof args[1] == 'undefined') return message.reply('Harus ada dua id user oi.')
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
                    message.channel.send(args.join(', '), {
                        files: ["https://cdn.discordapp.com/attachments/572834275456450561/592364385083588608/3f00896020f874f55f19fb1ef39445ae.png"]
                    })
                }
                break
            case '!guide':
                if (!message.mentions.users.size) {
                    return message.reply('Tag orang dulu.')
                }

                message.channel.send(args.join(', '), {
                    files: ["https://cdn.discordapp.com/attachments/572834275456450561/592226480713367553/IMG_20190422_153330.jpg"]
                })
                break
            case '!kangen':
                if (args.length == 0 && !message.mentions.users.size) return message.reply('Makasih, tapi aku gak kangen kamu.')
                else if (args.length > 0 && !message.mentions.users.size) {
                    name = args.join(' ')
                    let user = message.guild.members.find(user => user.nickname == name)
                    if (user == null) user = message.guild.members.find(user => user.username == name)

                    if (user != null) {
                        if (message.author.id == user.id) return message.reply('Apa-apaan kangen diri sendiri. Cuh.')
                        else message.channel.send(`<@${user.id}>, katanya <@${message.author.id}> kangen nich. Unch, unch, ucu deh kalian. `)
                    } else return message.reply(`Uhmmm, ${name} gak ketemu di sini, coba cek lagi nicknamenya atau suruh orangnya bikin nama satu nama aja. Atau, lebih oke lagi, langsung ngomong ke orangnya.`)
                } else if (message.mentions.users.size) {
                    message.channel.send(`${args.join(', ')}, katanya <@${message.author.id}> kangen nich. Unch, unch, ucu deh kalian.`)
                }
                break
            case '!pukpuk':
                if (!message.mentions.users.size) {
                    return message.reply('Semangat! You can go through this! You are strooong~ https://i.gifer.com/7MPC.gif')
                }

                message.channel.send(args.join(', ') + ' Semangat! You can go through this! You are strooong~ https://i.gifer.com/7MPC.gif')
                break

            case '!hempas':
                if (args.length == 0 && !message.mentions.users.size) return message.reply('Maaf, aku unhempasable.')
                else if (args.length > 0 && !message.mentions.users.size) {
                    name = args.join(' ')
                    let user = message.guild.members.find(user => user.nickname == name)
                    if (user == null) user = message.guild.members.find(user => user.username == name)

                    if (user != null) {
                        if (message.author.id == user.id) return message.reply('Wah kamu maso ya hempas diri sendiri.')
                        else message.channel.send(`Dan <@${message.author.id}> pun berkata pada <@${user.id}>, "Maaf, aku terlalu baik untukmu. Lebih baik kamu pilih yang lain."`)
                    } else return message.reply(`Uhmmm, ${name} gak ketemu di sini, coba cek lagi nicknamenya atau suruh orangnya bikin nama satu nama aja. Atau, lebih oke lagi, langsung ngomong ke orangnya.`)
                } else if (message.mentions.users.size) {

                    message.channel.send(`Dan <@${message.author.id}> pun berkata pada ${args.join(', ')}, "Maaf, aku terlalu baik untukmu. Lebih baik kamu pilih yang lain."`)
                }
                break
            case '!howto':
                options = {
                    method: 'GET',
                    url: 'https://hargrimm-wikihow-v1.p.rapidapi.com/steps',
                    qs: {
                        count: '5'
                    },
                    headers: {
                        'X-RapidAPI-Key': 'c9ed88a6d7msh2bb16885ae42db6p18398djsn14a875b76406',
                        'X-RapidAPI-Host': 'hargrimm-wikihow-v1.p.rapidapi.com'
                    }
                };

                request(options, (error, response, body) => {
                    if (error) throw new Error(error);

                    body = JSON.parse(body)
                    body = Object.keys(body).map((key) => {
                        return [body[key]];
                    });

                    if (body.length > 0) {
                        let string = ''
                        body.forEach((v, i) => {
                            string += `${i+1}. ${v}\n`
                        })

                        message.channel.send(string)

                    }
                });

                break
            case '!love':
                if (args.length == 0) return message.reply('Mau hitung siapa?')
                else {
                    var pars = tools.paramBuilder(message, client, args)
                    var arguments = pars[0]
                    var queries = pars[1]

                    let fname = sname = ''
                    arguments.forEach((arg, idx) => {
                        if (arg == '-first') {
                            fname = queries[idx]
                        } else if (arg == '-second') {
                            sname = queries[idx]
                        }
                    })

                    if (fname == '' || sname == '') message.reply("Salah satu parameter salah")
                    else {
                        options = {
                            method: 'GET',
                            url: 'https://love-calculator.p.rapidapi.com/getPercentage',
                            qs: {
                                fname: fname,
                                sname: sname
                            },
                            headers: {
                                'X-RapidAPI-Key': 'c9ed88a6d7msh2bb16885ae42db6p18398djsn14a875b76406',
                                'X-RapidAPI-Host': 'love-calculator.p.rapidapi.com'
                            }
                        };

                        request(options, (error, response, body) => {
                            if (error) throw new Error(error);

                            body = JSON.parse(body)
                            console.log(body)
                            if (typeof body.message != 'undefined') message.reply('duh ada error, coba lagi deh')
                            else message.reply(`**${fname}/${sname}**: ${body.percentage}% jodoh. ${body.result}`)
                        });

                    }
                }
                break

            case '!convert':
                if (args.length == 0) return message.reply('Mau convert siapa?')
                else {
                    var pars = tools.paramBuilder(message, client, args)
                    var arguments = pars[0]
                    var queries = pars[1]

                    let from = to = ''
                    let amount = 1
                    arguments.forEach((arg, idx) => {
                        if (arg == '-from') {
                            from = queries[idx].toUpperCase()
                        } else if (arg == '-to') {
                            to = queries[idx].toUpperCase()
                        } else if (arg == '-amount') {
                            amount = parseInt(queries[idx])
                        }
                    })

                    if (isNaN(amount)) amount = 1

                    if (from == '' || to == '') message.reply("Salah satu parameter salah")
                    else {
                        options = {
                            method: 'GET',
                            url: 'https://fixer-fixer-currency-v1.p.rapidapi.com/convert',
                            qs: {
                                from: from,
                                to: to,
                                amount: amount
                            },
                            headers: {
                                'X-RapidAPI-Key': 'c9ed88a6d7msh2bb16885ae42db6p18398djsn14a875b76406',
                                'X-RapidAPI-Host': 'fixer-fixer-currency-v1.p.rapidapi.co'
                            }
                        };

                        request(options, (error, response, body) => {
                            if (error) throw new Error(error);

                            body = JSON.parse(body)
                            if (typeof body.message != 'undefined') message.reply('duh ada error, coba lagi deh')
                            else message.reply(`${from} ${amount} = ${to} ${body.result}`)
                        });

                    }
                }
                break

            case '!generate':

                let from = 'united states'
                if (args.length > 0) {

                    var pars = tools.paramBuilder(message, client, args)
                    var arguments = pars[0]
                    var queries = pars[1]

                    arguments.forEach((arg, idx) => {
                        if (arg == '-from') {
                            from = queries[idx].toUpperCase()
                        }
                    })
                }

                options = {
                    method: 'GET',
                    url: 'https://uinames.com/api/',
                    qs: {
                        ext: '',
                        region: from
                    }
                };

                request(options, (error, response, body) => {
                    if (error) throw new Error(error);

                    body = JSON.parse(body)
                    if (typeof body.error != 'undefined') message.reply(body.error)
                    else message.reply(`**${body.name + ' ' + body.surname}** - ${body.gender} - Birthday ${body.birthday.dmy.substring(0, 5)}`)
                });
                break

            case '!fmk':
                if (args.length == 0) return message.reply('Mau FMK siapa?')
                else {
                    message.channel.send(args.join(' ')).then(sentEmbed => {
                        sentEmbed.react("🇫")
                        sentEmbed.react("🇲")
                        sentEmbed.react("🇰")
                    })
                }
                break

            case '!fmk2':
                if (args.length != 3) return message.reply('Masukan 3 nama.')
                else {
                    for (let i = args.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [args[i], args[j]] = [args[j], args[i]];
                    }

                    let string = `I will F: ${args[0]}, M: ${args[1]}, K: ${args[2]}\n`
                    message.channel.send(string)
                }
                break

            case '!fmk3':
                if (args.length != 3) return message.reply('Masukan 3 nama.')
                else {

                    let string = `A. F: ${args[0]}, M: ${args[1]}, K: ${args[2]}\n`
                    string += `B. F: ${args[0]}, M: ${args[2]}, K: ${args[1]}\n`
                    string += `C. F: ${args[1]}, M: ${args[0]}, K: ${args[2]}\n`
                    string += `D. F: ${args[1]}, M: ${args[2]}, K: ${args[0]}\n`
                    string += `E. F: ${args[2]}, M: ${args[0]}, K: ${args[1]}\n`
                    string += `F. F: ${args[2]}, M: ${args[1]}, K: ${args[0]}\n`
                    message.channel.send(string).then(sentEmbed => {
                        sentEmbed.react("🇦")
                        sentEmbed.react("🇧")
                        sentEmbed.react("🇨")
                        sentEmbed.react("🇩")
                        sentEmbed.react("🇪")
                        sentEmbed.react("🇫")
                    })
                }
                break

            case '!bantu':
                options = {
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
                            commands.push(v.command)
                        })
                    }

                    commands.push('!gosip, !howto')
                    commands = commands.join(", ")

                    let rcommands = '**!curse <mention orangnya>** untuk merutuki orang, boleh tag lebih dari satu.\n'
                    rcommands += '**!praise <mention orangnya>**, boleh tag lebih dari satu.\n'
                    rcommands += '**!remind <mention orangnya>** untuk mengingatkan orang, boleh tag lebih dari satu.\n**!tagih <mention orangnya>** untuk tagih repp, boleh tag lebih dari satu.\n'
                    rcommands += '**!guide <mention orangnya>** untuk mengarahkan orang, boleh tag lebih dari satu.\n'
                    rcommands += '**!pukpuk <mention orangnya>** untuk ngepukpuk.\n'
                    rcommands += '**!kangen <nickname di server ini>** untuk bilang kangen via Nicollo.\n'
                    rcommands += '**!hempas <nickname di server ini>** untuk menghempas via Nicollo.\n'

                    let tcommands = '**!ddr 1d5** untuk dice roll\n'
                    tcommands += '**!love -first (nama 1) -second (nama 2)** untuk menghitung tingkat kejodohan. Kadang error, coba lagi aja terus.\n'
                    tcommands += '**!convert -from (kode negara) -to (kode negara) -amount (angka)** konversi mata uang hari ini\n'
                    tcommands += '**!generate -from (negara)** Untuk generate nama, gender, dan ulang tahun untuk inspirasi membuat karakter baru. parameter -from bersifat opsional, default united states.\n'
                    tcommands += '**!fmk (nama)** vote fuck, marry, kill untuk satu nama.\n'
                    tcommands += '**!fmk2 (nama1) (nama2) (nama3)** f, m, k pilihan Nicollo.\n'
                    tcommands += '**!fmk3 (nama1) (nama2) (nama3)** f, m, k pilihan masyarakat (alias pakai vote).'

                    let ecommands = '**!latest <angka>** untuk melihat latest topics di forum\n'
                    ecommands += '**!detail <userid>** untuk melihat data karakter agak lebih lengkap, ID bisa dicari pakai !search\n'
                    ecommands += '**!pvp <userid1> <userid2> <ronde>** simulasi PVP, ID bisa dicari pakai !search, kalau mau coba di channel yang sepi deh.\n'
                    ecommands += '**!toptoday** untuk melihat member terajin hari ini.\n'

                    let search = '**!search -parent (nama dewa/i atau UNCLAIMED)**, search berdasarkan orang tua.\n'
                    search += '**!search -ability (nama ability)**, search berdasarkan ability.\n'
                    search += '**!search -sort (Post/EXP/HP/ATK/DEF)**, search berdasarkan jumlah post/EXP/HP points.\n - Untuk post masih dapat menggunakan !top <limit>\n - Untuk EXP masih dapat menggunakan !topexp <limit>'

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
                break

            case '!new':

                let rcommands = 'Update: untuk parameter diganti dari -- menjadi - saja.\n'
                rcommands += '**!howto** tutorial random\n'
                rcommands += '**!love -first (nama 1) -second (nama 2)** untuk menghitung tingkat kejodohan. Kadang error, coba lagi aja terus.\n'
                rcommands += '**!convert -from (kode negara) -to (kode negara) -amount (angka)** konversi mata uang hari ini.\n'
                rcommands += '**!generate -from (negara)** Untuk generate nama, gender, dan ulang tahun untuk inspirasi membuat karakter baru. parameter -from bersifat opsional, default united states.\n'
                rcommands += '**!fmk (nama)** vote fuck, marry, kill.\n'


                let tcommands = '**!fmk2 (nama1) (nama2) (nama3)** f, m, k pilihan Nicollo.\n'
                tcommands += '**!fmk3 (nama1) (nama2) (nama3)** f, m, k pilihan masyarakat (alias pakai vote).'

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
                            name: 'July 23rd 2019',
                            value: tcommands
                        }, {
                            name: 'July 22nd 2019',
                            value: rcommands
                        }],
                        timestamp: new Date()
                    }
                })
                break
        }
    }
})

process.on('unhandledRejection', err => {
    throw err
})

client.login(process.env.BOT_TOKEN)