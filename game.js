var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.rect(200, 20, 50, 50);
ctx.fillStyle="gray";
ctx.fill();

ctx.beginPath();
ctx.moveTo(250, 80);
ctx.lineTo(225, 100);
ctx.lineTo(200, 80);
ctx.fillStyle="orange";
ctx.fill();