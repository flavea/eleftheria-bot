module.exports = {
	name: 'fmk',
	type: 'tools',
	parameter: '(satu nama orang)',
	description: 'Untuk voting fmk',
	execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
        if (args.length == 0) return message.reply('Mau FMK siapa?')
        else {
            message.channel.send(args.join(' ')).then(sentEmbed => {
                sentEmbed.react("🇫")
                sentEmbed.react("🇲")
                sentEmbed.react("🇰")
            })
        }
	}
}