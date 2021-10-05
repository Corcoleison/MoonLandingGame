var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var spaceship={
    color: "gray",
    width: 40,
    height: 60,
    angle:0,
    position:{
        x:100,
        y:100,
    },
    motorOn:true,
    facingLeft:false,
    facingTrue:false,
};

function drawSpaceShip(){
    ctx.save();
    ctx.beginPath();
    ctx.translate(spaceship.position.x, spaceship.position.y);
    ctx.rotate(spaceship.angle);
    ctx.rect(spaceship.width*-0.5, spaceship.height*-0.5, spaceship.width, spaceship.height);
    ctx.fillStyle = spaceship.color;
    ctx.fill();
    ctx.closePath();
    if(spaceship.motorOn) {
        drawMotor();
    }
    ctx.restore();
}

function  drawMotor(){
    ctx.beginPath();
    ctx.moveTo(spaceship.position.x-100, spaceship.position.y-50*Math.random());
    ctx.lineTo(spaceship.width * 0.5, spaceship.height * 0.5);
    ctx.lineTo(spaceship.width * -0.5, spaceship.height * 0.5);
    ctx.closePath();
    ctx.fillStyle="orange";
    ctx.fill();
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawSpaceShip();
    requestAnimationFrame(draw);
}

function keyDown(event){
    switch (event.keyCode){
        //w key
        case 87:
            spaceship.motorOn=true;
            break;
        //a key
        case 65:
            spaceship.facingLeft=true;
            break;
        //d key
        case 68:
            spaceship.facingTrue=true;
            break;
    }
}

function keyUp(event){
    switch (event.keyCode){
        //w key
        case 87:
            spaceship.motorOn=false;
            break;
        //a key
        case 65:
            spaceship.facingLeft=false;
            break;
        //d key
        case 68:
            spaceship.facingTrue=false;
            break;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

draw();


