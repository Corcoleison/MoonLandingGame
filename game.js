var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var spaceship={
    color: "gray",
    width: 40,
    height: 60,
    angle:0,
    position:{
        x:0.2*canvas.width,
        y:0.2*canvas.width,
    },
    velocity: { 
        x: 0.001 * canvas.width, 
        y: -0.002 * canvas.width 
    },
    thrust:canvas.width*-0.0005,
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

var gravity = 0.05;

function updateSpaceShip() {
    spaceship.position.x += spaceship.velocity.x;
    spaceship.position.y += spaceship.velocity.y;
    if (spaceship.facingRight) spaceship.angle += Math.PI / 180 * 2;
    if (spaceship.facingLeft) spaceship.angle -= Math.PI / 180 * 2;

    if (spaceship.motorOn) {
        spaceship.velocity.x += spaceship.thrust * Math.sin(-spaceship.angle);
        spaceship.velocity.y += spaceship.thrust * Math.cos(spaceship.angle);
    }
    spaceship.velocity.y += gravity;
    isInEdges();
}

var groundTouched=false;
var goodEnd=false;
var myReq;

particles=[];
numparticles=500;

function isInEdges(){
    let velocityY=null;
    //ground
    if (spaceship.position.y > canvas.height)   {
        if(spaceship.velocity.y >=3){
            goodEnd=false;
        }else if(spaceship.velocity.y <3){
            goodEnd=true;
        }
        spaceship.velocity.y = 0;
        spaceship.velocity.x=0; 
        spaceship.position.y = canvas.height-20;
        gravity=0;
        groundTouched=true;
        for(i=0;i<numparticles;i++){
            particles.push(particle.create(spaceship.position.x,spaceship.position.y,(Math.random()*10)+1,Math.random()*Math.PI*2))
        }
        ended=true;
    }
    //sides
    if(spaceship.position.x > canvas.width){
        //spaceship.position.x=0; // appears in the other side
        
        spaceship.position.x = canvas.width;
        spaceship.velocity.x=-spaceship.velocity.x * 0.05;
    }
    if(spaceship.position.x < 0){
        //spaceship.position.x=canvas.width; // appears in the other side
        
        spaceship.position.x=0;
        spaceship.velocity.x=-spaceship.velocity.x*0.05;
    }
    //up
    if(spaceship.position.y < 0){
        spaceship.position.y=0;
        spaceship.velocity.y=-spaceship.velocity.y *0;
        //spaceship.velocity.x=-spaceship.velocity.x * 0.5;
    }
    calculateEnd();
}


var ended=false;

function calculateEnd(){
    if(!goodEnd && groundTouched){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.font = "bold 50px serif";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("PATHETIC", canvas.width/2, canvas.height/2);
        for (var i = 0; i < numparticles; i++) {
            particles[i].update();
            ctx.beginPath();
            ctx.arc(particles[i].position.getX(),particles[i].position.getY(),3,0,2*Math.PI,false);
            ctx.fill();
        }
    }else if(goodEnd && groundTouched){
        ctx.font = "bold 50px serif";
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        ctx.fillText("CONGRATULATIONS", canvas.width/2, canvas.height/2);
        drawSpaceShip();
    }
}

function draw(){
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads) {
        return;
    }
    var gp = gamepads[0];
    ctx.clearRect(0,0,canvas.width,canvas.height);
    updateSpaceShip();
    if(!groundTouched){
        drawSpaceShip();
        axismoved(gp.axes);
    }else{
        resetStats();
    }
    buttonPressed(gp.buttons);
    drawStats();
    requestAnimationFrame(draw);
}

function resetStats(){
    spaceship.velocity.x=0;
    spaceship.velocity.y=0;
}

var velocityInfo = document.getElementById("velocity-info");

function drawStats(){
    if (!spaceship.velocity){
        return;
    }
    velocityInfo.innerHTML="Velocity y: "+spaceship.velocity.y+ " Velocity x:" +spaceship.velocity.x;
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

var gamepadInfo = document.getElementById("gamepad-info");

window.addEventListener("gamepadconnected", function(e) {
    var gp = navigator.getGamepads()[e.gamepad.index];
    gamepadInfo.innerHTML = "Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";
    
    draw();
  });

window.addEventListener("gamepaddisconnected", function(e) {
    gamepadInfo.innerHTML = "Waiting for gamepad.";

    cancelRequestAnimationFrame(draw);
});

function axismoved(ax){
    if (typeof(ax) == "object") {
        //middle
        if(ax[0]==0&ax[1]==0){
            spaceship.motorOn=false;
            spaceship.facingRight=false;
            spaceship.facingLeft=false;
        
        }else if(ax[0]==0&ax[1]==-1){ //up 
            spaceship.motorOn=true;

        }else if(ax[0]==1&ax[1]==0){ //right
            spaceship.facingRight=true;
        }else if(ax[0]==1&ax[1]==1){ //down right
            spaceship.facingRight=true;
        }else if(ax[0]==1&ax[1]==-1){ //up right
            spaceship.facingRight=true;
            spaceship.motorOn=true;

        }else if(ax[0]==-1&ax[1]==0){ //left
            spaceship.facingLeft=true;
        }else if(ax[0]==-1&ax[1]==1){ //down left
            spaceship.facingLeft=true;
        }else if(ax[0]==-1&ax[1]==-1){ //up left
            spaceship.facingLeft=true;
            spaceship.motorOn=true;
        }
    }
    return null;
}

function buttonPressed(b) {
    if (typeof(b[2]) == "object") {
      if(b[0].pressed){
          location.reload();
      }
    }
    return null;
  }
  


