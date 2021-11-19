var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var img_spaceship = new Image();
img_spaceship.src = 'spaceship_cartoon.png';
var pattern = ctx.createPattern(img_spaceship, 'repeat');

var img_spaceship2 = new Image();
img_spaceship2.src = 'spaceship2.png';
var pattern = ctx.createPattern(img_spaceship2, 'repeat');

var img_stars = new Image();
img_stars.src = 'stars.jpg';
var pattern_stars = ctx.createPattern(img_stars, 'repeat');

var spaceship={
    color: "gray",
    width: 50,
    height: 70,
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
    img:img_spaceship,
};

var spaceship2={
    color: "yellow",
    width: 50,
    height: 70,
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
    img:img_spaceship2,
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

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}

function collisionBetweenShips(){
    if(rectIntersect(spaceship.position.x, spaceship.position.y, spaceship.width, spaceship.height,
        spaceship2.position.x, spaceship2.position.y, spaceship2.width, spaceship2.height)){
            let initialp1velocity = spaceship.velocity;
            let initialp2velocity = spaceship2.velocity;
            spaceship.velocity=initialp2velocity;
            spaceship2.velocity=initialp1velocity;
        }
}

// function RectsColliding(targetA, targetB) {
//     return !(targetB.position.x > (targetA.position.x + targetA.width) || 
//              (targetB.position.x + targetB.width) < targetA.position.x || 
//              targetB.position.y > (targetA.position.x + targetA.height) ||
//              (targetB.position.y + targetB.height) < targetA.position.y);
//   }

function drawSpaceShip(ship){
    ctx.save();
    ctx.beginPath();
    ctx.translate(ship.position.x, ship.position.y);
    ctx.rotate(ship.angle);
    ctx.drawImage(ship.img,ship.width*-0.5,ship.height*-0.5,ship.width,ship.height);
    //ctx.rect(ship.width*-0.5, ship.height*-0.5, ship.width, ship.height);
    //ctx.fillStyle = ship.color;
    ctx.stroke();
    //ctx.fill();
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
var winner=null;

particles=[];
numparticles=500;

function isInEdges(ship){
    let velocityY=null;
    //landingPlatform
    if (ship.position.y > canvas.height-ship.height*0.5)   {
        if(ended){
            return;
        }
        let rotationShip=ship.angle;
        if(ship.velocity.y >=3){
            goodEnd=false;
        }else if(ship.velocity.y <3){
            goodEnd=true;
            winner=ship;
        }
        ship.position.y=canvas.height-ship.height*0.5;
        ship.velocity.y = 0;
        ship.velocity.x=0;
        ship.angle=rotationShip;
        gravity=0;
        groundTouched=true;
        for(i=0;i<numparticles;i++){
            particles.push(particle.create(ship.position.x,ship.position.y,(Math.random()*10)+1,Math.random()*Math.PI*2))
        }
        ended=true;
    }
    //sides
    if(ship.position.x > canvas.width-ship.width*0.5){
        //spaceship.position.x=0; // appears in the other side
        
        ship.position.x = canvas.width-ship.width*0.5;
        ship.velocity.x=-ship.velocity.x * 0.05;
    }
    if(ship.position.x < 0+ship.width*0.5){
        //spaceship.position.x=canvas.width; // appears in the other side
        
        ship.position.x=0+ship.width*0.5;
        ship.velocity.x=-ship.velocity.x*0.05;
    }
    //up
    if(ship.position.y < 0+ship.height*0.5){
        ship.position.y=0+ship.height*0.5;
        ship.velocity.y=-ship.velocity.y *0;
        //spaceship.velocity.x=-spaceship.velocity.x * 0.5;
    }
    calculateEnd(ship);
}


var ended=false;

function calculateEnd(ship){
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
        for (var i = 0; i < numparticles; i++) {
            particles[i].update();
            ctx.beginPath();
            ctx.arc(particles[i].position.getX(),particles[i].position.getY(),3,0,2*Math.PI,false);
            ctx.fill();
        }
        drawSpaceShip(winner);
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
    collisionBetweenShips();
    if(!groundTouched){
        updateSpaceShip(spaceship);
        drawSpaceShip(spaceship);
        updateSpaceShip(spaceship2);
        drawSpaceShip(spaceship2);
        axismoved(gp.axes);
    }else{
        resetStats(spaceship);
        resetStats(spaceship2);
    }
    buttonPressed(gp.buttons);
    drawStats();
    requestAnimationFrame(draw);
}

function resetStats(spaceship){
    spaceship.velocity.x=0;
    spaceship.velocity.y=0;
}

var velocityInfoGamepad = document.getElementById("velocity-info-gamepad");
var velocityInfoKeyboard = document.getElementById("velocity-info-keyboard");

function drawStats(){
    if (!spaceship.velocity){
        return;
    }
    velocityInfoGamepad.innerHTML="Velocity y: "+spaceship.velocity.y+ " Velocity x:" +spaceship.velocity.x;
    velocityInfoKeyboard.innerHTML="Velocity y: "+spaceship2.velocity.y+ " Velocity x:" +spaceship2.velocity.x;
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
      if(b[9].pressed){
          location.reload();
      }
    }
    return null;
  }



  
  


