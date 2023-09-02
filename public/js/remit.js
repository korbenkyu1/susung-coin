$("#submitFormButton").click(() => {
    var data = {
        to: $("#to").val().trim(),
        money: $("#money").val()
    }
    $.post("remit", data);
})