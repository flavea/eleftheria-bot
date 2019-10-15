module.exports = {
	name: 'hempas',
	type: 'interaction',
	parameter: '(mention orangnya)',
    description: 'Untuk menghempas via Nicollo',
	execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
		if (args.length == 0 && !message.mentions.users.size) return message.reply('Maaf, aku unhempasable.')
		else if (args.length > 0 && !message.mentions.users.size) {
			name = args.join(' ')
			let user = message.guild.members.find(user => user.nickname == name)
			if (user == null) user = message.guild.members.find(user => user.username == name)

			if (user != null) {
				if (message.author.id == user.id) return message.reply('Wah kamu maso ya hempas diri sendiri.')
				else message.channel.send(`Dan <@${message.author.id}> pun berkata pada <@${user.id}>, "Maaf, aku terlalu baik untukmu. Lebih baik kamu pilih yang lain."`)
			} else return message.reply(`Uhmmm, ${name} gak ketemu di sini, coba cek lagi nicknamenya atau suruh orangnya bikin nama satu nama aja. Atau, lebih oke lagi, langsung ngomong ke orangnya.`)
		} else if (message.mentions.users.size) {

			message.channel.send(`Dan <@${message.author.id}> pun berkata pada ${args.join(', ')}, "Maaf, aku terlalu baik untukmu. Lebih baik kamu pilih yang lain."`)
		}
	}
}