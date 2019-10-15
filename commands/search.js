require('dotenv').config()

const eleftheria = require('../eleftheria.js')
const tools = require('../tools.js')
const search = require('../search.js')

module.exports = {
	name: 'search',
	description: 'Untuk mencari karakter',
	execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
		if (args.length == 0) return message.reply('Mau nyari siapa oi oi.')
		if (!args[0].startsWith('-')) {
			let name = args[0]
			if (args.length > 1) name = args.join(' ')
			if (name.length < 3) message.reply('Minimal 3 karakter lah nyarinya :(')
			else {
				message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
				eleftheria.searchCampers(client, message, name)
			}
		} else {
			var pars = tools.paramBuilder(message, client, args)
			var arguments = pars[0]
			var queries = pars[1]

			search.buildParams(message, client, arguments, queries)
		}
	}
}