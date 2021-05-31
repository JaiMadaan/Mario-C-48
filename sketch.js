var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var score=0;


var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  mario_running = loadAnimation("images/Capture1.png","images/Capture3.png","images/Capture4.png");
  mario_collided = loadAnimation("images/mariodead.png");
  groundImage = loadImage("images/ground2.jpg");
  
  coinImage = loadImage("images/coin.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle1 = loadImage("images/obstacle1.png");
  obstacle3 = loadImage("images/obstacle3.png");
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mario = createSprite(30,height/2+200);
  mario.addAnimation("running", mario_running);
  mario.scale = 0.5;
  
  
  ground = createSprite(width/2,height/2+300);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.addImage(groundImage)
  ground.depth = mario.depth
  mario.depth=+1
  
  gameOver = createSprite(width/2,height/2-80);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background("blue");
  textSize(20);
  fill(255);
  text("Score: "+ score,width/2,height/2-400);
//text("life: "+ life , 500,60);
  drawSprites();
  if (gameState===PLAY){
 
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && mario.y >= 139) {
      mario.velocityY = -12;
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 400){
        ground.x = ground.width/2;
      
      }
    mario.collide(ground);
    
    spawnCoin();
    spawnObstacles();
  
   if(obstaclesGroup.isTouching(mario)){
        gameState = END;
    } 
    if(coinGroup.isTouching(mario)){
        score+=10
    }
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    mario.addAnimation("collided", mario_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    mario.scale =0.35;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(width/2,height/2);
    coin.y = Math.round(random(80,120));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width/2,height/2+220);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  mario.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
  
}