var div_digg = document.getElementById("div_digg");
if (div_digg) {
    var child = document.createElement("div");
    child.innerHTML = '<a style="text-decoration: underline; color: red; font-size: 12px;" href="javascript:void(0);" onclick="c_follow();return false;">关注Porschev</a>';
    div_digg.appendChild(child);
    child.setAttribute("style", "margin:10px auto");
}