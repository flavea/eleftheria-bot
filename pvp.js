require('dotenv').config()
const puppeteer = require('puppeteer');
const tools = require('./tools.js')
const forum = process.env.FORUM

async function pvp(id1, id2, ronde) {
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
            uData.Heal = 1
        }
        return uData
    });

    if (typeof userData1.name == "undefined") console.log(`User ${id1} ghaib, gak ketemu!`);
    else if (userData1.HP == null) console.log(`User ${userData1.name} belum punya battle points, jadi belum bisa berantem, uwu`);

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
            uData.Heal = 1

        }
        return uData
    });

    if (typeof userData2.name == "undefined") console.log(`User ${id2} ghaib, gak ketemu!`);
    else if (userData2.HP == null) console.log(`User ${userData2.name} belum punya battle points, jadi belum bisa berantem, uwu`);

    if (id1 == id2) userData2.name = "KLON " + userData1.name

    browser.close()

    console.log(`${userData1.name} vs ${userData2.name}\nBattle dimulai!`);

    let id = 1
    let param = true
    while (param) {

        let msg = `\n\nROUND ${id} - ${userData1.name} vs ${userData2.name}\n`
        let user1ATK = tools.roll(userData1.ATK)
        let oldHP = userData2.HP
        if (id != 1) userData2.DEFResult = tools.roll(userData2.DEF)
        if (userData2.DEFResult <= user1ATK) userData2.HP = userData2.HP - user1ATK + userData2.DEFResult

        msg += `⚔️ ${userData1.name} (HP: ${userData1.HP}) menyerang ${userData2.name}, dengan ATK Point: ${user1ATK}\n`
        if (id != 1) msg += `🛡 ${userData2.name} (HP: ${oldHP}) melakukan defense dengan hasil DEF point: ${userData2.DEFResult}, sehingga sisa HP: ${userData2.HP}\n`

        if (userData2.HP <= 0 && userData2.Heal != 0) {
            while (userData2.HP <= 0 && userData2.Heal != 0) {
                let heal = tools.roll(`1d${userData2.InitialHP}`)
                if (userData2.HP < 0) userData2.HP = 0
                let newHP = userData2.HP + heal
                if (newHP > userData2.InitialHP) newHP = userData2.InitialHP
                userData2.HP = newHP

                userData2.Heal = userData2.Heal - 1
                msg += `🔁 ${userData2.name} melakukan heal, sisa heal: ${userData2.Heal} | HP: ${userData2.HP}\n`

                user1ATK = tools.roll(userData1.ATK)
                oldHP = userData2.HP
                userData2.DEFResult = tools.roll(userData2.DEF)
                if (userData2.DEFResult <= user1ATK) userData2.HP = userData2.HP - user1ATK + userData2.DEFResult

                msg += `⚔️ ${userData1.name} (HP: ${userData1.HP}) menyerang ${userData2.name}, dengan ATK Point: ${user1ATK}\n`
                msg += `🛡 ${userData2.name} (HP: ${oldHP}) melakukan defense dengan hasil DEF point: ${userData2.DEFResult}, sehingga sisa HP: ${userData2.HP}\n`
            }
        }

        if (userData2.HP <= 0 && userData2.Heal == 0) {
            msg += `\n\n${userData2.name} (HP: ${userData2.HP}) kalah, selamat ${userData1.name}!\n`
        }

        if (userData2.HP > 0 && userData2.Heal >= 0) {
            let user2ATK = tools.roll(userData2.ATK)
            oldHP = userData1.HP
            userData1.DEFResult = tools.roll(userData1.DEF)
            if (userData1.DEFResult <= user2ATK) userData1.HP = userData1.HP - user2ATK + userData1.DEFResult

            msg += `⚔️ ${userData2.name} (HP: ${userData2.HP}) menyerang ${userData1.name}, dengan ATK Point: ${user2ATK}\n`
            msg += `🛡 ${userData1.name} (HP: ${oldHP}) melakukan defense dengan hasil DEF point: ${userData1.DEFResult}, sehingga sisa HP: ${userData1.HP}\n`


            if (userData1.HP <= 0 && userData1.Heal != 0) {
                while (userData1.HP <= 0 && userData1.Heal != 0) {
                    let heal = tools.roll(`1d${userData1.InitialHP}`)
                    if (userData1.HP < 0) userData1.HP = 0
                    let newHP = userData1.HP + heal
                    if (newHP > userData1.InitialHP) newHP = userData1.InitialHP
                    userData1.HP = newHP

                    userData1.Heal = userData1.Heal - 1
                    msg += `🔁 ${userData1.name} melakukan heal, sisa heal: ${userData1.Heal} | HP: ${userData1.HP}\n`

                    user2ATK = tools.roll(userData2.ATK)
                    oldHP = userData1.HP
                    userData1.DEFResult = tools.roll(userData1.DEF)
                    if (userData1.DEFResult <= user2ATK) userData1.HP = userData1.HP - user2ATK + userData1.DEFResult

                    msg += `⚔️ ${userData2.name} (HP: ${userData2.HP}) menyerang ${userData1.name}, dengan ATK Point: ${user2ATK}\n`
                    msg += `🛡 ${userData1.name} (HP: ${oldHP}) melakukan defense dengan hasil DEF point: ${userData1.DEFResult}, sehingga sisa HP: ${userData1.HP}\n`
                }
            }

            if (userData1.HP <= 0 && userData1.Heal == 0) {
                msg += `\n\n${userData1.name} (HP: ${userData1.HP}) kalah, selamat ${userData2.name}!\n`
            }
        }

        /* 
                    if (!isNaN(parseInt(ronde)) && id >= parseInt(ronde)) {
                        if (userData1.HP > userData2.HP) string += `Pertarungan sudah berlangsung terlalu lama, maka dari itu ${userData1.name}(HP: ${userData1.HP}) menang atas ${userData2.name} (HP: ${userData2.HP})!\n`
                        else string += `Pertarungan sudah berlangsung terlalu lama, maka dari itu ${userData2.name} (HP: ${userData2.HP}) menang atas ${userData1.name}(HP: ${userData1.HP})!\n`
                    }
         */
        console.log(msg);
        /* console.log(message) */

        if (ronde != '') param = (userData1.HP > 0 && userData1.Heal >= 0) && (userData2.HP > 0 && userData2.Heal >= 0) && id < parseInt(ronde)
        else param = (userData1.HP > 0 && userData1.Heal >= 0) && (userData2.HP > 0 && userData2.Heal >= 0)

        id++

    }

}

pvp(189, 286, '')