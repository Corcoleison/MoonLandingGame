var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var titleInfo = document.getElementById("titleStart");

var thrustInfoKeyboard=document.getElementById("thrust-info-keyboard");
var thrustInfoGamepad=document.getElementById("thrust-info-gamepad");

var img_spaceship = new Image();
img_spaceship.src = 'spaceship_cartoon.png';
var pattern = ctx.createPattern(img_spaceship, 'repeat');

var img_spaceship2 = new Image();
img_spaceship2.src = 'spaceship2.png';
var pattern = ctx.createPattern(img_spaceship2, 'repeat');

var img_stars = new Image(0,0);
img_stars.src = 'stars_big.jpg';
var pattern_stars = ctx.createPattern(img_stars, 'repeat');

var audio_explosion_sp1 = new Audio('sound/explosion.mp3');
audio_explosion_sp1.loop=false;

var audio_explosion_sp2 = new Audio('sound/explosion.mp3');
audio_explosion_sp2.loop=false;

function playAudioExplosion(ship){
    if(!ship.played_explosion) ship.explosion_audio.play();
    ship.played_explosion=true;
}

var audio_landing_sp1 = new Audio('sound/landing_success.mp3');
audio_landing_sp1.loop=false;

var audio_landing_sp2 = new Audio('sound/landing_success.mp3');
audio_landing_sp2.loop=false;

function playAudioLanding(ship){
    if(!ship.played_landing) ship.landing_win_audio.play();
    ship.played_landing=true;
}

var audio_engine_sp1 = new Audio('sound/engine_short.mp3');

var audio_engine_sp2 = new Audio('sound/engine_short.mp3');

function playAudioEngineSP1(){
    audio_engine_sp1.load();
    let play = audio_engine_sp1.play();
    if (play !== undefined) {
        play.then(_ => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
    }
    audio_engine_sp1.loop=false;
}

function playAudioEngineSP2(){
    audio_engine_sp2.load();
    let play = audio_engine_sp2.play();
    if (play !== undefined) {
        play.then(_ => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
    }
    audio_engine_sp2.loop=false;
}

var audio_punch = new Audio('sound/punch.mp3');

function playAudioPunch(){
    audio_punch.load();
    let play = audio_punch.play();
    if (play !== undefined) {
        play.then(_ => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
    }
    audio_punch.loop=false;
}

var audio_theme = new Audio('sound/theme.mp3');

function playAudioTheme(){
    audio_theme.load();
    let play = audio_theme.play();
    if (play !== undefined) {
        play.then(_ => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
    }
    audio_theme.loop=false;
}

//titles randomly selected
winner_titles = Array("CONGRATULATIONS ","SOOO GOOD ", "YOU'RE SIMPLY THE BEST ", "SO PROUD OF YOU ", "BRAVO ", "YOU DID IT ", "WELL F** DONE ", "IMPRESSIE ");
loser_titles = Array("PATHETIC ", "YOU SUCK ", "HORRIBLE ", "TOTAL LOSER ", "TOTAL FAILURE ", "YOUR MOM WON'T BE PROUD ");

var spaceship={
    color: "RED",
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
    end:false,
    goodEnd:false,
    groundTouched:false,
    particles:[],
    played_explosion:false,
    played_landing:false,
    title_height:(canvas.height/2),
    explosion_audio:audio_explosion_sp1,
    landing_win_audio:audio_landing_sp1,
    thrustFuel:100,
    looser_title: loser_titles[Math.floor(Math.random()*loser_titles.length)],
    winner_title: winner_titles[Math.floor(Math.random()*winner_titles.length)],
};

var spaceship2={
    color: "YELLOW",
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
    end:false,
    goodEnd:false,
    groundTouched:false,
    particles:[],
    played_explosion:false,
    played_landing:false,
    title_height:(canvas.height/2)-60,
    explosion_audio:audio_explosion_sp2,
    landing_win_audio:audio_landing_sp2,
    thrustFuel:100,
    looser_title:loser_titles[Math.floor(Math.random()*loser_titles.length)],
    winner_title:winner_titles[Math.floor(Math.random()*winner_titles.length)],
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
    ctx.fillStyle = landingPlatform.color;
    ctx.save();
    ctx.translate(260.5, 447.5);
    ctx.scale(1, 0.18518518518518517);
    ctx.beginPath();
    ctx.arc(0, 0, 137, 0, 6.283185307179586, false);
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
            if(spaceship.groundTouched){
                spaceship2.end=true;
                spaceship2.goodEnd=false;
                spaceship2.groundTouched=true;
                for(i=0;i<numparticles;i++){
                    spaceship2.particles.push(particle.create(spaceship2.position.x,spaceship2.position.y,(Math.random()*10)+1,Math.random()*Math.PI*2))
                }
            }else if(spaceship2.groundTouched){
                spaceship.end=true;
                spaceship.goodEnd=false;
                spaceship.groundTouched=true;
                for(i=0;i<numparticles;i++){
                    spaceship.particles.push(particle.create(spaceship.position.x,spaceship.position.y,(Math.random()*10)+1,Math.random()*Math.PI*2))
                }
            }
            let initialp1velocity = spaceship.velocity;
            let initialp2velocity = spaceship2.velocity;
            spaceship.velocity=initialp2velocity;
            spaceship2.velocity=initialp1velocity;
            playAudioPunch();
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

var myReq;
var winner=null;

//particles=[];
numparticles=500;




function isInEdges(ship){
    let velocityY=null;
    //landingPlatform
    if (ship.position.y > canvas.height-ship.height*0.5)   {
        if(ship.end){
            return;
        }
        let rotationShip=ship.angle;
        if(ship.velocity.y >=3){
            ship.end=true;
            ship.goodEnd=false;
        }else if(ship.velocity.y <3 && ((ship.angle < 0.5 && ship.angle>-0.5))){
            winner=ship;
            ship.end=true;
            ship.goodEnd=true;
            ship.position.y=canvas.height-ship.height*0.5;
        }
        ship.velocity.y = 0;
        ship.velocity.x=0;
        ship.angle=rotationShip;
        ship.groundTouched=true;
        for(i=0;i<numparticles;i++){
            ship.particles.push(particle.create(ship.position.x,ship.position.y,(Math.random()*10)+1,Math.random()*Math.PI*2))
        }
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



function calculateEnd(ship){
    if(!ship.goodEnd && ship.groundTouched){
        //ctx.clearRect(0,0,canvas.width,canvas.height);
        //drawStars();
        if(winner){
            drawSpaceShip(winner);
        }
        //drawlandingPlatform();
        ctx.font = "bold 50px serif";
        ctx.fillStyle = ship.color;
        ctx.textAlign = "center";
        ctx.fillText(ship.loser_title+"PLAYER "+ship.color, canvas.width/2, ship.title_height);
        for (var i = 0; i < numparticles; i++) {
            ship.particles[i].update();
            ctx.beginPath();
            ctx.arc(ship.particles[i].position.getX(),ship.particles[i].position.getY(),3,0,2*Math.PI,false);
            ctx.fill();
        }
        playAudioExplosion(ship);
        ship.position.y=-50;
        ship.position.x=-50;
    }else if(ship.goodEnd && ship.groundTouched){
        //ctx.clearRect(0,0,canvas.width,canvas.height);
        //drawStars();
        ctx.font = "bold 50px serif";
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        ctx.fillText(ship.winner_title+"PLAYER "+ship.color, canvas.width/2, ship.title_height);
        for (var i = 0; i < numparticles; i++) {
            ship.particles[i].update();
            ctx.beginPath();
            ctx.arc(ship.particles[i].position.getX(),ship.particles[i].position.getY(),3,0,2*Math.PI,false);
            ctx.fill();
        }
        drawSpaceShip(ship);
        playAudioLanding(ship);
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
    isInEdges(spaceship);
    isInEdges(spaceship2);
    checkFuel();
    collisionBetweenShips();
    //drawlandingPlatform();
    if(!spaceship.groundTouched){
        if(!spaceship.goodEnd){
            drawSpaceShip(spaceship);
            updateSpaceShip(spaceship);
        }
    }
    if(!spaceship2.groundTouched){
        if(!spaceship2.goodEnd){
        updateSpaceShip(spaceship2);
        drawSpaceShip(spaceship2);
        }
    }
    if(!spaceship.end){
        axismoved(gp.axes);
    }
    buttonPressed(gp.buttons);
    drawStats();
    if(spaceship.end && spaceship2.end){
        audio_theme.pause();
        titleInfo.hidden=false;
        titleInfo.innerHTML="PRESS START IN THE CONTROLLER";
    }
    requestAnimationFrame(draw);
}

function checkFuel(){
    if(spaceship.motorOn){
        spaceship.thrustFuel--;
    }
    if(spaceship2.motorOn){
        spaceship2.thrustFuel--;
    }
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
    velocityInfoGamepad.innerHTML="Velocity y: "+spaceship.velocity.y.toFixed(2)+ " Velocity x:" +spaceship.velocity.x.toFixed(2);
    velocityInfoKeyboard.innerHTML="Velocity y: "+spaceship2.velocity.y.toFixed(2)+ " Velocity x:" +spaceship2.velocity.x.toFixed(2);
    thrustInfoGamepad.innerHTML="Thrust= "+spaceship.thrustFuel+" %";
    thrustInfoKeyboard.innerHTML="Thrust= "+spaceship2.thrustFuel+" %";
}

function keyDown(event){
    if(!spaceship2.end){
        switch (event.keyCode){
            //w key
            case 87:
                spaceship2.motorOn=true;
                playAudioEngineSP2();
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
    playAudioTheme();
    titleInfo.hidden=true;
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
            playAudioEngineSP1();
        }else if(ax[0]==1&ax[1]==0){ //right
            spaceship.facingRight=true;
        }else if(ax[0]==1&ax[1]==1){ //down right
            spaceship.facingRight=true;
        }else if(ax[0]==1&ax[1]==-1){ //up right
            spaceship.facingRight=true;
            spaceship.motorOn=true;
            playAudioEngineSP1();

        }else if(ax[0]==-1&ax[1]==0){ //left
            spaceship.facingLeft=true;
        }else if(ax[0]==-1&ax[1]==1){ //down left
            spaceship.facingLeft=true;
        }else if(ax[0]==-1&ax[1]==-1){ //up left
            spaceship.facingLeft=true;
            spaceship.motorOn=true;
            playAudioEngineSP1();
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





  
  


