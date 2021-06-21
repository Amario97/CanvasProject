const rows = 4;
const cols = 3;


let trackRight = 2;
let trackLeft = 1;
let trackUp = 3;
let trackDown = 0;


const spriteWidth = 135;
const spriteHeight = 246;
let width = spriteWidth / cols;
let height = spriteHeight / rows;


let curXFrame = 0; 
let frameCount = 3; 


let srcX = 0; 
let scrY = 0;


let left = false;
let right = false;
let up = false;
let down = false;

let counter = 1;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero-1.png";

// Star image
var starReady = false;
var starImage = new Image();
starImage.onload = function () {
    starReady = true;
};
starImage.src = "images/star.png";

// Coin image
var coinReady = false;
var coinImage = new Image();
coinImage.onload = function () {
    coinReady = true;
};
coinImage.src = "images/coin.png";



// Top image
var topReady = false;
var topImage = new Image();
topImage.onload = function () {
    topReady = true;
};
topImage.src = "images/sides.png";

 //Side image
var sideReady = false;
var sideImage = new Image();
sideImage.onload = function () {
    sideReady = true;
};
sideImage.src = "images/sides-2.png";

// goomba image
var goombaReady = false;
var goombaImage = new Image();
goombaImage.onload = function () {
    goombaReady = true;
};
goombaImage.src = "images/goomba.png";




// Game objects
var hero = {
    speed: 140, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};
var star = {
    
    x: 0,
    y: 0
};
var coin = {
    x:0,
    y:0
}

var goomba1 = {
    x: 200,
    y: 550
};
var goomba2 = {
    x: 600,
    y: 250
};
var goomba3 = {
    x: 300,
    y: 300
};
var goomba4 = {
    x: 100,
    y: 300
};
var goomba5 = {
    x: 300,
    y: 100
};

var starsCaught = 0;


// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
    //console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
//console.log(e.keyCode + " up")
    delete keysDown[e.keyCode];
}, false);






function touchinggoomba(who) {
    // Check if player touches goomba
    if (
        (who.x <= (goomba1.x + 50)  
            && goomba1.x +14 <= (who.x + 32)
            && who.y <= (goomba1.y + 64)
            && goomba1.y <= (who.y + 32)) ||
        (who.x <= (goomba2.x + 64)
            && goomba2.x <= (who.x + 32)
            && who.y <= (goomba2.y + 64)
            && goomba2.y <= (who.y + 32)) ||
        (who.x <= (goomba4.x + 64)
            && goomba4.x <= (who.x + 32)
            && who.y <= (goomba4.y + 64)
            && goomba4.y <= (who.y + 32)) ||
        (who.x <= (goomba5.x + 64)
            && goomba5.x <= (who.x + 32)
            && who.y <= (goomba5.y + 64)
            && goomba5.y <= (who.y + 32)) ||
        (who.x <= (goomba3.x + 64)
            && goomba3.x <= (who.x + 32)
            && who.y <= (goomba3.y + 64)
            && goomba3.y <= (who.y + 32))
    )
        return true;
    else {
        return false;
    }

}



// Update game objects
var update = function (modifier) {
    
    ctx.clearRect(hero.x, hero.y, width, height);
    left = false;
    right = false;
    up = false;
    down = false;
    
    
    if (38 in keysDown && hero.y > 26 + 6) { //  holding up key
        left = false;
        right = false;
        up = true;
        down = false;
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - (86 + 4)) { //  holding down key
        left = false;
        right = false;
        up = false;
        down = true;
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > (24 + 2)) { // holding left key
        left = true;
        right = false;
        up = false;
        down = false;
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - (70 + 4)) { // holding right key 
        left = false;
        right = true;
        up = false;
        down = false;
        hero.x += hero.speed * modifier;
    }



    // Are they touching?
    if (
        hero.x <= (star.x + 64)
        && star.x <= (hero.x + 64)
        && hero.y <= (star.y + 64)
        && star.y <= (hero.y + 64) ||
        hero.x <= (coin.x + 64)
        && coin.x <= (hero.x + 64)
        && hero.y <= (coin.y + 64)
        && coin.y <= (hero.y + 64)
        

    ) {
        
        var snd = new Audio("audio/coin.wav"); 
            snd.play();
        ++starsCaught;   
           


        if (starsCaught > 4) {
             var snd = new Audio("audio/marioWin.wav"); 
            snd.play();
            alert("You Won!");
               
            reset();
            gameOver = true;
        }
        else {
            reset();       
        }

      
    }

    if (counter ==5){
    curXFrame = ++curXFrame % frameCount; 	//Updating the sprite frame index 
    // it will count 0,1,2,0,1,2,0, etc
    counter = 0;
    } else{
        counter++;
    }
    
    srcX = curXFrame * width;   	//Calculating the x coordinate for spritesheet 
    //if left is true,  pick Y dim of the correct row
    if (left) {
        //calculate srcY 
        srcY = trackLeft * height;
    }

    //if the right is true,   pick Y dim of the correct row
    if (right) {
        //calculating y coordinate for spritesheet
        srcY = trackRight * height;
    }

    if (up) {
        srcY = trackUp * height;
    }

    if (down){
        srcY = trackDown * height;
    }

    if (left == false && right == false && up == false && down == false) {
        srcX = 1 * width;
        srcY = 0 * height;
    }


    // Check if hero touches goomba
    if (touchinggoomba(hero)) {
        var snd = new Audio("audio/gameover.wav"); 
        snd.play();
        alert("GAME OVER!! YOU DIED")
        reset();
        gameOver = true;
    }

};


// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    //  Request to do this again ASAP
    requestAnimationFrame(main);
};


// Draw everything in the main render function
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (sideReady) {
        ctx.drawImage(sideImage, 0, 0);
        ctx.drawImage(sideImage, 800 - 32, 0);
    }

    if (topReady) {
        ctx.drawImage(topImage, 0, 0);
        ctx.drawImage(topImage, 0, 800 - 32);
    }   

    
    if (starReady) {
        ctx.drawImage(starImage, star.x, star.y);
    }

    if(coinReady){
        ctx.drawImage(coinImage, coin.x, coin.y);
    }

    
    if (heroReady) {
        //ctx.drawImage(heroImage, hero.x, hero.y);
         ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y, width, height);
    }

    if (goombaReady) {
        ctx.drawImage(goombaImage, goomba1.x, goomba1.y);
        ctx.drawImage(goombaImage, goomba2.x, goomba2.y);
        ctx.drawImage(goombaImage, goomba3.x, goomba3.y);
        ctx.drawImage(goombaImage, goomba4.x, goomba4.y);
        ctx.drawImage(goombaImage, goomba5.x, goomba5.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Stars Collected: " + starsCaught, 32, 0);



}


var reset = function () {
    hero.x = (canvas.width / 2) - 32;
    hero.y = (canvas.height / 2) - 32;


    let notGood = true;
    while (notGood) {
        //Place the star somewhere on the screen randomly
        star.x = 32 + (Math.random() * (canvas.width - 128)); 
        star.y = 32 + (Math.random() * (canvas.height - 128));
        if (!touchinggoomba(star)) {
            notGood = false;
        }
    }
    notGood=true;
    while(notGood){
        coin.x = 32+ (Math.random() * (canvas.width - 128));
        coin.y =32 + (Math.random() * (canvas.height - 128));
        if(!touchinggoomba(coin)&&!touching(coin,star)){
            notGood=false;
        }
        }
        function touching(who,whom){
            if(
            who.x <= (whom.x + 32)
            && whom.x <= (who.x + 64)
            && who.y <= (whom.y + 64)
            && whom.y <= (who.y + 64)
            ){
                return true;
            }
            else{
                return false;
            }
        }

};


// Let's play this game!
var then = Date.now();
reset();
main();  // call the main game loop.