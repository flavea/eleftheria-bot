require('dotenv').config()

const request = require("request")
const API = process.env.API

module.exports = {
	name: 'remind',
	type: 'interaction',
	parameter: '(mention orangnya)',
	description: 'Untuk mengingatkan orang, boleh tag lebih dari satu',
	execute(message, client) {

		let options = {
			method: 'GET',
			url: `${API}reminders/count`
		}

		request(options, (error, response, body) => {
			if (error) throw new Error(error)

			body = parseInt(body)
			if (isNaN(body)) body = 16
			let res = 'a'
			while (isNaN(res)) res = Math.floor(Math.random() * body) + 1

			if (!message.mentions.users.size) {
				const res = Math.floor(Math.random() * body) + 1

				options = {
					method: 'GET',
					url: `${API}reminders`,
					qs: {
						quote_id: res
					}
				}

				request(options, (error, response, body) => {
					if (error) throw new Error(error)

					if (!body.startsWith('<')) body = JSON.parse(body)
					else body = ''

					if (body.length > 0) return message.reply(body[0].quote)
					else {
						console.log("Reminder Error: " + res)
						return message.reply('Yah, ada error! Coba lagi atau cek `!bantu` deh.')
					}
				})
			}

			message.mentions.users.forEach(tagged => {
				const res = Math.floor(Math.random() * body) + 1

				options = {
					method: 'GET',
					url: `${API}reminders`,
					qs: {
						quote_id: res
					}
				}

				request(options, (error, response, body) => {
					if (error) throw new Error(error)

					if (!body.startsWith('<')) body = JSON.parse(body)
					else body = ''

					if (body.length > 0) message.channel.send(`<@${tagged.id}> ${body[0].quote}`)
					else {
						console.log("Reminder Error: " + res)
						return message.reply('Yah, ada error! Coba lagi atau cek `!bantu` deh.')
					}
				})
			})
		})

	}
}