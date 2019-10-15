$(document).ready(function () {

    $('#submit').click(e => {
        
        if($("#gossip").val().trim() === '') alert("Isi dulu oi")
        else {
            $("#content").hide()
            $("#loading").show()
            var settings = {
                "url": "http://rp.prosa.id/egossips/count",
                "method": "GET",
            }

            $.ajax(settings).done(function (response) {
                $.post("/submit-gossip", {
                    gossip_id: parseInt(response) + 1,
                    gossip: $("#gossip").val()
                },
                function (data, status) {
                    $("#content").show()
                    $("#loading").hide()
                    alert("Gosip sudah masuk ke kantong!")
                })
            })
        }
    })
})