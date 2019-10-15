const search = require('../search.js')

module.exports = {
	name: 'topexp',
	type: 'eleftheria',
	parameter: '(jumlah members yang dimunculkan)',
	description: 'Campers banyak pengalaman',
	execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()

		let count = 10
		if (args.length > 0) count = args[0]
		if (count > 25) return message.reply('MAKSIMAL 25 YA!!')

		search.buildParams(message, client, ['-sort'], ['exp'])
	}
}