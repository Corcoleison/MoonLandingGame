var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var img = new Image();
img.src = 'spaceship_cartoon.png';
var pattern = ctx.createPattern(img, 'repeat');

var img_stars = new Image();
img_stars.src = 'stars.jpg';
var pattern_stars = ctx.createPattern(img, 'repeat');

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

var spaceship2={
    color: "yellow",
    width: 40,
    height: 60,
    angle:0,
    position:{
        x:0.8*canvas.width,
        y:0.2*canvas.width,
    },
    velocity: { 
        x: -0.001 * canvas.width, 
        y: -0.002 * canvas.width 
    },
    thrust:canvas.width*-0.0005,
    motorOn:false,
    facingLeft:false,
    facingRight:false,
};



function drawStars(){
    ctx.save();
    ctx.beginPath();
    ctx.drawImage(img_stars,0,0);
    ctx.closePath();
    ctx.restore();
    
}

var landingPlatform={
    color:"blue",
    width: 100,
    height: 50,
    position:{
        x:canvas.width/2,
        y:canvas.height-200,
    }
}

function drawlandingPlatform(){
    ctx.save();
    ctx.beginPath();
    ctx.rect(landingPlatform.position.x, landingPlatform.position.y,landingPlatform.width,landingPlatform.height);
    ctx.fillStyle = landingPlatform.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function RectsColliding(r1,r2){
    return !(
        r1.position.x>r2.position.x+r2.width || 
        r1.position.x+r1.width<r2.position.x || 
        r1.position.y>r2.y+r2.height || 
        r1.position.y+r1.height<r2.position.y
    );
}

function drawSpaceShip(ship){
    ctx.save();
    ctx.beginPath();
    ctx.translate(ship.position.x, ship.position.y);
    ctx.rotate(ship.angle);
    //ctx.drawImage(img,ship.width*-0.5,ship.height*-0.5,ship.width,ship.height);
    ctx.rect(ship.width*-0.5, ship.height*-0.5, ship.width, ship.height);
    ctx.fillStyle = ship.color;
    //ctx.stroke();
    ctx.fill();
    ctx.closePath();
    if(ship.motorOn) {
        drawMotor(ship);
    }
    ctx.restore();
}

function  drawMotor(ship){
    ctx.beginPath();
    ctx.moveTo(ship.width * -0.5, ship.height * 0.5);
    ctx.lineTo(ship.width * 0.5, ship.height * 0.5);
    ctx.lineTo(0, ship.height * 0.5 + Math.random() * 30);
    ctx.closePath();
    ctx.fillStyle="orange";
    ctx.fill();
}

var gravity = 0.05;

function updateSpaceShip(ship) {
    ship.position.x += ship.velocity.x;
    ship.position.y += ship.velocity.y;
    if (ship.facingRight) ship.angle += Math.PI / 180 * 2;
    if (ship.facingLeft) ship.angle -= Math.PI / 180 * 2;

    if (ship.motorOn) {
        ship.velocity.x += ship.thrust * Math.sin(-ship.angle);
        ship.velocity.y += ship.thrust * Math.cos(ship.angle);
    }
    ship.velocity.y += gravity;
}

var groundTouched=false;
var goodEnd=false;
var myReq;

particles=[];
numparticles=500;

function isInEdges(spaceship){
    let velocityY=null;
    //landingPlatform
    if (spaceship.position.y > canvas.height-spaceship.height*0.5)   {
        if(ended){
            return;
        }
        let rotationShip=spaceship.angle;
        if(spaceship.velocity.y >=3){
            goodEnd=false;
        }else if(spaceship.velocity.y <3){
            goodEnd=true;
        }
        spaceship.position.y=canvas.height-spaceship.height*0.5;
        spaceship.velocity.y = 0;
        spaceship.velocity.x=0;
        spaceship.angle=rotationShip;
        gravity=0;
        groundTouched=true;
        for(i=0;i<numparticles;i++){
            particles.push(particle.create(spaceship.position.x,spaceship.position.y,(Math.random()*10)+1,Math.random()*Math.PI*2))
        }
        ended=true;
    }
    //sides
    if(spaceship.position.x > canvas.width-spaceship.width*0.5){
        //spaceship.position.x=0; // appears in the other side
        
        spaceship.position.x = canvas.width-spaceship.width*0.5;
        spaceship.velocity.x=-spaceship.velocity.x * 0.05;
    }
    if(spaceship.position.x < 0+spaceship.width*0.5){
        //spaceship.position.x=canvas.width; // appears in the other side
        
        spaceship.position.x=0+spaceship.width*0.5;
        spaceship.velocity.x=-spaceship.velocity.x*0.05;
    }
    //up
    if(spaceship.position.y < 0+spaceship.height*0.5){
        spaceship.position.y=0+spaceship.height*0.5;
        spaceship.velocity.y=-spaceship.velocity.y *0;
        //spaceship.velocity.x=-spaceship.velocity.x * 0.5;
    }
    calculateEnd();
}


var ended=false;

function calculateEnd(){
    if(!goodEnd && groundTouched){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawStars();
        //drawlandingPlatform();
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
    drawStars();
    //drawlandingPlatform();
    isInEdges(spaceship);
    isInEdges(spaceship2);
    if(!groundTouched){
        updateSpaceShip(spaceship);
        drawSpaceShip(spaceship);
        updateSpaceShip(spaceship2);
        drawSpaceShip(spaceship2);
        axismoved(gp.axes);
        buttonPressed(gp.buttons);
    }else{
        resetStats(spaceship);
        resetStats(spaceship2);
    }
    drawStats();
    requestAnimationFrame(draw);
}

function resetStats(spaceship){
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
            spaceship2.motorOn=true;
            break;
        //a key
        case 65:
            spaceship2.facingLeft=true;
            break;
        //d key
        case 68:
            spaceship2.facingRight=true;
            break;
    }
}

function keyUp(event){
    switch (event.keyCode){
        //w key
        case 87:
            spaceship2.motorOn=false;
            break;
        //a key
        case 65:
            spaceship2.facingLeft=false;
            break;
        //d key
        case 68:
            spaceship2.facingRight=false;
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



  
  


