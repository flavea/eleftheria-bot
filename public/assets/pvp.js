$(document).ready(function () {

    $('#submit').click(e => {
        if ($("#ID1").val() == '' || $("#ID2").val() == '') alert('ID harus diisi dua-duanya!')
        else {

            $("#content").hide()
            $("#loading").show()
            $.post("/get-pvp", {
                    id1: "136",
                    id2: "136"
                },
                function (data, status) {
                    $('#result').html(data)
                    $("#content").show()
                    $("#loading").hide()
                });
        }
    })
});