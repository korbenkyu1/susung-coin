$(document).ready(() => {
    // add rest api for user info update 
    $.get("/api/log", results => {
        var container = $(".logContainer");
        var table = 
            $("<table></table>").html("<tr><th>날짜</th><th>입금처</th><th>출금처</th><th>금액</th></tr>");
        results.forEach(log => {            
            table.append(
                `<tr>
                    <td>${new Date(log.createdAt).toLocaleTimeString()}</td>
                    <td>${log.from}</td> 
                    <td>${log.to}</td>
                    <td>${log.money}</td>
                </tr>
                `)
            });
        container.append(table);
        if(results.length == 0){
            container.html("<p>거래 내역이 없습니다.</p>")
        }
    })
})
