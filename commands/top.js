const eleftheria = require('../eleftheria.js')

module.exports = {
	name: 'top',
	type: 'eleftheria',
	parameter: '(jumlah members yang dimunculkan)',
	description: 'Top campers',
	execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
		let limit = 10
		if (args.length == 0) limit = 10
		else if (isNaN(parseInt(args[0]))) return message.reply('Parameter harus angka oi.')
		else limit = parseInt(args[0])

		if (limit > 20) return message.reply('Limit maksimal 20!')

		message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
		eleftheria.getTopCampers(client, message, limit)
	}
}