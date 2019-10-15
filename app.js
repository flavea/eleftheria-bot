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

app.get('/submit', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/submit.html'))
})

app.get('/get-stats', function (req, res) {
    var options = {
        method: 'GET',
        url: API + 'emembers?_sort=EXP:DESC&_limit=1000',
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

app.post('/submit-gossip', function (req, res) {
    var options = {
        method: 'POST',
        url: API + '/egossips',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            gossip_id: req.body.gossip_id,
            gossip: req.body.gossip
        },
        json: true
    }

    request(options, function (error, response, body) {
        if (error) throw new Error(error)

        res.send(response)
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
    await page.goto(forum + 'index.php?showuser=' + id1, {
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
            uData.Heal = 1
        }
        return uData
    })

    if (typeof userData1.name == "undefined") msg = `User ${id1} ghaib, gak ketemu!`
    else if (userData1.HP == null) msg = `User ${userData1.name} belum punya battle points, jadi belum bisa berantem, uwu`
    else {
        await page.goto(forum + 'index.php?showuser=' + id2, {
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
                uData.Heal = 1

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

process.on('unhandledRejection', err => {
    throw err
})

app.listen(port, async function () {
    console.log(`Example app listening on port ${port}!`)
})