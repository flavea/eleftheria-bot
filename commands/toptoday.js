const eleftheria = require('../eleftheria.js')

module.exports = {
	name: 'toptoday',
	type: 'eleftheria',
	parameter: '',
	description: 'Campers rajin hari ini',
	execute(message, client) {
		message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
		eleftheria.getTopToday(client, message)
	}
}