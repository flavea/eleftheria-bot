const tools = require('../tools.js')

module.exports = {
	name: 'ddr',
	type: 'tools',
	parameter: '(kode diceroll)',
	description: 'Untuk diceroll',
	execute(message, client) {
		let args = message.content.split(/ +/)
		args.shift()
        if (args.length == 0) return message.reply('Mana parameternyaa')
        else tools.rollMessage(message, args[0])
	}
}