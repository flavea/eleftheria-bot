const eleftheria = require('../eleftheria.js')

module.exports = {
	name: 'latest',
	type: 'eleftheria',
	parameter: '(jumlah topik yang dimunculkan)',
	description: 'Topik terbaru di Eleftheria',
	execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
		let amount = 10
		if (args.length == 0) amount = 10
		else if (isNaN(parseInt(args[0]))) return message.reply('Parameter harus angka oi.')
		else amount = parseInt(args[0])

		message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
		eleftheria.fetchLatestTopics(client, message, amount)
	},
}