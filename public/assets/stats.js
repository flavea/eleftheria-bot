$(document).ready(function () {

    function titleCase(str) {

        str = str.toLowerCase().split(' ');
        let exceptions = ['of', 'and', 'or']

        let final = [];

        for (let word of str) {
            if (!exceptions.includes(word)) final.push(word.charAt(0).toUpperCase() + word.slice(1));
            else final.push(word)
        }

        return final.join(' ')

    }

    $("#content").hide()
    $("#loading").show()
    var settings = {
        "async": true,
        "url": "/get-stats",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
        }
    }

    $.ajax(settings).done(function (response) {
        response.forEach(e => {
            let ch = $('.tmpTR').clone().removeClass('tmpTR').show()
            let ATK = e.ATK.split('d')
            if (ATK.length > 1) ATK = ATK[1].split('+')
            let DEF = e.DEF.split('d')
            if (DEF.length > 1) DEF = DEF[1].split('+')

            let Weapon = e.Weapon.split(' - ')
            if (Weapon.length == 1) Weapon = e.Weapon.split(', ')
            if (Weapon.length == 1) Weapon = e.Weapon.split('—')
            if (Weapon.length == 1) Weapon = e.Weapon.split(';')
            if (Weapon.length == 1) Weapon = e.Weapon.split(':')


            let Title = titleCase(e.Title).split('of')

            $('.iUserID', ch).html(e.UserID)
            $('.iName', ch).html(titleCase(e.Name))
            $('.iTitle', ch).html(Title[0] == 'Unclaimed' ? "Unknown" : Title[1])
            $('.iAbility', ch).html(e.Ability == 'No Information' ? "-" : e.Ability)
            $('.iWeapon', ch).html(Weapon[0] == 'No Information' ? "-" : Weapon[0])
            $('.iHP', ch).html(e.HP)
            $('.iEXP', ch).html(e.EXP)
            $('.iATKPoint', ch).html(ATK[0])
            $('.iATKBase', ch).html(ATK[1])
            $('.iDEFPoint', ch).html(DEF[0])
            $('.iDEFBase', ch).html(DEF[1])
            $('.camps tbody').append(ch);
        });

        let t = $('.camps').DataTable({
            "columnDefs": [{
                "searchable": false,
                "orderable": false,
                "targets": 0
            }],
            "order": [
                [7, "desc"]
            ],
            "pageLength": 100
        })


        t.on('order.dt search.dt', function () {
            t.column(0, {
                search: 'applied',
                order: 'applied'
            }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });

        }).draw();
        $("#content").show()
        $("#loading").hide()
    });
});