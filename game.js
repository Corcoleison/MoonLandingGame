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
    //ctx.lineTo(0, spaceship.height * 0.5 + 5);
    ctx.lineTo(spaceship.width * -0.5, spaceship.height * 0.5);
    ctx.closePath();
    ctx.fillStyle="orange";
    ctx.fill();
}

drawSpaceShip();
