var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

var HEIGHT = 600;
var WIDTH = 800;
var x0 = 0;
var y0 = 0;

document.onmousedown = function(mouse){
    x0 = mouse.clientX;
    y0 = mouse.clientY;

	drawDualLine(x0, y0);
}

document.onmouseup = function(mouse){
    ctx.save();
}

drawDualLine = function(x0, y0) {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	xStart = 0;
	yStart = -y0;

	xEnd = WIDTH;
	yEnd = x0 * xEnd - y0;

	ctx.fillRect(x0, y0, 10, 10);
    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
	ctx.strokeStyle = 'black';
    ctx.lineWidth=7;
    ctx.closePath();
}
