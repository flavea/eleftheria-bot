require('dotenv').config()

const YouTube = require('simple-youtube-api')

module.exports = {
	name: 'play',
	type: 'interaction',
	parameter: '(lagu) atau nicollo play (lagu)',
	description: 'This is so sad, Nicollo play cidaha.',
	execute(message, client) {
        let song = message.content.toLowerCase().replace('nicollo', '').replace('play', '').replace(',', '').replace('!', '')
        
        let apis = [process.env.YOUTUBE_API, process.env.YOUTUBE_API_2, process.env.YOUTUBE_API_3, process.env.YOUTUBE_API_4]

        let youtube = new YouTube(apis[0])
        youtube.searchVideos(song, 1)
            .then(results => {
                if (results.length > 0) message.channel.send(`${results[0].title} https://www.youtube.com/watch?v=${results[0].id}`)
                else message.channel.send('Maaf, gak nemu nih ><')
                found = true
            })
            .catch(err => {
                let youtube = new YouTube(apis[1])
                youtube.searchVideos(song, 1)
                    .then(results => {
                        if (results.length > 0) message.channel.send(`${results[0].title} https://www.youtube.com/watch?v=${results[0].id}`)
                        else message.channel.send('Maaf, gak nemu nih ><')
                        found = true
                    })
                    .catch(err => {
                        let youtube = new YouTube(apis[2])
                        youtube.searchVideos(song, 1)
                            .then(results => {
                                if (results.length > 0) message.channel.send(`${results[0].title} https://www.youtube.com/watch?v=${results[0].id}`)
                                else message.channel.send('Maaf, gak nemu nih ><')
                                found = true
                            })
                            .catch(err => {
                                let youtube = new YouTube(apis[3])
                                youtube.searchVideos(song, 1)
                                    .then(results => {
                                        if (results.length > 0) message.channel.send(`${results[0].title} https://www.youtube.com/watch?v=${results[0].id}`)
                                        else message.channel.send('Maaf, gak nemu nih ><')
                                        found = true
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        message.channel.send('Maaf, kuota pencarian habis :( Nicollo masih budak kuota gratis :(')
                                    })
                            })
                    })
            })
        }
    }