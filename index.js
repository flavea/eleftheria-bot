require('dotenv').config()

const discord = require('discord.js')
const eleftheria = require('./eleftheria.js')
const tools = require('./tools.js')
const request = require("request")
const client = new discord.Client()
const API = process.env.API
const reminders = ['Let go of the past. Today, you are a new person', 'Incase you have forgotten; you matter, you are loved, you are worthy', 'You can not do everything on a single day.', 'Lighten up on yourself. No one is perfect. Gently accept your humanness.', 'If you look into your own heart, and you find nothing wrong there, what is there to worry about? What is there to fear.', 'Nothing external to you has any power over you.', 'Self-compassion is simply giving the same kindness to ourselves that we would give to others.', 'You are beautiful. Know this. Anyone who tells you otherwise is simply lying. You are beautiful. ', 'Love yourself first, and everything else falls in line. You really have to love yourself to get anything done in this world.', 'To be beautiful means to be yourself. You don not need to be accepted by others. You need to accept yourself. ', 'You must love yourself before you love another. By accepting yourself and fully being what you are, your simple presence can make others happy.', 'Stop focusing on how stressed you are, and remember how blessed you are.']


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity("with your heart");
})

client.on('message', message => {
    const len = reminders.length;
    const res = Math.floor(Math.random() * (len - 1))
    if (!message.content.startsWith('!') && message.isMentioned(client.user) && !message.author.bot) return message.reply(reminders[res] + ' If you need some help, use `!bantu`');
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.split(/ +/);
    const command = args.shift().toLowerCase();
    let mentioned = ''

    switch (command) {
        default:
            var options = {
                method: 'GET',
                url: `${API}commands`,
                qs: {
                    command: command
                }
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                body = JSON.parse(body)

                if (body.length > 0) {
                    body.forEach(v => {
                        if (v.attachment != '') {
                            message.channel.send(v.message == '' ? '' : v.message, {
                                files: [v.attachment == null ? '' : v.attachment]
                            });
                        } else if (v.message != null) {
                            message.channel.send(v.message)
                        }
                    })
                }
            });
            break
        case '!curse':
            if (!message.mentions.users.size) {
                return message.reply('Tag dulu orangnya woy.');
            }

            var options = {
                method: 'GET',
                url: `${API}curses/count`
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                body = parseInt(body)

                message.mentions.users.forEach(tagged => {
                    const res = Math.floor(Math.random() * body) + 1

                    options = {
                        method: 'GET',
                        url: `${API}curses`,
                        qs: {
                            curse_id: res
                        }
                    };

                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);

                        body = JSON.parse(body)

                        if (body.length > 0) message.channel.send(`${body[0].curse} kamu, <@${tagged.id}>!`);
                    });

                })
            });

            break;
        case '!praise':
            if (!message.mentions.users.size) {
                return message.reply('Tag dulu orangnya woy.');
            }

            var options = {
                method: 'GET',
                url: `${API}curses/count`
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                body = parseInt(body)

                message.mentions.users.forEach(tagged => {
                    const res = Math.floor(Math.random() * body) + 1

                    options = {
                        method: 'GET',
                        url: `${API}curses`,
                        qs: {
                            curse_id: res
                        }
                    };

                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);

                        body = JSON.parse(body)

                        if (body.length > 0) message.channel.send(`${body[0].curse} kamu, <@${tagged.id}>!`);
                    });

                })
            });
            break;
        case '!remind':

            var options = {
                method: 'GET',
                url: `${API}reminders/count`
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                body = parseInt(body)


                const res = Math.floor(Math.random() * body) + 1

                options = {
                    method: 'GET',
                    url: `${API}reminders`,
                    qs: {
                        quote_id: res
                    }
                };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);

                    body = JSON.parse(body)

                    if (body.length > 0) {

                        if (!message.mentions.users.size) {
                            return message.reply(body[0].quote);
                        }

                        message.mentions.users.forEach(tagged => {
                            message.channel.send(`<@${tagged.id}> ${body[0].quote}`);
                        })

                    }
                });
            });

            break;

        case '!topexp':
            let count = 10
            let list = []
            if (typeof args[0] != 'undefined') count = args[0]
            if (count > 25) return message.reply('MAKSIMAL 25 YA!!');

            message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')

            var options = {
                method: 'GET',
                url: `${API}emembers?_sort=EXP:DESC&_limit=${count}`
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                body = JSON.parse(body)

                body.forEach((d, i) => {
                    list.push({
                        name: `RANK ${i+1} - ${d.Name} (${d.UserID})`,
                        value: `**EXP**: ${d.EXP} - **HP**: ${d.HP} - **ATK**: ${d.ATK} - **DEF**: ${d.DEF} [[Go to Profile](${d.Link})]`
                    })
                })

                list.push({
                    name: `LEBIH DETAIL`,
                    value: `Untuk melihat data dengan lebih lengkap dan sortir berdasarkan HP, DEF, atau ATK, kunjungi [ini](http://eleftheria-bot.herokuapp.com/stats)`
                })

                message.channel.send({
                    embed: {
                        color: 3447003,
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        title: "Top EXP Points",
                        url: 'http://eleftheria-bot.herokuapp.com/stats',
                        description: "Members dengan EXP points terbesar.",
                        fields: list,
                        timestamp: new Date()
                    }
                });
            });

            break;
        case '!ddr':
            if (typeof args[0] == 'undefined') return message.reply('Mana parameternyaa');
            else tools.rollMessage(message, args[0])
            break
        case '!latest':
            let amount = 10
            if (typeof args[0] == 'undefined') amount = 10
            else if (isNaN(parseInt(args[0]))) return message.reply('Parameter harus angka oi.');
            else amount = parseInt(args[0])

            message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
            eleftheria.fetchLatestTopics(client, message, amount)
            break
        case '!top':
            let limit = 10
            if (typeof args[0] == 'undefined') limit = 10
            else if (isNaN(parseInt(args[0]))) return message.reply('Parameter harus angka oi.');
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
            if (typeof args[0] == 'undefined') return message.reply('Mau nyari siapa oi oi.');
            else if (args[0] == '--parent') {
                if (typeof args[1] == 'undefined') return message.reply('Mau nyari siapa oi oi.');
                else {
                    let parent = args[1].toUpperCase()
                    if (args.length > 2) args = args.shift().join(' ')

                    message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')

                    var options = {
                        method: 'GET',
                        url: `${API}emembers?_sort=EXP:DESC&Title_contains=${parent}`
                    };

                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);

                        body = JSON.parse(body)
                        if (body.length > 0) {
                            var str = []
                            var idx = 0
                            str[idx] = ''
                            body.forEach(d => {
                                let newstr = `**${d.UserID} - ${d.Name}** | **Post Count:** ${d.Post} | **HP:** ${d.HP} | **EXP:** ${d.EXP} | **ATK**: 1d${d.ATK}+${d.ATKP} | **DEF**: 1d${d.DEF}+${d.DEFP} [[Go to Profile](${d.Link})]\n`

                                let cpl = newstr + str[idx]
                                if (cpl.length <= 1024) str[idx] = cpl
                                else {
                                    idx++
                                    str[idx] = newstr
                                }
                            })

                            let list = []
                            str.forEach(d => {
                                list.push({
                                    name: `CHILDREN OF ${parent}`,
                                    value: d
                                })
                            })

                            message.channel.send({
                                embed: {
                                    color: 3447003,
                                    author: {
                                        name: client.user.username,
                                        icon_url: client.user.avatarURL
                                    },
                                    fields: list,
                                    timestamp: new Date()
                                }
                            });
                        } else return message.reply(`${parent} BELUM PUNYA ANAK AAAAAAH.`);
                    });
                }

            } else if (args[0] == '--ability') {
                if (typeof args[1] == 'undefined') return message.reply('Mau nyari apa oi oi.');
                else {
                    let ability = tools.titleCase(args[1])
                    if (args.length > 2) args = args.shift().join(' ')
                    var options = {
                        method: 'GET',
                        url: `${API}emembers?_sort=EXP:DESC&Ability_contains=${ability}`
                    };

                    message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')

                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);

                        body = JSON.parse(body)
                        if (body.length > 0) {
                            var str = []
                            var idx = 0
                            str[idx] = ''
                            body.forEach(d => {
                                let newstr = `**${d.UserID} - ${d.Name}** | **Post Count:** ${d.Post} | **HP:** ${d.HP} | **EXP:** ${d.EXP} | **ATK**: 1d${d.ATK}+${d.ATKP} | **DEF**: 1d${d.DEF}+${d.DEFP} [[Go to Profile](${d.Link})]\n`

                                let cpl = newstr + str[idx]
                                if (cpl.length <= 1024) str[idx] = cpl
                                else {
                                    idx++
                                    str[idx] = newstr
                                }
                            })

                            let list = []
                            str.forEach(d => {
                                list.push({
                                    name: `${ability} Users`,
                                    value: d
                                })
                            })

                            message.channel.send({
                                embed: {
                                    color: 3447003,
                                    author: {
                                        name: client.user.username,
                                        icon_url: client.user.avatarURL
                                    },
                                    fields: list,
                                    timestamp: new Date()
                                }
                            });
                        } else return message.reply(`${parent} BELUM PUNYA ANAK AAAAAAH.`);
                    });
                }

            } else if (args[0] == '--sort') {
                if (typeof args[1] == 'undefined') return message.reply('Mau nyari apa oi oi.');
                else if (args[1].toLowerCase() != "post" && args[1].toLowerCase() != "exp" && args[1].toLowerCase() != "hp" && args[1].toLowerCase() != "atk" && args[1].toLowerCase() != "def") return message.reply(`Tidak bisa sort pakai ${args[1]}`);
                else {
                    let sort = args[1].toLowerCase()
                    let count = 10
                    let list = []
                    if (typeof args[2] != 'undefined') count = args[2]
                    if (count > 20) return message.reply('MAKSIMAL 20 YA!!');
                    if (sort == "exp" || sort == "hp" || sort == "atk" || sort == "def") {

                        message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                        var options = {
                            method: 'GET',
                            url: `${API}emembers?_sort=${sort.toUpperCase()}:DESC&_limit=${count}`
                        };

                        request(options, function (error, response, body) {
                            if (error) throw new Error(error);

                            body = JSON.parse(body)

                            body.forEach((d, i) => {
                                list.push({
                                    name: `RANK ${i+1} - ${d.Name} (${d.UserID})`,
                                    value: `**EXP**: ${d.EXP} - **HP**: ${d.HP} - **ATK**: 1d${d.ATK}+${d.ATKP} - **DEF**: 1d${d.DEF}+${d.DEFP} [[Go to Profile](${d.Link})]`
                                })
                            })

                            list.push({
                                name: `LEBIH DETAIL`,
                                value: `Untuk melihat data dengan lebih lengkap dan sortir berdasarkan HP, DEF, atau ATK, kunjungi [ini](http://eleftheria-bot.herokuapp.com/stats)`
                            })

                            message.channel.send({
                                embed: {
                                    color: 3447003,
                                    author: {
                                        name: client.user.username,
                                        icon_url: client.user.avatarURL
                                    },
                                    title: `Top ${sort.toUpperCase()} Points`,
                                    url: 'http://eleftheria-bot.herokuapp.com/stats',
                                    description: `Members dengan ${sort.toUpperCase()} points terbesar.`,
                                    fields: list,
                                    timestamp: new Date()
                                }
                            });
                        });
                    } else if (sort == "post") {
                        message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                        eleftheria.getTopCampers(client, message, count)
                    }
                }

            } else {
                let name = args[0]
                if (args.length > 1) name = args.join(' ')
                if (name.length < 3) message.reply('Minimal 3 karakter lah nyarinya :(')
                else {
                    message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                    eleftheria.searchCampers(client, message, name)
                }
            }
            break
        case '!detail':
            if (typeof args[0] == 'undefined') return message.reply('Mau nyari siapa oi oi.');
            else if (isNaN(parseInt(args[0]))) return message.reply('Harus angka oi.');
            else {
                message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                eleftheria.getUser(client, message, args[0])
            }
            break;
        case '!pvp':
            if (typeof args[0] == 'undefined' || typeof args[1] == 'undefined') return message.reply('Harus ada dua id user oi.');
            else if (isNaN(parseInt(args[0])) || isNaN(parseInt(args[1]))) return message.reply('Harus angka oi ID-nya.');
            else if (message.content.trim() == '!pvp 286 286') return message.reply('Maaf, pvp Nicollo vs Nicollo tanpa limit ronde diban, lelah lihatnya.');
            else if (message.content.trim() == '!pvp 189 189') return message.reply('Maaf, pvp Dorcas vs Dorcas juga  diban kalau tanpa limit ronde, *please have mercy*.');
            else {
                let ronde = ''
                if (typeof args[2] != 'undefined' && !isNaN(parseInt(args[2]))) ronde = parseInt(args[2])
                if (ronde > 300) return message.reply('Maaf, ronde gak boleh lebih dari 300. Cape.');
                message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                eleftheria.PvP(client, message, args[0], args[1], ronde)
            }
            break;
        case '!tagih':
            if (!message.mentions.users.size) {
                message.channel.send("", {
                    files: ["https://cdn.discordapp.com/attachments/572834275456450561/592364385083588608/3f00896020f874f55f19fb1ef39445ae.png"]
                });
            } else {
                message.mentions.users.forEach(tagged => {
                    mentioned += `<@${tagged.id}> `
                })

                message.channel.send(mentioned, {
                    files: ["https://cdn.discordapp.com/attachments/572834275456450561/592364385083588608/3f00896020f874f55f19fb1ef39445ae.png"]
                });
            }
            break;
        case '!guide':
            if (!message.mentions.users.size) {
                return message.reply('Tag orang dulu.');
            }

            message.mentions.users.forEach(tagged => {
                mentioned += `<@${tagged.id}> `
            })

            message.channel.send(mentioned, {
                files: ["https://cdn.discordapp.com/attachments/572834275456450561/592226480713367553/IMG_20190422_153330.jpg"]
            });
            break
        case '!kangen':
            if (typeof args[0] == 'undefined' && !message.mentions.users.size) return message.reply('Makasih, tapi aku gak kangen kamu.');
            else if (typeof args[0] != 'undefined' && !message.mentions.users.size) {
                name = args.join(' ')
                let user = message.guild.members.find(user => user.nickname == name);
                if (user == null) user = message.guild.members.find(user => user.username == name);

                if (user != null) {
                    if (message.author.id == user.id) return message.reply('Apa-apaan kangen diri sendiri. Cuh.');
                    else message.channel.send(`<@${user.id}>, katanya <@${message.author.id}> kangen nich. Unch, unch, ucu deh kalian. `);
                } else return message.reply(`Uhmmm, ${name} gak ketemu di sini, coba cek lagi nicknamenya atau suruh orangnya bikin nama satu nama aja. Atau, lebih oke lagi, langsung ngomong ke orangnya.`);
            } else if (message.mentions.users.size) {
                message.mentions.users.forEach(tagged => {
                    mentioned += `<@${tagged.id}> `
                })

                message.channel.send(`${mentioned}, katanya <@${message.author.id}> kangen nich. Unch, unch, ucu deh kalian.`);
            }
            break
        case '!bantu':
            var options = {
                method: 'GET',
                url: `${API}commands`
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                body = JSON.parse(body)
                commands = []

                if (body.length > 0) {
                    body.forEach(v => {
                        commands.push(v.command)
                    })
                }

                commands = commands.join(", ")

                let rcommands = '**!curse <mention orangnya>** untuk merutuki orang, boleh tag lebih dari satu.\n'
                rcommands += '**!praise <mention orangnya>**, boleh tag lebih dari satu.\n'
                rcommands += '**!remind <mention orangnya>** untuk mengingatkan orang, boleh tag lebih dari satu.\n**!tagih <mention orangnya>** untuk tagih repp, boleh tag lebih dari satu.\n'
                rcommands += '**!tagih <mention orangnya>** untuk tagih repp, boleh tag lebih dari satu.\n'
                rcommands += '**!guide <mention orangnya>** untuk mengarahkan orang, boleh tag lebih dari satu.\n'
                rcommands += '**!kangen <nickname di server ini>** untuk bilang kangen via Nicollo.\n'
                rcommands += '**!ddr 1d5** untuk dice roll'


                let ecommands = '**!latest <angka>** untuk melihat latest topics di forum\n'
                ecommands += '**!detail <userid>** untuk melihat data karakter agak lebih lengkap, ID bisa dicari pakai !search\n'
                ecommands += '**!pvp <userid1> <userid2> <ronde>** simulasi PVP, ID bisa dicari pakai !search, kalau mau coba di channel yang sepi deh.'

                let search = 'Seluruh filter search ini belum bisa digabung dengan satu sama lain ya.\n**!search <nama>** untuk mencari karakter\n'
                search += '**!search --parent (nama dewa/i atau UNCLAIMED)**, search berdasarkan orang tua.\n'
                search += '**!search --ability (nama ability)**, search berdasarkan ability.\n'
                search += '**!search --sort (Post/EXP/HP/ATK/DEF) <limit>**, search berdasarkan jumlah post/EXP/HP points.\n - Untuk post masih dapat menggunakan !top <limit>\n - Untuk EXP masih dapat menggunakan !topexp <limit>'

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
                });
            });
            break

    }
})

process.on('unhandledRejection', err => {
    throw err;
});

client.login(process.env.BOT_TOKEN)