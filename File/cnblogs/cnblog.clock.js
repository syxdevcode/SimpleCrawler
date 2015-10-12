$(function () {
    try {
        customTimer("#canvas", function () {
            var canvas = document.getElementById("canvas");
            var can = canvas.getContext("2d");
            var radius = 80; //半径
            var centre = [80, 80]; //中心点

            setInterval(function () {
                mydrawclock();

            }, 1000);

            function mydrawclock() {
                //清空画布
                can.clearRect(0, 0, 500, 500);
                //钟的大小（圆）
                can.fillStyle = "#ebf0eb";
                can.beginPath();
                can.arc(centre[0], centre[1], radius, 0, Math.PI * 2, true);
                can.closePath();
                can.fill();
                //中心点
                can.fillStyle = "#0094ff";
                can.beginPath();
                can.arc(centre[0], centre[1], 4, 0, Math.PI * 2, true);
                can.closePath();
                can.fill();
                //画钟 宽度 度数 颜色 长度
                function drawclock(w, d, c, l) {
                    can.beginPath();
                    can.strokeStyle = c;
                    can.lineWidth = w;
                    can.moveTo(centre[0], centre[1]);
                    can.lineTo(centre[0] + (radius - l) * Math.cos(d), centre[1] + (radius - l) * Math.sin(d));
                    can.stroke();
                }

                var date = new Date();
                //因为画圆是从3点钟方向开始的 所以要减去
                var hours = date.getHours();
                hours = hours - 9 > 0 ? hours : "0" + hours;
                var minutes = date.getMinutes();
                minutes = minutes - 9 > 0 ? minutes : "0" + minutes;
                var seconds = date.getSeconds();
                seconds = seconds - 9 > 0 ? seconds : "0" + seconds;
                var day = date.getDay();

                drawclock(4, (hours - 3 + minutes / 60) * 30 * Math.PI / 180, "#0094ff", 33);
                drawclock(3, (minutes - 15 + seconds / 60) * 6 * Math.PI / 180, "#0094ff", 22);
                drawclock(2, (seconds - 15) * 6 * Math.PI / 180, "#0094ff", 1);

                document.getElementById("div1").innerHTML = hours + ":" + minutes + ":" + seconds;

                switch (day) {
                    case 0:
                        day = "星期天";
                        break;
                    case 1:
                        day = "星期一";
                        break;
                    case 2:
                        day = "星期二";
                        break;
                    case 3:
                        day = "星期三";
                        break;
                    case 4:
                        day = "星期四";
                        break;
                    case 5:
                        day = "星期五";
                        break;
                    case 6:
                        day = "星期六";
                        break;
                    default:
                        break;
                }

                document.getElementById("div2").innerHTML = day; // "</br>" + day;
                // centre[0], centre[1]
                //画分钟刻度
                for (var i = 0; i < 60; i++) {
                    var angle = i * 6 * Math.PI / 180;
                    can.strokeStyle = "red";
                    can.beginPath();
                    can.lineWidth = 1;
                    can.moveTo(centre[0] + radius * Math.cos(angle), centre[1] + radius * Math.sin(angle));
                    can.lineTo(centre[0] + (radius - 5) * Math.cos(angle), centre[1] + (radius - 5) * Math.sin(angle));
                    can.stroke();
                }
                //画时钟刻度
                for (var i = 0; i < 12; i++) {
                    var angle = i * 30 * Math.PI / 180;
                    can.strokeStyle = "#0094ff";
                    can.lineWidth = 2;
                    can.beginPath();
                    can.moveTo(centre[0] + radius * Math.cos(angle), centre[1] + radius * Math.sin(angle));
                    can.lineTo(centre[0] + (radius - 8) * Math.cos(angle), centre[1] + (radius - 8) * Math.sin(angle));
                    can.stroke();
                }
            }
        });
    } catch (e) { } 
});