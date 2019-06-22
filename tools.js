module.exports = {
    rollMessage: function(message, code) {
        let res = 0
        let init = 0
        const numbers = code.split('d');
        const plus = code.split('+');
        const minus = code.split('-');

        if (numbers.length < 2) return message.reply('Salah format woy.');

        if (plus.length >= 2) {
            init = Math.floor(Math.random() * parseInt(numbers[1])) + parseInt(plus[0])
            res = init + parseInt(plus[1])

            return message.reply('Dice Roll **' + `${code} = ${init}+${plus[1]}**=` + '`' + res + '`');
        } else if (minus.length >= 2) {
            init = Math.floor(Math.random() * parseInt(numbers[1])) - parseInt(minus[0])
            res = init + parseInt(minus[1])
            return message.reply('Dice Roll **' + `${code} = ${init}-${minus[1]}**=` + '`' + res + '`');
        } else {
            res = Math.floor(Math.random() * parseInt(numbers[1])) + parseInt(numbers[0])
            return message.reply('Dice Roll **' + `${code}**=` + '`' + res + '`');
        }
    },
    roll: function(code) {
        let res = 0
        let init = 0
        const numbers = code.split('d');
        const plus = code.split('+');
        const minus = code.split('-');

        if (numbers.length < 2) return 'Error!';

        if (plus.length >= 2) {
            init = Math.floor(Math.random() * parseInt(numbers[1])) + parseInt(plus[0])
            res = init + parseInt(plus[1])
        } else if (minus.length >= 2) {
            init = Math.floor(Math.random() * parseInt(numbers[1])) - parseInt(minus[0])
            res = init + parseInt(minus[1])
        } else {
            res = Math.floor(Math.random() * parseInt(numbers[1])) + parseInt(numbers[0])
        }

        return res;
    }
}