module.exports = {
    rollMessage: function (message, code) {
        let res = 0
        const numbers = code.split('d')
        let rot = numbers[0]

        if (numbers.length < 2) return message.reply('Salah format woy.')

        const plus = numbers[1].split('+')
        const minus = numbers[1].split('-')

        if (plus.length >= 2) {
            while (rot > 0) {
                res += Math.floor(Math.random() * parseInt(plus[0])) + 1
                rot--
            }
            res += parseInt(plus[1])
            return message.reply(`Dice Roll ${code} = ${res}`)
        } else if (minus.length >= 2) {
            while (rot > 0) {
                res += Math.floor(Math.random() * parseInt(minus[0])) + 1
                rot--
            }
            res -= parseInt(minus[1])
            return message.reply(`Dice Roll ${code} = ${res}`)
        } else {
            while (rot > 0) {
                res += Math.floor(Math.random() * parseInt(numbers[1])) + 1
                rot--
            }
            return message.reply(`Dice Roll ${code} = ${res}`)
        }
    },
    roll: function (code) {
        let res = 0
        const numbers = code.split('d')
        let rot = numbers[0]

        if (numbers.length < 2) return 'Error!'

        const plus = numbers[1].split('+')
        const minus = numbers[1].split('-')

        if (plus.length >= 2) {
            while (rot > 0) {
                res += Math.floor(Math.random() * parseInt(plus[0])) + 1
                rot--
            }
            res += parseInt(plus[1])
        } else if (minus.length >= 2) {
            while (rot > 0) {
                res += Math.floor(Math.random() * parseInt(minus[0])) + 1
                rot--
            }
            res -= parseInt(minus[1])
        } else {
            while (rot > 0) {
                res += Math.floor(Math.random() * parseInt(numbers[1])) + 1
                rot--
            }
        }

        return res
    },
    titleCase: function (str) {

        str = str.toLowerCase().split(' ')
        let exceptions = ['of', 'and', 'or']

        let final = []

        for (let word of str) {
            if (!exceptions.includes(word)) final.push(word.charAt(0).toUpperCase() + word.slice(1))
            else final.push(word)
        }

        return final.join(' ')

    },
    paramBuilder: function (message, client, args) {
        var arguments = []
        var queries = []

        args.forEach((arg, idx) => {
            if (arg.startsWith("-")) {
                let new_idx = idx + 1
                let params = []
                if (typeof args[new_idx] == 'undefined' || args[new_idx].startsWith("-")) return message.reply('Salah satu filter pencarian tak memiliki parameter.')
                else {
                    while (typeof args[new_idx] != 'undefined' && !args[new_idx].startsWith("-")) {
                        params.push(args[new_idx])
                        new_idx++
                    }
                }
                arguments.push(arg.toLowerCase())
                queries.push(params.join(' '))
            }
        })

        return [arguments, queries]
    }
}