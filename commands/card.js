const nodeHtmlToImage = require('node-html-to-image')
const puppeteer = require('puppeteer')
require('dotenv').config()

module.exports = {
    name: 'card',
    type: 'interaction',
    parameter: 'id member di forum',
    description: 'Iseng bikin kartu member',
    async execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
        if (args.length == 0 && !message.mentions.users.size) return message.reply('ID-nya mana.')
        else if (args.length > 0) {

            const forum = process.env.FORUM

            const id = args[0]

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
            await page.goto(forum + 'index.php?showuser=' + id, {
                waitUntil: 'load',
                timeout: 3000000
            })

            let userData = await page.evaluate(() => {
                let uData = {}
                if (document.querySelector('#profile-header > h1') != null) {
                    uData.name = document.querySelector('#profile-header > h1').innerText
                    uData.title = document.querySelector('#profile-header > span').innerText
                    uData.postcount = document.querySelector('#profile1 > div:nth-child(4) > span').innerText
                    uData.weapon = document.querySelector('#battle-points > div:nth-child(2) > span').innerText
                    uData.ability = document.querySelector('#battle-points > div:nth-child(1) > span').innerText
                    uData.HP = document.querySelector('#battle-points > div:nth-child(6) > span').innerText
                    uData.ATK = document.querySelector('#battle-points > div:nth-child(3) > span').innerText
                    uData.DEF = document.querySelector('#battle-points > div:nth-child(4) > span').innerText
                    uData.EXP = document.querySelector('#battle-points > div:nth-child(5) > span').innerText
                    uData.Image = document.querySelector('#profile-detail > img').getAttribute("src")
                    uData.Quote = document.querySelector('#profile-quote').innerText
                }
                return uData
            })

            if (typeof userData.name == "undefined") return message.channel.send(`User ${id} ghaib, gak ketemu!`)
            else {
                nodeHtmlToImage({
                    output: './image.png',
                    content: {
                        name: userData.name,
                        title: userData.title,
                        weapon: userData.weapon,
                        ability: userData.ability,
                        hp: userData.HP,
                        exp: userData.EXP,
                        atk: userData.ATK,
                        def: userData.DEF,
                        image: userData.Image,
                        quote: userData.Quote,
                        pc: userData.postcount
                    },
                    html: `<html> <head> <link href="https://fonts.googleapis.com/css?family=Abril+Fatface|Noto+Sans" rel="stylesheet"> <style type='text/css'> html, body{width: 740px; height: 280px; padding: 0; margin: 0;}#profile{padding: 20px; background-color: #333; background-position: center; background-size: auto 100%; color: #fff; font-family: 'Noto Sans', sans-serif; font-size: 13px; width: 700px; height: 240px}body:after{display: table; clear: both; content: ""}#profile h1{font-weight: lighter; font-family: 'Abril Fatface', sans-serif; margin-top: 0}#profile .title{text-transform: uppercase; font-size: 10px; position: inline-block; padding-top: 10px; border-top: 1px solid #ee5552; letter-spacing: 1px; color: #ee5552}#profile img{display: inline-block; margin-right: 20px; border: 20px solid #fff}#profile .pill{display: inline-block; padding: 5px 10px; border-radius: 10px; margin: 0 5px 5px 0; font-size: 11px}#profile #quote{font-family: 'Abril Fatface', sans-serif; font-size: 16px; text-align: center; margin: 30px 0}.aphrodite{background-image: url(https://i.ibb.co/JqFS6fP/aphrodite-big.jpg)}.apollo{background-image: url(https://i.ibb.co/pPh6cwd/apollo-big.jpg)}.ares{background-image: url(https://i.ibb.co/5L2wmkB/ares-big.jpg)}.artemis{background-image: url(https://i.ibb.co/W51SyZh/artemis-big.jpg)}.athena{background-image: url(https://i.ibb.co/b6nzfHC/athena-big.jpg)}.demeter{background-image: url(https://i.imgur.com/luOIY4r.jpg)}.dionysus{background-image: url(https://i.ibb.co/tZWFsDP/dionysus-big.jpg)}.hades{background-image: url(https://i.ibb.co/0hRF6dH/hades.jpg)}.hebe{background-image: url(https://i.ibb.co/MgPq75n/hebe-big.jpg)}.hecate{background-image: url(https://i.ibb.co/PD4486d/hecate-big.jpg)}.hephaestus{background-image: url(https://i.ibb.co/87CVRFv/hephaestus-big.jpg)}.hera{background-image: url(https://i.ibb.co/sRmmFzt/hera-big.jpg)}.hermes{background-image: url(https://i.ibb.co/dfPKqwW/hermes-big.jpg)}.hypnos{background-image: url(https://i.ibb.co/GcYWk0Q/hypnos-big.jpg)}.iris{background-image: url(https://i.ibb.co/qjmDhY1/iris.jpg)}.nemesis{background-image: url(https://i.ibb.co/LQCtdBt/nemesis-big.jpg)}.nike{background-image: url(https://i.ibb.co/Tw9dyWw/nike-big.jpg)}.poseidon{background-image: url(https://i.ibb.co/cD0fWx3/poseidon-big.jpg)}.thanatos{background-image: url(https://i.ibb.co/9G0pjRZ/thanatos-big.jpg)}.tyche{background-image: url(https://i.ibb.co/Z64LMMK/tyche-big.jpg)}.zeus{background-image: url(https://i.ibb.co/RNNkJ4K/zeus-big.jpg)}</style> </head> <body> <div id="profile" class="{{title}} {{name}}"> <img src="{{image}}" align="left" width="150px"/> <h1>{{name}}</h1> <span class="title">{{title}}</span> <div style="margin-top: 20px"> <div class="pill" style="background: #ee5552; color: #000; font-weight: bold;">{{ability}}</div><div class="pill" style="background: #f29188; color: #000; font-weight: bold;">{{pc}} Posts</div><div class="pill" style="background: #63e4e2; color: #000;"><b>EXP:</b>{{exp}}</div><div class="pill" style="background: #ce8afe; color: #000;"><b>HP:</b>{{hp}}</div><div class="pill" style="background: #3f683a; color: #fff;"><b>ATK:</b>{{atk}}</div><div class="pill" style="background: #fed541; color: #000;"><b>DEF:</b>{{def}}</div></div><div id="quote">{{quote}}</div></div></body> </html>`
                }).then(a => {
                    message.channel.send('', {
                        files: ['./image.png']
                    })
                })
            }

            browser.close()
        }
    }
}