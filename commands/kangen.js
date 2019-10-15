module.exports = {
    name: 'kangen',
	type: 'interaction',
	parameter: '(mention orangnya)',
    description: 'Untuk bilang kangen via Nicollo',
    execute(message, client) {
        let args = message.content.split(/ +/)
        args.shift()
        if (args.length == 0 && !message.mentions.users.size) return message.reply('Makasih, tapi aku gak kangen kamu.')
        else if (args.length > 0 && !message.mentions.users.size) {
            name = args.join(' ')
            let user = message.guild.members.find(user => user.nickname == name)
            if (user == null) user = message.guild.members.find(user => user.username == name)

            if (user != null) {
                if (message.author.id == user.id) return message.reply('Apa-apaan kangen diri sendiri. Cuh.')
                else message.channel.send(`<@${user.id}>, katanya <@${message.author.id}> kangen nich. Unch, unch, ucu deh kalian. `)
            } else return message.reply(`Uhmmm, ${name} gak ketemu di sini, coba cek lagi nicknamenya atau suruh orangnya bikin nama satu nama aja. Atau, lebih oke lagi, langsung ngomong ke orangnya.`)
        } else if (message.mentions.users.size) {
            message.channel.send(`${args.join(', ')}, katanya <@${message.author.id}> kangen nich. Unch, unch, ucu deh kalian.`)
        }
    }
}