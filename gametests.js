var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var y=0;
// //Rectangle for spaceship
// ctx.beginPath();
// ctx.rect(200, 20, 50, 50);
// ctx.fillStyle="gray";
// ctx.fill();
//
// //triangle for motor
// ctx.beginPath();
// ctx.moveTo(250, 80);
// ctx.lineTo(225, 100);
// ctx.lineTo(200, 80);
// ctx.fillStyle="orange";
// ctx.fill();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function drawStars(numberStars){
    for(let i=0; i<numberStars; i++){
        ctx.beginPath();
        ctx.rect(getRandomInt(800), getRandomInt(800), 5,5);
        ctx.fillStyle="white";
        ctx.fill();
    }

}

function draw(){
    //clearing canvas
    ctx.clearRect(0,0,canvas.width, canvas.height);

    //drawing rectangle
    ctx.beginPath();
    ctx.rect(200, y, 50, 50);
    ctx.fillStyle="gray";
    ctx.fill();

    //incremeting y coordinate
    y = y+5;

    // if x coordinate reach the height
    if (y >= 750){
        y=750;
    }else{
        //call draw again
        requestAnimationFrame(draw);
    }
}


function start(){
    y=0
    draw();
}
drawStars(10);
canvas.addEventListener("click", start);


ctx.save();
ctx.translate(canvas.width / 2, canvas.height / 2);    // translate context to center of canvas
ctx.rotate(Math.PI / 4); // rotate by 45°
ctx.rect(-25, -25, 50, 50);    // center square at origin by setting x and y to -1/2 of sides
ctx.fillStyle="white";
ctx.fill();
ctx.rect(100,100,20,20);
ctx.fill();
ctx.restore();

ctx.save();
ctx.rect(200,200,30,30);
ctx.fillStyle="white";
ctx.fill();
ctx.restore();
