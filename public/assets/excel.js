let main = ''
let APIKey = "AIzaSyDbF41h1sOk9MKFrbErCt9XbhKHMZ2bsHQ"
let SheetID = "1Qc4ebMNPPLFvTAahOZWENr99uTU0TwnoYIX5K4PXdiA"

function loadClient() {
    $("#loading").show()
    gapi.client.setApiKey(APIKey)
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/sheets/v4/rest")
        .then(() => {
                console.log("GAPI client loaded for API")
                execute()
            },
            err => {
                console.error("Error loading GAPI client for API", err)
                alert("Error loading GAPI client for API")
            })
}

function execute() {
    return gapi.client.sheets.spreadsheets.get({
            "spreadsheetId": SheetID
        })
        .then(response => {
                response.result.sheets.forEach((e, i) => {
                    let temp = $('.yTemp').clone().removeClass('yTemp').addClass('y')
                    $('a', temp).attr('target', `${e.properties.title}!A1:ZZ900`).text(e.properties.title)
                    if (i === 0) {
                        main = `${e.properties.title}!A1:ZZ900`
                        $('a', temp).addClass('selected')
                    }
                    $('.years').append(temp)
                })

                $('.y a').click(e => {
                    $('.y a').removeClass('selected')
                    let el = $(e.target)
                    el.addClass('selected')
                    let target = el.attr('target')
                    getData(target)
                })

                getData(main)

                $('.years').slick({
                    dots: false,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 3,
                    centerMode: true,
                    prevArrow: "<div class='prev'><</div>",
                    nextArrow: "<div class='next'>></div>",
                    responsive: [{
                            breakpoint: 800,
                            settings: {
                                slidesToShow: 2
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1
                            }
                        }
                    ]
                })
                $("#loading").hide()

            },
            err => {
                console.error("Execute error", err)
                alert("Execute error")
                $("#loading").hide()
            })
}

function getData(range) {
    $("#content").empty()
    $("#loading").show()
    return gapi.client.sheets.spreadsheets.values.get({
            "spreadsheetId": SheetID,
            "range": range
        })
        .then(response => {
                let data = response.result.values
                processData(data)
            },
            err => {
                console.error("Execute error", err)
                alert("Execute error", err)
                $("#loading").hide()
            })
}

function processData(data) {
    $("#loading").show()
    let keys = []
    if (data.length > 0) {
        let mainKey = ''
        for (let i = 0; i < data[0].length; i++) {
            if (data[0][i] != "" && data[0][i + 1] != "") {
                mainKey = data[0][i]
                keys.push({
                    mainKey: "",
                    keyName: data[0][i]
                })
            } else if (data[0][i] != "" && data[0][i + 1] == "") {
                mainKey = data[0][i]
                keys.push({
                    mainKey: mainKey,
                    keyName: data[1][i]
                })
            } else {
                keys.push({
                    mainKey: mainKey,
                    keyName: data[1][i]
                })
            }
        }

        for (let i = 2; i < data.length; i++) {
            let head = ''
            let ch = $('.characterTemp').clone().removeClass('characterTemp').addClass('character')
            for (let j = 1; j < keys.length; j++) {
                if (typeof data[i][j] != 'undefined') {
                    if (keys[j].keyName == 'Account Name' && data[i][j] != '') {
                        $('.name span', ch).text(data[i][j])
                    } else if (keys[j].keyName == 'Profile Link' && data[i][j] != '') {
                        $('#profButton', ch).attr("href", data[i][j]).css({
                            'display': 'block'
                        })
                    } else if (keys[j].keyName.includes('Image') && data[i][j] != '') {
                        $('img', ch).attr("src", data[i][j])
                    } else if (keys[j].mainKey != '' && data[i][j] != '') {
                        let info = $('.characterInfoTemp').clone().show().removeClass('characterInfoTemp').addClass('child')

                        if (keys[j].mainKey != head) {
                            head = keys[j].mainKey
                            $('h4', info).text(head)
                            $('.hr1', info).show()
                        } else {
                            $('h4', info).remove()
                        }

                        $('.user-info>b>span', info).html(keys[j].keyName + ' \&mdash; ')
                        $('.user-info>span', info).html(data[i][j])
                        $('.user-info', info).addClass('style1')

                        if (data[i][j].split(" ").length < 4) $('.user-info>b, .user-info>span', info).css({
                            'display': 'inline-block'
                        })

                        $('.information', ch).append(info)
                    } else if (keys[j].mainKey == '' && data[i][j] != '') {
                        let info = $('.characterInfoTemp').clone().show().removeClass('characterInfoTemp')
                        $('h4', info).remove()
                        $('.user-info>b>span', info).html(keys[j].keyName + ' \&mdash; ')
                        $('.user-info>span', info).html(data[i][j])
                        $('.user-info', info).addClass('style2')

                        if ($(".information div:last-child", ch).hasClass("child")) $('.hr1', info).show()

                        if (data[i][j].split(" ").length < 4) $('.user-info>b, .user-info>span', info).css({
                            'display': 'inline-block'
                        })
                        $('.information div:first-child .hr1', ch).remove()
                        $('.information', ch).append(info)

                    }

                }
            }
            $("#content").append(ch)
        }
    }
    $("#loading").hide()
}

$("#loading").show()

gapi.load("client")

$(window).load(function() {
    loadClient()
})
