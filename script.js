var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;

var ballSpeedX = 10;
var ballSpeedY = 4;

var paddleLeft = 250;
var paddleRight = 250;
const paddleHeight = 100;
const paddleThickness = 10;


var player1Score = 0;
var player2Score = 0;
const winningScore = 4;

var winScreen = false;


function calculateMousePosition(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return  {
    x: mouseX,
    y: mouseY
  };
}

function handleMouseClick(evt){
  if (winScreen){
    player1Score = 0;
    player2Score = 0;
    winScreen = false;
  }
}

window.onload = function(){
canvas = document.getElementById('gameCanvas');
canvasContext = canvas.getContext('2d');
drawAll();
}

function start(){

  var framesPerSecond = 30;
  setInterval(function(){
    moveAll();
    drawAll();
  }, 1000/framesPerSecond); //  calls drawAll func so many time per second

canvas.addEventListener('mousedown', handleMouseClick);

canvas.addEventListener('mousemove',
function(evt){
  var mousePos = calculateMousePosition(evt);
  paddleLeft = mousePos.y-(paddleHeight/2);
    });


}

function ballReset(){
  if(player1Score >= winningScore || player2Score >= winningScore){
     winScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function computerMovement(){
  var paddleRightCenter = paddleRight + (paddleHeight/2);
  if(paddleRightCenter < ballY-35){ //if paddle above ball but ignor if within 35 pixels
    paddleRight +=6;  //move paddle down
  } else if(paddleRightCenter > ballY +35){
    paddleRight -=6; //move it up
  }
}

function moveAll(){
  if(winScreen){
    return; //skip function
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if(ballX >= canvas.width){ //right edge
    if(ballY > paddleRight && //if below top of the paddle
       ballY < paddleRight+paddleHeight){ //& above bottom of paddle
       ballSpeedX = -ballSpeedX;

       //change speed on paddle edge hit
       var deltaY = ballY - (paddleRight+paddleHeight/2);
       ballSpeedY = deltaY * 0.35;

  } else {
    player1Score ++; //must be before ballreset
    ballReset();
    }
}

  if (ballX < 0) { //left edge
    if(ballY > paddleLeft && //if below top of the paddle
       ballY < paddleLeft+paddleHeight){ //& above bottom of paddle
       ballSpeedX = -ballSpeedX; //flip ball direction

       //change speed on paddle edge hit
       var deltaY = ballY - (paddleLeft+paddleHeight/2);
       ballSpeedY = deltaY * 0.35;

    }  else {
      player2Score ++; //must be before ballreset
      ballReset();
      }
}

  if(ballY >= canvas.height){
    ballSpeedY = -ballSpeedY;
  }
  if (ballY < 0) {
  ballSpeedY = -ballSpeedY;
  }
}

function drawNet(){
  for(var i=0; i < canvas.height; i+=40){
    colorRect(canvas.width/2-1,i+5,2,30, 'white')
  }
}

function drawAll(){
  colorRect(0,0, canvas.width, canvas.height, 'black'); //canvas

  if(winScreen){
    canvasContext.fillStyle = 'white';

    if(player1Score >= winningScore) {
      canvasContext.fillText("Left player wins!", 350,200);
    } else if (player2Score >= winningScore){
      canvasContext.fillText("Right player wins!", 350,200);
    }

    canvasContext.fillText("click to continue", 350,500);
    return;
  }
  drawNet();
  colorRect(0,paddleLeft, paddleThickness, paddleHeight, 'white'); //paddle1 left
  colorRect(canvas.width-paddleThickness,paddleRight, paddleThickness, paddleHeight, 'white'); //paddle2 right
  colorCircle(ballX, ballY, 10, 'white'); //draw ball

  canvasContext.fillText(player1Score, 100,100);
  canvasContext.fillText(player2Score,canvas.width-100,100);
}

function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX,topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2,true);
  canvasContext.fill();
}
