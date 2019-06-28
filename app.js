require('dotenv').config()
const express = require('express');
const puppeteer = require('puppeteer');
const request = require('request');
const port = process.env.PORT || 8080;
const app = express();
const forum = process.env.FORUM
const API = process.env.API

app.get('/', async function (req, res) {
    res.send('halo')
})

app.get('/fetch', async function (req, res) {

    const browser = await puppeteer.launch({
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    const page = await browser.newPage();

    let url = forum + '/index.php?&act=Members&photoonly=&name=&name_box=all&max_results=50&filter=ALL&sort_order=desc&sort_key=posts&st=';
    let start = 0;
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
        });

        founds = await page.evaluate(() => {
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

        links.push(...founds)

        start += 50

    }

    let f = 0

    while (f < links.length) {

        await page.goto(forum + links[f], {
            waitUntil: 'load',
            timeout: 3000000
        });

        let d = await page.evaluate(() => {
            let uData = {}
            if(document.querySelector('#battle-points > div:nth-child(6) > span').innerText != "No Information") {
                uData.name = document.querySelector('#profile-header > h1').innerText;
                uData.title = document.querySelector('#profile-header > span').innerText;
                uData.postcount = parseInt(document.querySelector('#profile1 > div:nth-child(4) > span').innerText);
                uData.HP = parseInt(document.querySelector('#battle-points > div:nth-child(6) > span').innerText);
                uData.ATK = document.querySelector('#battle-points > div:nth-child(3) > span').innerText;
                uData.DEF = document.querySelector('#battle-points > div:nth-child(4) > span').innerText;
                uData.EXP = parseInt(document.querySelector('#battle-points > div:nth-child(5) > span').innerText);
                uData.Ability = document.querySelector('#battle-points > div:nth-child(1) > span').innerText;
                uData.Weapon = document.querySelector('#battle-points > div:nth-child(2) > span').innerText;
            }
            return uData
        });

        d.link = links[f].trim()
        d.id = parseInt(links[f].replace('/index.php?showuser=', ''))

        var options = {
            method: 'GET',
            url: API + 'emembers',
            qs: {
                UserID: d.id
            },
            headers: {
                'cache-control': 'no-cache'
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            body = JSON.parse(body)

            if (body.length > 0) {
                options = {
                    method: 'PUT',
                    url: API + 'emembers/' + body.id,
                    headers: {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json'
                    },
                    body: {
                        Name: d.name,
                        Title: d.title,
                        Ability: d.Ability,
                        Weapon: d.Weapon,
                        Post: d.postcount,
                        HP: d.HP,
                        EXP: d.EXP,
                        ATK: d.ATK,
                        DEF: d.DEF,
                        Link: forum + d.link
                    },
                    json: true
                };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);

                    console.log(body);
                });
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
                        ATK: d.ATK,
                        DEF: d.DEF,
                        Link: forum + d.link
                    },
                    json: true
                };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);

                    console.log(body);
                });
            }
        });

        f++
    }

    browser.close()

    res.send('done')
});

process.on('unhandledRejection', err => {
    throw err;
});

app.listen(port, async function () {
    console.log(`Example app listening on port !`);
});