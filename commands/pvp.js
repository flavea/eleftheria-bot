const eleftheria = require('../eleftheria.js')

module.exports = {
	name: 'pvp',
	type: 'eleftheria',
	parameter: '(user id 1) (user id 2)',
	description: 'This is war',
	execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
		if (args.length == 0 || typeof args[1] == 'undefined') return message.reply('Harus ada dua id user oi.')
		else if (isNaN(parseInt(args[0])) || isNaN(parseInt(args[1]))) return message.reply('Harus angka oi ID-nya.')
		else if (message.content.trim() == '!pvp 286 286') return message.reply('Maaf, pvp Nicollo vs Nicollo tanpa limit ronde diban, lelah lihatnya.')
		else if (message.content.trim() == '!pvp 189 189') return message.reply('Maaf, pvp Dorcas vs Dorcas juga  diban kalau tanpa limit ronde, *please have mercy*.')
		else if (message.content.trim() == '!pvp 228 228') return message.reply('Maaf, pvp Lorcan vs Lorvan juga  diban kalau tanpa limit ronde, *please have mercy*.')
		else if (message.content.trim() == '!pvp 286 189' || message.content.trim() == '!pvp 189 286' || message.content.trim() == '!pvp 189 228' || message.content.trim() == '!pvp 228 189' || message.content.trim() == '!pvp 286 228' || message.content.trim() == '!pvp 228 286') return message.reply('PvP ini diban. *please have mercy*.')
		else {
			let ronde = ''
			if (typeof args[2] != 'undefined' && !isNaN(parseInt(args[2]))) ronde = parseInt(args[2])
			if (ronde > 300) return message.reply('Maaf, ronde gak boleh lebih dari 300. Cape.')
			message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
			eleftheria.PvP(client, message, args[0], args[1], ronde)
		}
	}
}