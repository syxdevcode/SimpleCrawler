window.onload = function(){
    var btn = document.getElementById("btn");
    var con = document.getElementById("con");
    btn.onclick = function(){
        var newwin = window.open('', "_blank", '');
        newwin.document.open('text/html', 'replace');
        newwin.opener = null;
        newwin.document.write(con.value);
        newwin.document.close();
    }
}