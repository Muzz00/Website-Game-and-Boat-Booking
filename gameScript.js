//GameInstruction
function closeGameIns() {
    document.getElementById('gameIns').style.display = "none";
}

//To Disable game over on first show and reset game to 4 mins default and to display game instructions.
var firstTime = 0;
function showGameIns() {
    if (firstTime < 1) {
        restart();
    }
    firstTime++;
    document.getElementById('gameIns').style.display = "block";

}
//Sound for when game cotainer is opened
var powerUpSound = new Audio('audio/powerUp.mp3');
function playPowerUp() {
    powerUpSound.play();
}

//Function which draws the circles/bugs
function drawCircle(ctx, x, y, r, startAngle, endAngle, clockwise, fillUpColor, borderColor, borderWidth) {
    ctx.beginPath();
    ctx.arc(x, y, r, startAngle, endAngle, clockwise);
    ctx.closePath();
    ctx.fillStyle = fillUpColor;
    ctx.fill();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
}

//gameSpeed to determine speed of circle
var gameSpeed = 14;
//setInterval on game Speed Change
function gameSpeedChange() {
    gameSpeed = document.getElementById('gameSpeed').value;
    clearInterval(gameFloat);
    gameFloat = setInterval(circleFloatUp, gameSpeed);
    document.getElementById('gameSpeedValue').innerHTML = gameSpeed + "ms";
}

var popSound = new Audio('audio/popSound.mp3');
var charHitSound = new Audio('audio/charHit.mp3');
var gameOverSound = new Audio('audio/gameOver.mp3');

function circleFloatUp() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < circles.length; i++) {
        drawCircle(ctx, (circles[i][0]), circles[i][1], circles[i][2], 0, Math.PI * 2, true, circles[i][4], "black", "2");

        circles[i][3] -= gameSpeed; //Dynamically reduce stay down time to stay down. We are reducing xms from the timer for the circles as that is the Interval time at which this function is called
        if (circles[i][3] <= 0) { //Check if the 4000ms or 4s timer is done
            circles[i][1]--; //Minus 1 px
            if (circles[i][1] <= 20) { //If the circle is less than 20px splice it (remove it)
                circles.splice(i, 1);
            }
        }

        //IF HIT NET GAMESCORE +1 AND PLAY HAPPY SOUND
        /*Backup Checker: (circles[i][0] > (netx)) && (circles[i][0] < (netx + 100)) && circles[i][1] > (nety + 40) && circles[i][1] < (nety + 50)
        Maybe We can use this: ((((circles[i][0] - circles[i][2]) > (netx + 55)) && onRight) || ((circles[i][0] - circles[i][2]) > (netx + 7) && (circles[i][0] < (netx + 45)) && onRight == false))
            && ((circles[i][0] - circles[i][2]) < (netx + 90)) && circles[i][1] > (nety + 40) && circles[i][1] < (nety + 50)
            
        */
        if ((((circles[i][0] > (netx + 55)) && onRight) || (circles[i][0] > (netx + 7) && (circles[i][0] < (netx + 45)) && onRight == false))
            && (circles[i][0] < (netx + 90)) && circles[i][1] > (nety + 40) && circles[i][1] < (nety + 50)) {
            circles.splice(i, 1);
            if (runGame) {
                gameScore++;
                document.getElementById('gameScore').innerHTML = "Score: " + gameScore;
                if (document.getElementById('container2').style.display == "block") { //Only play the pop sound if in container2 (gameConatiner)
                    popSound.play();
                }
            }
        }

        //IF HIT CHARACTER GAMESCORE -1 AND PLAY UNHAPPY SOUND
        if (((circles[i][0] > (x)) && (circles[i][0] < (x + 85)) && (circles[i][1] > (y)) && (circles[i][1] < (y + 200)))
            && (document.getElementById('container2').style.display == "block")) {
            circles.splice(i, 1);
            gameScore--;
            if (document.getElementById('container2').style.display == "block") {
                charHitSound.play();
            }
            document.getElementById('gameScore').innerHTML = "Score: " + gameScore;
        }
    }
}
//default Game Settings
var gameFloat;
var circles = []
var gameScore = 0;
//Load on body load
function loadGame() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');


    circles = [[(getRandomPlace(20, 980)), 440, 6, 4000, "yellow"]]; // Initialising Array and by default one circle exists
    //[random X position, height, radius, timer to stay down, fillcolour]   

    //Create Random Circles
    setInterval(function () {
        if ((circles.length < 8) && runGame) { //Condition controls to make sure that there is only 8 bugs in the game at any given time
            newx = getRandomPlace(20, 980);
            newCircle = [newx, 440, 6, 4000, "yellow"]; //[random X position, height, radius, timer to stay down, fillcolour]
            circles.push(newCircle);
        }
    }, 1800); //Timing for how often a bug is produced


    //Change the radius
    setInterval(function () {
        for (var i = 0; i < circles.length; i++) {
            if (circles[i][2] < 20) {
                circles[i][2] += 0.5;
            }
        }
    }, 500); //Change the radius every 500ms

    //Change colour
    setInterval(function () {
        for (var i = 0; i < circles.length; i++) {
            if (circles[i][4] == "yellow") {
                circles[i][4] = "orange";
            }
            else if (circles[i][4] == "orange") {
                circles[i][4] = "red";
            }
        }
    }, 1000);


    gameFloat = setInterval(function () {
        circleFloatUp(); //Call the float up function on default
    }, 14);
    // Change this to increase or decrease speed of the bug floating to the top. Need to cover 420px in 6sec therefore ever 14.285714285714 seconds rounded to 14 sec

}

//Get random number within a paramater using min and max
function getRandomPlace(min, max) {
    return Math.random() * (max - min) + min;
}

//Prevent the page from scrolling on keydown
window.addEventListener("keydown", function (e) {
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

//Add Event Listneer
window.addEventListener('keydown', doKeyDown);
//Change this as you change character position
x = 300;
y = 20;
netx = 340;
nety = 80;
right = 1; //1 = net currently on right, 0= net currently on left
rightdown = false;
leftdown = false;
var onRight = true;
var keyPressed = ""; //For drawing eye
function doKeyDown(e) {
    clearTimeout(clearCharCanvas);
    switch (event.keyCode) {
        case 32: { //Space
            if (right > 0) {
                if (rightdown == false) {
                    document.getElementById('gameNet').style.transform = "scale(1,-1) rotate(-20deg)";
                    rightdown = true;
                }
                else {
                    document.getElementById('gameNet').style.transform = "scale(1,-1) rotate(20deg)";
                    rightdown = false;
                }
            }
            else if (right < 1) {
                //document.getElementById('gameNet').style.transform = "scale(-1,-1) rotate(-20deg)";
                if (leftdown == false) {
                    document.getElementById('gameNet').style.transform = "scale(-1,-1) rotate(-20deg)";
                    leftdown = true;
                }
                else {
                    document.getElementById('gameNet').style.transform = "scale(-1,-1) rotate(20deg)";
                    leftdown = false;
                }
            }
            break;
        }
        case 37: { //Left Arrow
            if (netx > 0) {
                x -= 10;
                netx -= 10;
                if (x < netx) {
                    document.getElementById('gameNet').style.transform = "scale(-1,-1) rotate(20deg)";
                    netx -= 90;
                    right = 0;
                    onRight = false;
                }
                keyPressed = "left"; //For  drawing eye
            }
            break;
        }
        case 38: { //Up Arrow
            if (y > 0) {
                y -= 10;
                nety -= 10;
                keyPressed = "up";
            }
            break;
        }
        case 39: { //Right Arrow
            if (netx < 910) {
                x += 10;
                netx += 10;
                if (x > netx) {
                    document.getElementById('gameNet').style.transform = "scale(1,-1) rotate(20deg)";
                    netx += 90;
                    right = 1;
                    onRight = true;
                }
                keyPressed = "right";
            }
            break;
        }
        case 40: { //Down Arrow
            if (y < 270) {
                y += 10;
                nety += 10;
                keyPressed = "down";
            }
            break;
        }
    }
    document.getElementById('character').style.left = x + "px";
    document.getElementById('character').style.top = y + "px";
    document.getElementById('gameNet').style.left = netx + "px";
    document.getElementById('gameNet').style.top = nety + "px";
    refreshCharAni();
}

//RESTART GAME
function restart() {
    gameScore = 0;
    circles = [];
    setTimer();
    document.getElementById('gameOver').style.display = "none";
    document.getElementById('gameScore').innerHTML = "Score: 0";
}


//Timer
//default Variables
var noTimer = false;
var runGame = true;
var timer;
var timer1;

//Run Game without Timer
function withoutTimer() {
    clearTimeout(timer);
    clearInterval(timer1);
    noTimer = true;
    runGame = true;
    document.getElementById('timing').innerHTML = "Timer is turned off";
    document.getElementById('gameOver').style.display = "none";
}

//Timing Function
function setTimer() {

    runGame = true;
    clearTimeout(timer);
    clearInterval(timer1);
    seconds = document.getElementById('timeoutNum').value;
    if (seconds == "" && noTimer) {
        seconds = 4; // By default set it to 4 minutes
    }
    timeoutSec = seconds * 60000;
    startTiming(timeoutSec);
    timer = setTimeout(function () {
        runGame = false;
        document.getElementById('finalScore').innerHTML = "Your final score was " + gameScore;
        document.getElementById('gameOver').style.display = "block";
        if (document.getElementById('container2').style.display == "block") {
            gameOverSound.play();
        }
    }, timeoutSec);

}
//FUNCTION FOR SETTING COUNTDOWN ON CANVAS
function startTiming(timeoutSec) {
    timer1 = setInterval(function () {
        if (timeoutSec != 0) {
            timeoutSec -= 1000;
            currentminutes = Math.floor(timeoutSec / 60000);
            currentseconds = (timeoutSec - (currentminutes * 60000)) / 1000;
            if (currentminutes != 0) {
                document.getElementById('timing').innerHTML = currentminutes + " minutes " + currentseconds + " seconds";//timeoutSec/1000;
            }
            else {
                document.getElementById('timing').innerHTML = currentseconds + " seconds";//timeoutSec/1000;
            }
        }
    }, 1000);
}



//draw eye animation
cnvs = document.getElementById('cAnimation');
charCtx = cnvs.getContext('2d');
var clearCharCanvas;
function refreshCharAni() {
    charCtx.clearRect(0, 0, canvas.width, canvas.height);
    //Perfect Center left: x+45 right: x+55
    if (keyPressed == "right") {
        //leftEye
        drawCircle(charCtx, x + 50, y + 20, 3, 0, Math.PI * 2, true, "black", "white", "3");
        //rightEye
        drawCircle(charCtx, x + 60, y + 20, 3, 0, Math.PI * 2, true, "black", "white", "3");
    }
    else if (keyPressed == "left") {
        //leftEye
        drawCircle(charCtx, x + 40, y + 20, 3, 0, Math.PI * 2, true, "black", "white", "3");
        //rightEye
        drawCircle(charCtx, x + 50, y + 20, 3, 0, Math.PI * 2, true, "black", "white", "3");
    }
    else if (keyPressed == "up") {
        //leftEye
        drawCircle(charCtx, x + 45, y + 15, 3, 0, Math.PI * 2, true, "black", "white", "3");
        //rightEye
        drawCircle(charCtx, x + 55, y + 15, 3, 0, Math.PI * 2, true, "black", "white", "3");
    }
    else if (keyPressed == "down") {
        //leftEye
        drawCircle(charCtx, x + 45, y + 25, 3, 0, Math.PI * 2, true, "black", "white", "3");
        //rightEye
        drawCircle(charCtx, x + 55, y + 25, 3, 0, Math.PI * 2, true, "black", "white", "3");
    }
    clearCharCanvas = setTimeout(function () {
        charCtx.clearRect(0, 0, canvas.width, canvas.height);
        keyPressed = "";
    }, 1500);
}
