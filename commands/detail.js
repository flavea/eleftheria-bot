const eleftheria = require('../eleftheria.js')

module.exports = {
	name: 'detail',
	type: 'eleftheria',
	parameter: '(id user)',
	description: 'Untuk melihat profil karakter',
	execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
        if (args.length == 0) return message.reply('Mau nyari siapa oi oi.')
        else if (isNaN(parseInt(args[0]))) return message.reply('Harus angka oi.')
        else {
            message.channel.send('Tunggu sebentar ya, sayang, datanya lagi diambil, nih. Kalau gak muncul-muncul, aku lagi halu.')
            eleftheria.getUser(client, message, args[0])
        }
	}
}