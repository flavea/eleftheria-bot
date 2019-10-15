const tools = require('../tools.js')
const request = require("request")

module.exports = {
	name: 'generate',
	type: 'tools',
	parameter: '-from (negara)',
	description: 'Generate karakter random',
	execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
		let from = 'united states'
		if (args.length > 0) {

			var pars = tools.paramBuilder(message, client, args)
			var arguments = pars[0]
			var queries = pars[1]

			arguments.forEach((arg, idx) => {
				if (arg == '-from') {
					from = queries[idx].toUpperCase()
				}
			})
		}

		options = {
			method: 'GET',
			url: 'https://uinames.com/api/',
			qs: {
				ext: '',
				region: from
			}
		}

		request(options, (error, response, body) => {
			if (error) throw new Error(error)

			body = JSON.parse(body)
			if (typeof body.error != 'undefined') message.reply(body.error)
			else message.reply(`**${body.name + ' ' + body.surname}** - ${body.gender} - Birthday ${body.birthday.dmy.substring(0, 5)}`)
		})
	}
}