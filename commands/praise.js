require('dotenv').config()

const request = require("request")
const API = process.env.API

module.exports = {
	name: 'praise',
	type: 'interaction',
	parameter: '(mention orangnya)',
	description: 'Untuk memuji orang lain, boleh tag lebih dari satu',
	execute(message, client) {

		if (!message.mentions.users.size) {
			return message.reply('Tag dulu orangnya woy.')
		}

		options = {
			method: 'GET',
			url: `${API}curses/count`
		}

		request(options, (error, response, body) => {
			if (error) throw new Error(error)

			body = parseInt(body)
			if (isNaN(body)) body = 16
			let res = 'a'
			while (isNaN(res)) res = Math.floor(Math.random() * body) + 1

			message.mentions.users.forEach(tagged => {
				const res = Math.floor(Math.random() * body) + 1

				options = {
					method: 'GET',
					url: `${API}curses`,
					qs: {
						curse_id: res
					}
				}

				request(options, (error, response, body) => {
					if (error) throw new Error(error)

					if (!body.startsWith('<')) body = JSON.parse(body)
					else body = ''

					if (body.length > 0) message.channel.send(`${body[0].curse} kamu, <@${tagged.id}>!`)
					else {
						console.log("Curse Error: " + res)
						return message.reply('Yah, ada error! Coba lagi atau cek `!bantu` deh.')
					}
				})

			})
		})
	}
}