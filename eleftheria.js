require('dotenv').config()
const puppeteer = require('puppeteer');
const tools = require('./tools.js')
const forum = process.env.FORUM

module.exports = {
    fetchLatestTopics: async function(client, message, amount) {
        const browser = await puppeteer.launch({
            'args': [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 0, height: 0 })
        await page.goto(forum + 'index.php?act=Login&CODE=00', { waitUntil: 'load', timeout: 3000000 });
        await page.type('#ipbwrapper > form > div > table:nth-child(3) > tbody > tr:nth-child(1) > td.pformright > input', 'Elektra Murdock');
        await page.type('#ipbwrapper > form > div > table:nth-child(3) > tbody > tr:nth-child(2) > td.pformright > input', '1j9u1l1i9a5n');
        await page.click('#ipbwrapper > form > div > table:nth-child(5) > tbody > tr:nth-child(2) > td.pformright > input[type=checkbox]');
        await page.click('#ipbwrapper > form > div > div:nth-child(6) > input');
        await page.waitForNavigation({ waitUntil: 'load' });
        await page.goto(forum + 'index.php?act=Search&CODE=getactive', { waitUntil: 'load', timeout: 3000000 });

        let data = await page.evaluate(() => {
            let topics = [];
            let elements = document.querySelectorAll('#active-topics > div > table > tbody > tr:not(:first-child)');
            if (elements.length > 0) {
                elements.forEach((element) => {
                    let latest = {};
                    try {
                        latest.name = element.querySelector('td:nth-child(3) > table > tbody > tr > td:nth-child(2) > a').innerText;
                        latest.link = element.querySelector('td:nth-child(3) > table > tbody > tr > td:nth-child(2) > a').getAttribute('href');
                        latest.started_by = element.querySelector('td:nth-child(5) > a').innerText;
                        latest.replied = element.querySelector('td:nth-child(8)').innerText;
                    } catch (exception) {
                        console.log(exception)
                    }
                    topics.push(latest);
                });
            }
            return topics
        });

        if (data.length == 0) return message.channel.send(`Wah, lagi sepi nih, gak ada yang repp.`);
        else {

            let list = []
            let flag = 1
            data.forEach(d => {
                if (flag <= amount) {
                    list.push({
                        name: d.name,
                        value: `Started by ${d.started_by} last replied on ${d.replied.replace("\nLast Post by:", " by")} [[Go to Topic](${d.link})]`,
                        inline: true
                    })
                }
                flag++
            })

            message.channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: "Latest Topics",
                    url: forum + 'index.php?act=Search&CODE=getactive',
                    description: "Topik-topik yang baru dibalas di Eleftheria.",
                    fields: list,
                    timestamp: new Date()
                }
            });
        }

        browser.close()
    },
    searchCampers: async function(client, message, camper) {

        const browser = await puppeteer.launch({
            'args': [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 0, height: 0 })

        await page.goto(forum + 'index.php?act=Members', { waitUntil: 'load', timeout: 3000000 });
        await page.type('.memberlist-namesearch', camper);

        await Promise.all([
            page.click('#ipbwrapper > form > div.darkrow1 > center > input'),
            page.waitForNavigation({ waitUntil: 'load' }),
        ]);

        let founds = await page.evaluate(() => {
            let foundCampers = []
            let elements = document.querySelectorAll('.camper');
            if (elements.length > 0) {
                elements.forEach((element) => {
                    try {
                        foundCampers.push(element.getAttribute('href').trim());
                    } catch (exception) {
                        console.log(exception)
                    }
                });
            }

            return foundCampers
        });

        let data = [];
        let pages = [];
        await Promise.all(founds.map(async function(d, i) {
            pages[i] = await browser.newPage();
            await pages[i].setViewport({ width: 0, height: 0 })
            await pages[i].goto(forum + d, { waitUntil: 'load', timeout: 3000000 });

            let userData = await pages[i].evaluate(() => {
                let uData = {}
                uData.name = document.querySelector('#profile-header > h1').innerText;
                uData.title = document.querySelector('#profile-header > span').innerText;
                uData.postcount = document.querySelector('#profile1 > div:nth-child(4) > span').innerText;
                uData.HP = document.querySelector('#battle-points > div:nth-child(6) > span').innerText;
                uData.ATK = document.querySelector('#battle-points > div:nth-child(3) > span').innerText;
                uData.DEF = document.querySelector('#battle-points > div:nth-child(4) > span').innerText;
                return uData
            });

            userData.link = d.trim()
            userData.id = d.replace('/index.php?showuser=', '')
            data.push(userData)
        }))

        if (data.length == 0) return message.channel.send(`Wah, ${camper} gak ketemu. Kayaknya NPC.`);
        else {
            let list = []
            data.forEach(d => {
                list.push({
                    name: `${d.name} - ${d.title}`,
                    value: `**ID:** ${d.id} | **Post Count:** ${d.postcount} | **HP:** ${d.HP} | **ATK:** ${d.ATK} | **DEF**: ${d.DEF} [[Go to Profile](${forum}${d.link})]`,
                    inline: true
                })
            })

            message.channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: "Search Result",
                    url: forum + 'index.php?act=Members',
                    description: "Hasil pencarian untuk: " + camper,
                    fields: list,
                    timestamp: new Date()
                }
            });

            browser.close()
        }
    },
    getUser: async function(client, message, id) {
        const browser = await puppeteer.launch({
            'args': [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 0, height: 0 })
        await page.goto(forum + '/index.php?showuser=' + id, { waitUntil: 'load', timeout: 3000000 });

        let userData = await page.evaluate(() => {
            let uData = {}
            if (document.querySelector('#profile-header > h1') != null) {
                uData.name = document.querySelector('#profile-header > h1').innerText;
                uData.title = document.querySelector('#profile-header > span').innerText;
                uData.postcount = document.querySelector('#profile1 > div:nth-child(4) > span').innerText;
                uData.weapon = document.querySelector('#battle-points > div:nth-child(1) > span').innerText;
                uData.ability = document.querySelector('#battle-points > div:nth-child(2) > span').innerText;
                uData.HP = document.querySelector('#battle-points > div:nth-child(6) > span').innerText;
                uData.ATK = document.querySelector('#battle-points > div:nth-child(3) > span').innerText;
                uData.DEF = document.querySelector('#battle-points > div:nth-child(4) > span').innerText;
                uData.Group = document.querySelector('#profile1 > div:nth-child(1) > span').innerText;
                uData.Image = document.querySelector('#profile-detail > img').getAttribute("src");
                uData.TTL = document.querySelector('#info > div:nth-child(2) > span').innerText;
                uData.TahunMasuk = document.querySelector('#info > div:nth-child(3) > span').innerText;
                uData.RS = document.querySelector('#info > div:nth-child(4) > span').innerText;
                uData.CiriFisik = document.querySelector('#info > div:nth-child(5) > span').innerText;
                uData.Trivia = document.querySelector('#info > div:nth-child(6) > span').innerText;
            }
            return uData
        });

        if (typeof userData.name == "undefined") return message.channel.send(`User ${id} ghaib, gak ketemu!`);
        else {
            message.channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: userData.name,
                    url: forum + '/index.php?showuser=' + id,
                    description: userData.title,
                    thumbnail: {
                        url: userData.Image,
                    },
                    fields: [{
                        name: 'Group',
                        value: userData.Group,
                        inline: true
                    }, {
                        name: 'Post Count',
                        value: userData.postcount,
                        inline: true
                    }, {
                        name: 'Senjata',
                        value: userData.weapon,
                        inline: true
                    }, {
                        name: 'Kemampuan',
                        value: userData.ability,
                        inline: true
                    }, {
                        name: 'HP',
                        value: userData.HP,
                        inline: true
                    }, {
                        name: 'ATK',
                        value: userData.ATK,
                        inline: true
                    }, {
                        name: 'DEF',
                        value: userData.DEF,
                        inline: true
                    }, {
                        name: 'Tempat/Tanggal Lahir',
                        value: userData.TTL,
                        inline: true
                    }, {
                        name: 'Tahun Masuk Perkemahan',
                        value: userData.TahunMasuk,
                        inline: true
                    }, {
                        name: 'Status Hubungan',
                        value: userData.RS,
                        inline: true
                    }, {
                        name: 'Ciri Fisik',
                        value: userData.CiriFisik
                    }, {
                        name: 'Trivia',
                        value: userData.Trivia
                    }],
                    timestamp: new Date()
                }
            });
        }

        browser.close()

    },
    PvP: async function(client, message, id1, id2) {
        const browser = await puppeteer.launch({
            'args': [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 0, height: 0 })
        await page.goto(forum + '/index.php?showuser=' + id1, { waitUntil: 'load', timeout: 3000000 });

        let userData1 = await page.evaluate(() => {
            let uData = {}
            if (document.querySelector('#profile-header > h1') != null) {
                uData.name = document.querySelector('#profile-header > h1').innerText;
                uData.InitialHP = parseInt(document.querySelector('#battle-points > div:nth-child(6) > span').innerText) * 2;
                uData.HP = parseInt(document.querySelector('#battle-points > div:nth-child(6) > span').innerText) * 2;
                uData.ATK = document.querySelector('#battle-points > div:nth-child(3) > span').innerText;
                uData.DEF = document.querySelector('#battle-points > div:nth-child(4) > span').innerText;
                uData.DEFResult = 0
                uData.Heal = 3
            }
            return uData
        });

        if (typeof userData1.name == "undefined") return message.channel.send(`User ${id} ghaib, gak ketemu!`);
        else if (userData1.HP == "No Information") return message.channel.send(`User ${userData1.name} belum punya battle points, jadi belum bisa berantem, uwu`);

        await page.goto(forum + '/index.php?showuser=' + id2, { waitUntil: 'load', timeout: 3000000 });

        let userData2 = await page.evaluate(() => {
            let uData = {}
            if (document.querySelector('#profile-header > h1') != null) {
                uData.name = document.querySelector('#profile-header > h1').innerText;
                uData.InitialHP = parseInt(document.querySelector('#battle-points > div:nth-child(6) > span').innerText) * 2;
                uData.HP = parseInt(document.querySelector('#battle-points > div:nth-child(6) > span').innerText) * 2;
                uData.ATK = document.querySelector('#battle-points > div:nth-child(3) > span').innerText;
                uData.DEF = document.querySelector('#battle-points > div:nth-child(4) > span').innerText;
                uData.DEFResult = 0
                uData.Heal = 3

            }
            return uData
        });

        if (typeof userData2.name == "undefined") return message.channel.send(`User ${id} ghaib, gak ketemu!`);
        else if (userData2.HP == "No Information") return message.channel.send(`User ${userData2.name} belum punya battle points, jadi belum bisa berantem, uwu`);

        browser.close()

        message.channel.send(`**${userData1.name} vs ${userData2.name}** \n Battle dimulai!`);

        let id = 1
        while ((userData1.HP > 0 && userData1.Heal < 0) && (userData2.HP > 0 && userData2.Heal < 0) && id <= 10) {

            message.channel.send(`\n\n**ROUND ${id}**`);
            let user1ATK = tools.roll(userData1.ATK)
            userData2.DEFResult = tools.roll(userData2.DEF)
            if (userData2.DEFResult <= user1ATK) userData2.HP = userData2.HP - user1ATK + userData2.DEFResult

            message.channel.send(`★ ${userData1.name} (HP: ${userData1.HP}) menyerang ${userData2.name}, dengan **ATK Point: ${user1ATK}**`)
            message.channel.send(`✿ ${userData2.name} melakukan defense dengan hasil **DEF point: ${userData2.DEFResult}**, sehingga sisa HP: ${userData2.HP}`)

            if (userData2.HP <= 0 && userData2.Heal != 0) {
                let heal = tools.roll(`1d${userData2.InitialHP}`)
                if (userData2.HP < 0) userData2.HP = 0
                let newHP = userData2.HP + heal
                if (newHP > userData2.InitialHP) newHP = userData2.InitialHP
                userData2.HP = newHP

                userData2.Heal = userData2.Heal - 1
                message.channel.send(`✿ ${userData2.name} melakukan heal, sisa heal: ${userData2.Heal} | HP: ${userData2.HP}`)
            } else if (userData2.HP <= 0 && userData2.Heal == 0) {
                message.channel.send(`**${userData2.name}(HP: ${userData2.HP}) kalah, selamat ${userData1.name}!**`)
            }

            let user2ATK = tools.roll(userData2.ATK)
            userData1.DEFResult = tools.roll(userData1.DEF)
            if (userData1.DEFResult <= user2ATK) userData1.HP = userData1.HP - user2ATK + userData1.DEFResult

            message.channel.send(`✿ ${userData2.name} (HP: ${userData2.HP}) menyerang ${userData1.name}, dengan **ATK Point: ${user2ATK}**`)
            message.channel.send(`★ ${userData1.name} melakukan defense dengan hasil **DEF point: ${userData1.DEFResult}**, sehingga sisa HP: ${userData1.HP}`)

            if (userData1.HP <= 0 && userData1.Heal != 0) {
                let heal = tools.roll(`1d${userData1.InitialHP}`)
                if (userData1.HP < 0) userData1.HP = 0
                let newHP = userData1.HP + heal
                if (newHP > userData1.InitialHP) newHP = userData1.InitialHP
                userData1.HP = newHP

                userData1.Heal = userData1.Heal - 1
                message.channel.send(`★ ${userData1.name} melakukan heal, sisa heal: ${userData1.Heal} | HP: ${userData1.HP}`)
            } else if (userData1.HP <= 0 && userData1.Heal == 0) {
                message.channel.send(`**${userData1.name}(HP: ${userData1.HP}) kalah, selamat ${userData2.name}!**`)
            }

            id++

            if (id >= 10) {
                if (userData1.HP > userData2.HP) message.channel.send(`Pertarungan sudah berlangsung terlalu lama, maka dari itu ${userData1.name}(HP: ${userData1.HP}) menang atas ${userData2.name}(HP: ${userData2.HP})!`)
                else message.channel.send(`Pertarungan sudah berlangsung terlalu lama, maka dari itu ${userData2.name}(HP: ${userData2.HP}) menang atas ${userData1.name}(HP: ${userData1.HP})!`)
            }
        }

    }
}