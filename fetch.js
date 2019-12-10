require('dotenv').config()
const puppeteer = require('puppeteer')
const request = require('request')
const forum = process.env.FORUM
const API = process.env.API

async function fetch() {
    const browser = await puppeteer.launch({
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    })
    const page = await browser.newPage()

    let url = forum + 'index.php?&act=Members&photoonly=&name=&name_box=all&max_results=50&filter=ALL&sort_order=desc&sort_key=posts&st='
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

            if (uData.HP == "No Information") uData.HP = 840
            if (uData.ATK == "No Information") uData.ATK = 0
            if (uData.DEF == "No Information") uData.DEF = 0
            if (Group != "God" && Group != "Goddess" && Group != "Admin" && Group != "Others" && Group != "Titan" && Group != "Registering" && !Group.includes('Validating')) {
                let ATK = [0, 0]
                let DEF = [0, 0]
                let EXP = 0;
                if (uData.ATK) {
                    ATK = uData.ATK ? uData.ATK.split('d') : [0, '0+0']
                    if (ATK.length > 1) ATK = ATK[1].split('+')
                    DEF = uData.DEF ? uData.DEF.split('d') : [0, '0+0']
                    if (DEF.length > 1) DEF = DEF[1].split('+')
                    if (ATK.length > 1 && DEF.length > 1) EXP = parseInt(ATK) + parseInt(DEF)
                    else EXP = document.querySelector('#battle-points > div:nth-child(5) > span').innerText
                }

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

                let ATK = [0, 0]
                let DEF = [0, 0]
                if (d.ATK) {
                    ATK = d.ATK.split('d')
                    if (ATK.length > 1) ATK = ATK[1].split('+')
                    DEF = d.DEF.split('d')
                    if (DEF.length > 1) DEF = DEF[1].split('+')
                }

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
                            HP: parseInt(d.HP),
                            EXP: parseInt(d.EXP),
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
                            HP: parseInt(d.HP),
                            EXP: parseInt(d.EXP),
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
}

fetch()