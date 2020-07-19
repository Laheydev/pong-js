var canvas = document.getElementById("myCanvas");
var width = window.innerWidth
var height = window.innerHeight
canvas.width = width
canvas.height = height
let running = false;
const reboundSound = new Audio('./assets/rebound.mp3');


var ctx = canvas.getContext("2d");


const game = {
  rebounds: {
    value: 0,
    drawRebound: () => {

    }
  },
  player1: {
    name: "player1",
    width: 15,
    height: 100,
    posX: (width*10/100),
    posY: (height*50/100),
    color: "rgb(255,255,255)",
    size: "(15,100)",
    score: 0,
    moveUp() {
      this.posX = 60;
    }
  },
  player2: {
    name: "player2",
    posX: (width*90/100),
    posY: (height*50/100),
    width: 15,
    height: 100,
    color: "rgb(255,255,255)",
    score: 0,
    size: "(15,100)"
  },
  ball: {
    name: "ball",
    posX: (width*50/100),
    posY: (height*50/100 + 50),
    color: "rgb(255,255,255)",
    width: 10,
    height: 10,
    flag: "left",
    moveSpeed: 10,
    reboundDirection: 'Normal'
  }
};

const gameloop = {
  init: () => {
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.lineWidth = 5;
    ctx.setLineDash([5, 15]);
    ctx.strokeStyle = "white";
    ctx.stroke();
    // p1 init
    ctx.fillStyle = game.player1.color;
    ctx.fillRect(
      game.player1.posX,
      game.player1.posY,
      game.player1.width,
      game.player1.height
    );
    // p2 init
    ctx.fillStyle = game.player2.color;
    ctx.fillRect(
      game.player2.posX,
      game.player2.posY,
      game.player2.width,
      game.player2.height
    );
    // ball init
    ctx.fillStyle = game.ball.color;
    ctx.fillRect(game.ball.posX, game.ball.posY, 10, 10);
  },
  updateFromMoving: function() {
    this.init();
    ctx.fillStyle = game.player1.color;
    ctx.fillRect(
      game.player1.posX,
      game.player1.posY,
      game.player1.width,
      game.player1.height
    );
  },
  update: () => {
    gameloop.init();
   
  
    gameloop.ballMove();
    gameloop.collisionCheck();
    // bot level insane
    game.player2.posY = game.ball.posY-50;
    /////////////////////////////////
    game.rebounds.drawRebound();
  },
  gameStart: () => {
    if(running){
      return null
    }else{
      running = setInterval(gameloop.update, 16.6666667);
    }
   
  },
  gameEnd: () => {
    if(game.ball.flag == 'left'){
      game.player1.score += 1
    }else{
      game.player2.score += 1
    }

  ctx.fillText(game.player1.score, width/2-300, 200);
  ctx.fillText(game.player2.score, width/2+250, 200);
    
    clearInterval(running);
  },
  ballMove: () => {
    if(game.ball.flag === 'left' && game.ball.posX > -game.ball.width){
      game.ball.posX += -game.ball.moveSpeed
    }else if(game.ball.flag === 'right' && game.ball.posX < canvas.width+game.ball.width){

      game.ball.posX += game.ball.moveSpeed
    }else{
      gameloop.gameEnd()
    }

    if(game.ball.posY === 11){
      console.log(game.ball.posY)
      game.ball.reboundDirection === 'DOWN'
    }
    if(game.ball.reboundDirection === 'UP'){
      game.ball.posY -= 10
    }else if(game.ball.reboundDirection === 'DOWN'){
      game.ball.posY += 10
    }
  }, 
  collisionCheck: () => {
    if(game.ball.flag === 'left'){
      // checking if the ball is within xbound paddleWidth+90%windowWith && ybound
      if(game.ball.posX < Math.round(game.player1.posX+game.player1.width+game.ball.width+1)) {
        if(game.ball.posY >= game.player1.posY && game.ball.posY <= game.player1.posY + 100){
          game.ball.flag = 'right'
          // moving up or down depending on player position
          if(game.player1.posY < (height*50/100)){
            game.ball.reboundDirection = 'UP'
          }else{
            game.ball.reboundDirection = 'DOWN'
          }
         
          gameloop.speedUp()
          reboundSound.play();
          game.rebounds.value++

        }
      }
    }else if(game.ball.flag === 'right'){
      if (game.ball.posX > Math.round(game.player2.posX - game.player2.width - game.ball.width-1)){
        if(game.ball.posY >= game.player2.posY && game.ball.posY <= game.player2.posY + 100){
          reboundSound.play();
          gameloop.speedUp();
          game.ball.flag = 'left'
          game.rebounds.value++
        }
      }
    }
    // ball y axis 
 if(game.ball.posY <= 0){
  game.ball.reboundDirection = 'DOWN'
 }else if(game.ball.posY >= canvas.height){
  game.ball.reboundDirection = 'UP'
 }

  },
  speedUp: () => {
    game.ball.moveSpeed = game.ball.moveSpeed++
  }
};

// waiting for full load
window.addEventListener("DOMContentLoaded", function() {
  gameloop.init();
  ctx.font = '120px impact';
  
  // testing only

  
  

  // keys
  this.addEventListener(
    "keydown",
    event => {
      if (event.code == "ArrowUp" && game.player1.posY >= 0) {
        game.player1.posY -= 30;
        gameloop.updateFromMoving();
      } else if (
        event.code == "ArrowDown" &&
        game.player1.posY <= height - 100
      ) {
        game.player1.posY += 30;
        gameloop.updateFromMoving();
      } else if (event.code == "Enter") {
        gameloop.gameStart(true);
      }
    },
    false
  );
});
