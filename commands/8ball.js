module.exports = {
	name: '8ball',
	type: 'interaction',
	parameter: '(pertanyaan)',
	description: '8Ball',
	execute(message, client) {
        const answers = ['Ya!!!', 'GAK!!!!!!!!']
        let wheel = Math.floor(Math.random() * Math.floor(2))
        if (wheel === 2) wheel = 1
		message.reply(answers[wheel])
	}
}