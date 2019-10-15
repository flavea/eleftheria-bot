module.exports = {
	name: 'fmk3',
	type: 'tools',
	parameter: '(tiga nama orang)',
	description: 'Voting pilihan fmk',
	execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
		if (args.length != 3) return message.reply('Masukan 3 nama.')
		else {
			let string = `A. F: ${args[0]}, M: ${args[1]}, K: ${args[2]}\n`
			string += `B. F: ${args[0]}, M: ${args[2]}, K: ${args[1]}\n`
			string += `C. F: ${args[1]}, M: ${args[0]}, K: ${args[2]}\n`
			string += `D. F: ${args[1]}, M: ${args[2]}, K: ${args[0]}\n`
			string += `E. F: ${args[2]}, M: ${args[0]}, K: ${args[1]}\n`
			string += `F. F: ${args[2]}, M: ${args[1]}, K: ${args[0]}\n`
			message.channel.send(string).then(sentEmbed => {
				sentEmbed.react("🇦")
				sentEmbed.react("🇧")
				sentEmbed.react("🇨")
				sentEmbed.react("🇩")
				sentEmbed.react("🇪")
				sentEmbed.react("🇫")
			})
		}
	}
}