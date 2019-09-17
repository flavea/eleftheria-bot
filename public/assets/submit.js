$(document).ready(function () {

    $('#submit').click(e => {
        
        if($("#gossip").val().trim() === '') alert("Isi dulu oi")
        else {
            $("#content").hide()
            $("#loading").show()
            $.post("/submit-gossip", {
                gossip: $("#gossip").val()
            },
            function (data, status) {
                $("#content").show()
                $("#loading").hide()
                alert("Gosip sudah masuk ke kantong!")
            });
        }
    })
});