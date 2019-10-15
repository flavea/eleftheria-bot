module.exports = {
	name: 'fmk2',
	type: 'tools',
	parameter: '(tiga nama orang)',
	description: 'Pilihan Nicollo',
	execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
		if (args.length != 3) return message.reply('Masukan 3 nama.')
		else {
			for (let i = args.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				[args[i], args[j]] = [args[j], args[i]]
			}

			let string = `I will F: ${args[0]}, M: ${args[1]}, K: ${args[2]}\n`
			message.channel.send(string)
		}
	}
}