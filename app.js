require('dotenv').config()
const express = require('express')
const puppeteer = require('puppeteer')
const bodyParser = require('body-parser')
const request = require('request')
const port = process.env.PORT || 8080
const app = express()
const forum = process.env.FORUM
const API = process.env.API
const path = require('path')
const tools = require('./tools.js')

app.use(express.static('public'))
app.use(bodyParser())

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'))
})

app.get('/stats', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/stats.html'))
})

app.get('/pvp', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/pvp.html'))
})

app.get('/get-stats', function (req, res) {
    var options = {
        method: 'GET',
        url: API + 'emembers?_sort=EXP:DESC',
        headers: {
            'cache-control': 'no-cache'
        }
    }

    request(options, function (error, response, body) {
        if (error) throw new Error(error)
        body = JSON.parse(body)
        res.send(body)

    })
})

app.post('/get-pvp', async function (req, res) {

    let id1 = req.body.id1
    let id2 = req.body.id2
    let msg = ''

    const browser = await puppeteer.launch({
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    })
    const page = await browser.newPage()
    await page.setViewport({
        width: 0,
        height: 0
    })
    await page.goto(forum + '/index.php?showuser=' + id1, {
        waitUntil: 'load',
        timeout: 3000000
    })

    let userData1 = await page.evaluate(() => {
        let uData = {}
        if (document.querySelector('#profile-header > h1') != null) {
            uData.name = document.querySelector('#profile-header > h1').innerText
            uData.InitialHP = parseInt(document.querySelector('#battle-points > div:nth-child(6) > span').innerText) * 2
            uData.HP = parseInt(document.querySelector('#battle-points > div:nth-child(6) > span').innerText) * 2
            uData.ATK = document.querySelector('#battle-points > div:nth-child(3) > span').innerText
            uData.DEF = document.querySelector('#battle-points > div:nth-child(4) > span').innerText
            uData.DEFResult = 0
            uData.Heal = 3
        }
        return uData
    })

    if (typeof userData1.name == "undefined") msg = `User ${id1} ghaib, gak ketemu!`
    else if (userData1.HP == null) msg = `User ${userData1.name} belum punya battle points, jadi belum bisa berantem, uwu`
    else {
        await page.goto(forum + '/index.php?showuser=' + id2, {
            waitUntil: 'load',
            timeout: 3000000
        })

        let userData2 = await page.evaluate(() => {
            let uData = {}
            if (document.querySelector('#profile-header > h1') != null) {
                uData.name = document.querySelector('#profile-header > h1').innerText
                uData.InitialHP = parseInt(document.querySelector('#battle-points > div:nth-child(6) > span').innerText) * 2
                uData.HP = parseInt(document.querySelector('#battle-points > div:nth-child(6) > span').innerText) * 2
                uData.ATK = document.querySelector('#battle-points > div:nth-child(3) > span').innerText
                uData.DEF = document.querySelector('#battle-points > div:nth-child(4) > span').innerText
                uData.DEFResult = 0
                uData.Heal = 3

            }
            return uData
        })

        if (typeof userData2.name == "undefined") msg = `User ${id2} ghaib, gak ketemu!`
        else if (userData2.HP == null) msg = `User ${userData2.name} belum punya battle points, jadi belum bisa berantem, uwu`
        else {

            if (id1 == id2) userData2.name = "KLON " + userData1.name

            browser.close()

            let id = 1
            while ((userData1.HP > 0 && userData1.Heal >= 0) && (userData2.HP > 0 && userData2.Heal >= 0)) {

                msg += `<br><b>ROUND ${id} - ${userData1.name} vs ${userData2.name}</b><br>`
                let user1ATK = tools.roll(userData1.ATK)
                let oldHP = userData2.HP
                if (id != 1) userData2.DEFResult = tools.roll(userData2.DEF)
                if (userData2.DEFResult <= user1ATK) userData2.HP = userData2.HP - user1ATK + userData2.DEFResult

                msg += `⚔️ ${userData1.name} (HP: ${userData1.HP}) menyerang ${userData2.name}, dengan <b>ATK Point: ${user1ATK}</b><br>`
                if (id != 1) msg += `🛡 ${userData2.name} (HP: ${oldHP}) melakukan defense dengan hasil <b>DEF point: ${userData2.DEFResult}</b>, sehingga sisa HP: ${userData2.HP}<br>`

                if (userData2.HP <= 0 && userData2.Heal != 0) {
                    while (userData2.HP <= 0 && userData2.Heal != 0) {
                        let heal = tools.roll(`1d${userData2.InitialHP}`)
                        if (userData2.HP < 0) userData2.HP = 0
                        let newHP = userData2.HP + heal
                        if (newHP > userData2.InitialHP) newHP = userData2.InitialHP
                        userData2.HP = newHP

                        userData2.Heal = userData2.Heal - 1
                        msg += `🔁 ${userData2.name} melakukan heal, sisa heal: ${userData2.Heal} | HP: ${userData2.HP}<br>`

                        user1ATK = tools.roll(userData1.ATK)
                        oldHP = userData2.HP
                        userData2.DEFResult = tools.roll(userData2.DEF)
                        if (userData2.DEFResult <= user1ATK) userData2.HP = userData2.HP - user1ATK + userData2.DEFResult

                        msg += `⚔️ ${userData1.name} (HP: ${userData1.HP}) menyerang ${userData2.name}, dengan <b>ATK Point: ${user1ATK}</b><br>`
                        msg += `🛡 ${userData2.name} (HP: ${oldHP}) melakukan defense dengan hasil <b>DEF point: ${userData2.DEFResult}</b>, sehingga sisa HP: ${userData2.HP}<br>`
                    }
                }

                if (userData2.HP <= 0 && userData2.Heal == 0) {
                    msg += `<br><b>${userData2.name} (HP: ${userData2.HP}) kalah, selamat ${userData1.name}!</b><br>`
                }

                if (userData2.HP > 0 && userData2.Heal >= 0) {
                    let user2ATK = tools.roll(userData2.ATK)
                    oldHP = userData1.HP
                    userData1.DEFResult = tools.roll(userData1.DEF)
                    if (userData1.DEFResult <= user2ATK) userData1.HP = userData1.HP - user2ATK + userData1.DEFResult

                    msg += `⚔️ ${userData2.name} (HP: ${userData2.HP}) menyerang ${userData1.name}, dengan <b>ATK Point: ${user2ATK}</b><br>`
                    msg += `🛡 ${userData1.name} (HP: ${oldHP}) melakukan defense dengan hasil <b>DEF point: ${userData1.DEFResult}</b>, sehingga sisa HP: ${userData1.HP}<br>`


                    if (userData1.HP <= 0 && userData1.Heal != 0) {
                        while (userData1.HP <= 0 && userData1.Heal != 0) {
                            let heal = tools.roll(`1d${userData1.InitialHP}`)
                            if (userData1.HP < 0) userData1.HP = 0
                            let newHP = userData1.HP + heal
                            if (newHP > userData1.InitialHP) newHP = userData1.InitialHP
                            userData1.HP = newHP

                            userData1.Heal = userData1.Heal - 1
                            msg += `🔁 ${userData1.name} melakukan heal, sisa heal: ${userData1.Heal} | HP: ${userData1.HP}<br>`

                            user2ATK = tools.roll(userData2.ATK)
                            oldHP = userData1.HP
                            userData1.DEFResult = tools.roll(userData1.DEF)
                            if (userData1.DEFResult <= user2ATK) userData1.HP = userData1.HP - user2ATK + userData1.DEFResult

                            msg += `⚔️ ${userData2.name} (HP: ${userData2.HP}) menyerang ${userData1.name}, dengan <b>ATK Point: ${user2ATK}</b><br>`
                            msg += `🛡 ${userData1.name} (HP: ${oldHP}) melakukan defense dengan hasil <b>DEF point: ${userData1.DEFResult}</b>, sehingga sisa HP: ${userData1.HP}<br>`
                        }
                    }

                    if (userData1.HP <= 0 && userData1.Heal == 0) {
                        msg += `<br><b>${userData1.name} (HP: ${userData1.HP}) kalah, selamat ${userData2.name}!</b>`
                    }
                }
                id++


            }
        }
    }

    res.send(msg)
})

app.get('/fetch', async function (req, res) {
    const browser = await puppeteer.launch({
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    })
    const page = await browser.newPage()

    let url = forum + '/index.php?&act=Members&photoonly=&name=&name_box=all&max_results=50&filter=ALL&sort_order=desc&sort_key=posts&st='
    let start = 0
    await page.setViewport({
        width: 0,
        height: 0
    })

    let links = []
    let founds = ['aaa']
    while (founds.length > 0) {

        await page.goto(url + start, {
            waitUntil: 'load',
            timeout: 3000000
        })

        founds = await page.evaluate(() => {
            let foundCampers = []
            let elements = document.querySelectorAll('.camper')
            if (elements.length > 0) {
                elements.forEach((element) => {
                    try {
                        foundCampers.push(element.getAttribute('href').trim())
                    } catch (exception) {
                        console.log(exception)
                    }
                })
            }

            return foundCampers
        })

        links.push(...founds)

        start += 50

    }

    let f = 0

    while (f < links.length) {

        await page.goto(forum + links[f], {
            waitUntil: 'load',
            timeout: 3000000
        })

        let d = await page.evaluate(() => {
            let uData = {}
            uData.HP = parseInt(document.querySelector('#battle-points > div:nth-child(6) > span').innerText)
            uData.ATK = document.querySelector('#battle-points > div:nth-child(3) > span').innerText
            uData.DEF = document.querySelector('#battle-points > div:nth-child(4) > span').innerText
            let Group = document.querySelector('#profile1 > div:nth-child(1) > span').innerText
            if (uData.HP != "No Information" && uData.ATK != "No Information" && uData.DEF != "No Information" && Group != "God" && Group != "Goddess") {
                let ATK = uData.ATK.split('d')
                let EXP = 0
                if (ATK.length > 1) ATK = ATK[1].split('+')
                let DEF = uData.DEF.split('d')
                if (DEF.length > 1) DEF = DEF[1].split('+')
                if (ATK.length > 1 && DEF.length > 1) EXP = parseInt(ATK) + parseInt(DEF)
                else EXP = document.querySelector('#battle-points > div:nth-child(5) > span').innerText

                uData.name = document.querySelector('#profile-header > h1').innerText
                uData.title = document.querySelector('#profile-header > span').innerText
                uData.postcount = parseInt(document.querySelector('#profile1 > div:nth-child(4) > span').innerText)
                uData.EXP = EXP
                uData.Ability = document.querySelector('#battle-points > div:nth-child(1) > span').innerText
                uData.Weapon = document.querySelector('#battle-points > div:nth-child(2) > span').innerText
            }
            return uData
        })

        d.link = links[f].trim()
        d.id = parseInt(links[f].replace('/index.php?showuser=', ''))

        if (typeof d.name != 'undefined') {

            var options = {
                method: 'GET',
                url: API + 'emembers',
                qs: {
                    UserID: d.id
                },
                headers: {
                    'cache-control': 'no-cache'
                }
            }

            request(options, function (error, response, body) {
                if (error) throw new Error(error)

                body = JSON.parse(body)

                let ATK = d.ATK.split('d')
                if (ATK.length > 1) ATK = ATK[1].split('+')
                let DEF = d.DEF.split('d')
                if (DEF.length > 1) DEF = DEF[1].split('+')

                if (body.length > 0) {

                    options = {
                        method: 'PUT',
                        url: API + 'emembers/' + body[0].id,
                        headers: {
                            'cache-control': 'no-cache',
                            'content-type': 'application/json'
                        },
                        body: {
                            UserID: d.id,
                            Name: d.name,
                            Title: d.title,
                            Ability: d.Ability,
                            Weapon: d.Weapon,
                            Post: d.postcount,
                            HP: d.HP,
                            EXP: d.EXP,
                            ATK: ATK[0],
                            DEF: DEF[0],
                            ATKP: ATK[1],
                            DEFP: DEF[1],
                            Link: forum + d.link
                        },
                        json: true
                    }

                    request(options, function (error, response, body) {
                        if (error) throw new Error(error)

                        console.log(body)
                    })
                } else {
                    options = {
                        method: 'POST',
                        url: API + 'emembers',
                        headers: {
                            'cache-control': 'no-cache',
                            'content-type': 'application/json'
                        },
                        body: {
                            UserID: d.id,
                            Name: d.name,
                            Title: d.title,
                            Ability: d.Ability,
                            Weapon: d.Weapon,
                            Post: d.postcount,
                            HP: d.HP,
                            EXP: d.EXP,
                            ATK: ATK[0],
                            DEF: DEF[0],
                            ATKP: ATK[1],
                            DEFP: DEF[1],
                            Link: forum + d.link
                        },
                        json: true
                    }

                    request(options, function (error, response, body) {
                        if (error) throw new Error(error)

                        console.log(body)
                    })
                }
            })
        }

        f++
    }

    browser.close()

    res.send('done')
})

process.on('unhandledRejection', err => {
    throw err
})

app.listen(port, async function () {
    console.log(`Example app listening on port ${port}!`)
})