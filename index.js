require('dotenv').config()

const discord = require('discord.js')
const eleftheria = require('./eleftheria.js')
const tools = require('./tools.js')
const client = new discord.Client()
const curses = ['jomblo', 'gamon', 'bucin', 'emo', 'sayang', 'kangen', 'cinta', 'belok', 'kotor', 'suci', 'lemah', 'ingin']
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

    if (command === '!curse' || command === '!praise') {
        if (!message.mentions.users.size) {
            return message.reply('Tag dulu orangnya woy.');
        }

        message.mentions.users.forEach(tagged => {
            const len = curses.length;
            const res = Math.floor(Math.random() * (len - 1))

            message.channel.send(`${curses[res]} kamu, <@${tagged.id}>!`);
        })
    }
    if (command === '!remind') {
        if (!message.mentions.users.size) {
            const len = reminders.length;
            const res = Math.floor(Math.random() * (len - 1))
            return message.reply(reminders[res]);
        }

        message.mentions.users.forEach(tagged => {
            const len = reminders.length;
            const res = Math.floor(Math.random() * (len - 1))

            message.channel.send(`<@${tagged.id}> ${reminders[res]}`);
        })
    }

    if (command === '!ddr') {
        if (typeof args[0] == 'undefined') return message.reply('Mana parameternyaa');
        else tools.rollMessage(message, args[0])
    }

    if (command === '!latest') {
        let amount = 10
        if (typeof args[0] == 'undefined') amount = 10
        else if (isNaN(parseInt(args[0]))) return message.reply('Parameter harus angka oi.');
        else amount = parseInt(args[0])

        message.reply('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
        eleftheria.fetchLatestTopics(client, message, amount)
    }

    if (command === '!search') {
        if (typeof args[0] == 'undefined') return message.reply('Mau nyari siapa oi oi.');
        else {
            let name = args[0]
            if (args.length > 1) name = args.join(' ')
            if (name.length < 3) message.reply('Minimal 3 karakter lah nyarinya :(')
            else {
                message.reply('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
                eleftheria.searchCampers(client, message, name)
            }
        }
    }

    if (command === '!detail') {
        if (typeof args[0] == 'undefined') return message.reply('Mau nyari siapa oi oi.');
        else if (isNaN(parseInt(args[0]))) return message.reply('Harus angka oi.');
        else {
            message.reply('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
            eleftheria.getUser(client, message, args[0])
        }
    }

    if (command === '!pvp') {
        if (typeof args[0] == 'undefined' || typeof args[1] == 'undefined') return message.reply('Harus ada dua id user oi.');
        else if (isNaN(parseInt(args[0])) || isNaN(parseInt(args[1]))) return message.reply('Harus angka oi ID-nya.');
        else if (message.content.trim() == '!pvp 286 286') return message.reply('Maaf, pvp Nicollo vs Nicollo tanpa limit ronde diban, lelah lihatnya.');
        else if (message.content.trim() == '!pvp 189 189') return message.reply('Maaf, pvp Dorcas vs Dorcas juga  diban kalau tanpa limit ronde, *please have mercy*.');
        else if (message.content.trim() == '!pvp 87 87') return message.reply('Maaf, pvp Aspyn vs Aspyn juga  diban kalau tanpa limit ronde, *please have mercy*.');
        else {
            let ronde = ''
            if (typeof args[2] != 'undefined' && !isNaN(parseInt(args[2]))) ronde = parseInt(args[2])
            message.reply('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
            eleftheria.PvP(client, message, args[0], args[1], ronde)
        }
    }

    if (command === '!brie') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/520167288029315085/583798813655826468/brIE.jpg"] });
    }

    if (command === '!makanya') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/520167288029315085/590601492709376037/unknown.png"] });
    }

    if (command === '!poppy') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/488307706655014967/591938344213151745/poppy.jpg"] });
    }

    if (command === '!hypnos') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/488307706655014967/591938433929183272/unknown.png"] });
    }

    if (command === '!meleduck') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/488307706655014967/591258860506054656/JPEG_20190615_145538.jpg"] });
    }

    if (command === '!saatlihatplot') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/520167288029315085/589829276782690304/unknown.png"] });
    }

    if (command === '!chart') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/488307706655014967/569213024418922498/CANDA_AJA_YA_BUAT_GOSIP_GOSIP_DISCORD.png"] });
    }

    if (command === '!nicollo') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/488307706655014967/583729276055060499/colloo.jpg"] });
    }

    if (command === '!bunga') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/488307706655014967/583722009222184961/eze1.jpg"] });
    }

    if (command === '!halo') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/488307706655014967/583722081682980874/ocanuwu.jpg"] });
    }

    if (command === '!mykola') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/520167288029315085/579647943225769985/89666ef763e4a1afe86c60d195649cee.png"] });
    }

    if (command === '!avenge') {
        message.channel.send("", { files: ["https://i.ibb.co/kDrNWL4/avenge3.jpg"] });
    }

    if (command === '!member') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/520167288029315085/571658842580975627/unknown.png"] });
    }

    if (command === '!mykola2') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/520167288029315085/570510582977921059/Screenshot_20190424-142411_Discord.jpg"] });
    }

    if (command === '!hoax') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/520167288029315085/570272822912352316/Screenshot_20190423-224000_Discord.jpg"] });
    }

    if (command === '!pacar') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/572834275456450561/592225138079039508/Screenshot_20190622-110151_Discord.jpg"] });
    }

    if (command === '!haha') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/572834275456450561/592227544145854464/Screenshot_2019-04-12-10-47-34-1.png"] });
    }

    if (command === '!cokiber') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/572834275456450561/592230946166538271/29bcb01313c5cb701a2531462158ed83.png"] });
    }

    if (command === '!gak') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/572834275456450561/592230946871443477/unknown-18.png"] });
    }

    if (command === '!hihi') {
        message.channel.send("", { files: ["https://cdn.discordapp.com/attachments/572834275456450561/592230947416571914/285e1bccf41a5134c68852e709355707.png"] });
    }

    if (command === '!guide') {
        if (!message.mentions.users.size) {
            return message.reply('Tag orang dulu.');
        }

        let mentioned = ''
        message.mentions.users.forEach(tagged => {
            const len = curses.length;
            const res = Math.floor(Math.random() * (len - 1))

            mentioned += `<@${tagged.id}>`
        })

        message.channel.send(mentioned, { files: ["https://cdn.discordapp.com/attachments/572834275456450561/592226480713367553/IMG_20190422_153330.jpg"] });
    }

    if (command === '!bantu') {
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
                    name: 'Yang lumayan lah bisa dipakai',
                    value: '`!curse <mention orangnya>` untuk merutuki orang, boleh tag lebih dari satu.\n`!praise <mention orangnya>`, boleh tag lebih dari satu.\n`!remind <mention orangnya>` untuk mengingatkan orang, boleh tag lebih dari satu.\n`!guide <mention orangnya>` untuk mengarahkan orang, boleh tag lebih dari satu.\n`!ddr 1d5` untuk dice roll'
                }, {
                    name: 'Yang...umm, cobain aja sendiri',
                    value: '!brie, !makanya, !poppy, !hypnos, !meleduck, !saatlihatplot, !chart, !nicollo, !bunga, !halo, !mykola, !mykola2, !hoax, !member, !pacar, !haha, !hihi, !cokiber, !gak'
                }, {
                    name: 'Berhubungan sama forum, tapi masih percobaan',
                    value: '`!latest <angka>` untuk melihat latest topics di forum\n`!search <nama>` untuk mencari karakter\n`!detail <userid>` untuk melihat data karakter agak lebih lengkap, ID bisa dicari pakai !search\n`!pvp <userid1> <userid2> <ronde>` simulasi PVP, ID bisa dicari pakai !search, kalau mau coba di channel yang sepi deh.'
                }],
                timestamp: new Date()
            }
        });
    }
})

process.on('unhandledRejection', err => {
    throw err;
});

client.login(process.env.BOT_TOKEN)