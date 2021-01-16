const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var box1, pig1,pig3;
var backgroundImg,platform;
var bird, slingshot;

var BirdReleaseSound;
var BirdSelectSound;

var gameState = "onSling";

var redImage;
var yellowImage;
var blueImage;

var Birds=[];

function preload() {

    GetBackgroundImage();

    BirdReleaseSound = loadSound("sounds/bird_flying.mp3");
    BirdSelectSound = loadSound("sounds/bird_select.mp3");
    redImage = loadImage("sprites/redbird.png");
    yellowImage = loadImage("sprites/yellowbird.png");
    blueImage = loadImage("sprites/bluebird.png");
}

function setup(){
    var canvas = createCanvas(1200,400);
    engine = Engine.create();
    world = engine.world;


    ground = new Ground(600,height,1200,20);
    platform = new Ground(150, 305, 300, 170);

    box1 = new Box(700,320,70,70);
    box2 = new Box(920,320,70,70);
    pig1 = new Pig(810, 350);
    log1 = new Log(810,260,300, PI/2);

    box3 = new Box(700,240,70,70);
    box4 = new Box(920,240,70,70);
    pig3 = new Pig(810, 220);

    log3 =  new Log(810,180,300, PI/2);

    box5 = new Box(810,160,70,70);
    log4 = new Log(760,120,150, PI/7);
    log5 = new Log(870,120,150, -PI/7);

    bird = new Bird(200,50);
    bird2 = new Bird(140,200);
    bird3 = new Bird(50,200);

    //log6 = new Log(230,180,80, PI/2);
    slingshot = new SlingShot(bird.body,{x:200, y:50});

    refresh = createImg("sprites/refresh.png");
    refresh.position(1100,20);

    Birds.push(bird3);
    Birds.push(bird2);
    Birds.push(bird);

    score = 0;
}

function draw(){
    if(backgroundImg){
        background(backgroundImg);
    }
    
    push();
    stroke("black");
    strokeWeight(5);
    fill("yellow");
    textSize(30);
    text("Score - "+ score,900,50);
    if(Birds.length > 1 && gameState == "launched"){
    text("Press Space to select another bird!",300,50);
    } 
    pop();

    Engine.update(engine);
    box1.display();
    box2.display();
    ground.display();
    pig1.display();
    log1.display();

    box3.display();
    box4.display();
    pig3.display();
    log3.display();

    box5.display();
    log4.display();
    log5.display();

    push();
    imageMode(CENTER);
    image(redImage,bird.body.position.x,bird.body.position.y,50,50);
    image(blueImage,bird2.body.position.x,bird2.body.position.y,50,50);
    image(yellowImage,bird3.body.position.x,bird3.body.position.y,50,50);
    pop();

    platform.display();
    slingshot.display();    

    pig1.Score();
    pig3.Score();

    if(score == 200 || Birds.length == 0){
        gameState = "End";
    }

    console.log(gameState); 

    if(gameState == "End"){
        push();
        stroke("black");
        strokeWeight(5);
        fill("yellow");
        textSize(30);
        text("Game Over",600,200);
        text("Press the restart button to play again!",300,50);
        pop();
    }

    refresh.mousePressed(reset);
}

function mouseDragged(){
    if (gameState!=="launched"){
        Matter.Body.setPosition(Birds[Birds.length - 1].body, {x: mouseX , y: mouseY});
    }
}


function mouseReleased(){
    slingshot.fly();
    if(gameState !== "launched"){
     BirdReleaseSound.play();
    }
    Birds.pop();
    gameState = "launched";
}

function keyPressed(){
    if(keyCode === 32){
        if(gameState !== "End");
        if(gameState == "launched"){
        BirdSelectSound.play();
        }
        gameState = "onSling";
        Matter.Body.setPosition(Birds[Birds.length - 1].body,{x:200,y:50});
        Matter.Body.setVelocity(Birds[Birds.length - 1].body,{x:0,y:0});
       slingshot.attach(Birds[Birds.length - 1].body);
    }
}

async function GetBackgroundImage(){

    var response = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata");

    var datetime = await response.json();

    var time = datetime.datetime;

    var hour = time.slice(11,13);

    console.log(hour);
    
    if(hour >= 17){
      bg = "sprites/bg2.jpg";
    }
    else{
      bg = "sprites/bg.png";
    }

    backgroundImg = loadImage(bg);

    console.log(bg);
}

function reset(){
    location.reload();
}