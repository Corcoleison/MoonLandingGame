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
    motorOn:false,
    facingLeft:false,
    facingRight:false,
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
    ctx.moveTo(spaceship.width * -0.5, spaceship.height * 0.5);
    ctx.lineTo(spaceship.width * 0.5, spaceship.height * 0.5);
    ctx.lineTo(0, spaceship.height * 0.5 + Math.random() * 30);
    ctx.closePath();
    ctx.fillStyle="orange";
    ctx.fill();
}

function updateSpaceShip(){
    if (spaceship.facingRight){
        spaceship.angle +=Math.PI / 180;
    }else if(spaceship.facingLeft){
        spaceship.angle -=Math.PI / 180;
    }

    if(spaceship.motorOn){
        spaceship.position.x+=Math.sin(spaceship.angle);
        spaceship.position.y -=Math.cos(spaceship.angle);
    }
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    updateSpaceShip();
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
            spaceship.facingRight=true;
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
            spaceship.facingRight=false;
            break;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

draw();


