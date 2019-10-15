require('dotenv').config()

const request = require("request")
const API = process.env.API

module.exports = {
	name: 'gosip',
	description: 'Gosip dari perkemahan',
	execute(message, client) {

		options = {
			method: 'GET',
			url: `${API}egossips/count`
		}

		request(options, (error, response, body) => {
			if (error) throw new Error(error)

			body = parseInt(body)
			if (isNaN(body)) body = 16
			let res = 'a'
			while (isNaN(res)) res = Math.floor(Math.random() * body) + 1

			options = {
				method: 'GET',
				url: `${API}egossips`,
				qs: {
					gossip_id: res
				}
			}

			request(options, (error, response, body) => {
				if (error) throw new Error(error)

				if (!body.startsWith('<')) body = JSON.parse(body)
				else body = ''

				if (body.length > 0) return message.reply(body[0].gossip)
				else {
					console.log("Gosip Error: " + res)
					return message.reply('Yah, ada error! Coba lagi atau cek `!bantu` deh.')
				}
			})
		})
	}
}