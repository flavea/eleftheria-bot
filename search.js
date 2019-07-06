require('dotenv').config()

const eleftheria = require('./eleftheria.js')
const tools = require('./tools.js')
const request = require("request")
const API = process.env.API

module.exports = {
    buildParams: function (message, client, arguments, queries) {
        if (arguments.length == 1 && arguments[0] == "--sort" && queries[0].toUpperCase() == "POST") {
            message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
            eleftheria.getTopCampers(client, message, count)
        }
        else {
            let query = ''
            let title = []
            arguments.forEach((arg, idx) => {
                if (idx == 0) query += '?'
                else query += '&'
                if (arg == '--parent') {
                    let q = queries[idx].toUpperCase()
                    title.push(`CHILDREN OF ${q}`)
                    query += `Title_contains=${q}`
                } else if (arg == '--ability') {
                    let q = tools.titleCase(queries[idx])
                    title.push(`THOSE WHO HAVE ${q}`)
                    query += `Ability_contains=${q}`
                } else if (arg == '--sort') {
                    let q = queries[idx].toUpperCase()

                    title.push(`SORTED BY ${q}`)
                    if (q != "POST" && q != "EXP" && q != "HP" && q != "ATK" && q != "DEF") return message.reply(`Tidak bisa sort pakai ${q}`)
                    if (q == 'POST') q = 'Post'
                    query += `_sort=${queries[idx].toUpperCase()}:DESC`
                    if(arguments.length == 1) query += `&_limit=25`
                }
            })

            message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')

            var options = {
                method: 'GET',
                url: `${API}emembers${query}`
            };

            request(options, (error, response, body) => {
                if (error) throw new Error(error)

                body = JSON.parse(body)

                if (body.length > 0) {
                    var str = []
                    var idx = 0
                    str[idx] = ''
                    body.forEach(d => {
                        let newstr = `**${d.UserID} - ${d.Name}** | **Post Count:** ${d.Post} | **HP:** ${d.HP} | **EXP:** ${d.EXP} | **ATK**: 1d${d.ATK}+${d.ATKP} | **DEF**: 1d${d.DEF}+${d.DEFP} [[Go to Profile](${d.Link})]\n`

                        let cpl = str[idx] + newstr
                        if (cpl.length <= 1024) str[idx] = cpl
                        else {
                            idx++
                            str[idx] = newstr
                        }
                    })

                    let list = []
                    str.forEach(d => {
                        list.push({
                            name: title.join(' '),
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
                    })
                } else return message.reply(`PENCARIAN TIDAK MENEMUKAN HASIL, SAMA KAYAK CARI JODOH.`)
            })
        }
    }
}