const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const scoreEl = document.getElementById("score");
let score = 0;

// images
const greenHex = new Image();
greenHex.src = "GreenHex.png"; 
const redHex = new Image();
redHex.src = "RedHex.png";
const bombImg = new Image();
bombImg.src = "bomb.png";
const explosion = new Image();
explosion.src = "explosion.png";

//sounds
const scoreUpSound = new Audio("score_up.mp3");
const scoreDownSound = new Audio("score_down.mp3");
const popSound = new Audio("hex_pop.mp3");
const bombSound = new Audio("bomb_sound.mp3");

function drawGrid() {
  const gridSize = 50; 

  ctx.strokeStyle = "#42663a"; // dark green lines
  ctx.lineWidth = 1;

  // vertical lines
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // horizontal lines
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}


class Ball{
    constructor(x, y, dx, dy, radius, value){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.value = value;
        this.bomb = false;
    }

    draw(){
    let img;

    if (this.isExploding) {
        img = explosion;
    } else if (this.value === 0) {
        img = bombImg;
    } else {
        img = this.value >= 0 ? greenHex : redHex;
    }


    const height = this.radius * 2;
    const width = height * (img.naturalWidth / img.naturalHeight);

    ctx.drawImage(
        img,
        this.x - width / 2,
        this.y - height / 2,
        width,
        height
    );

    if (!this.isExploding) {
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = "white";
    ctx.font = "14px Futura";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.value, this.x, this.y);

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }

}

let balls = [];

function animate() {
    
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  for (let i = balls.length - 1; i >= 0; i--) {
  let ball = balls[i];
  ball.update();



  if (ball.x > canvas.width) {
    if(ball.value > 0){
        scoreUpSound.currentTime = 0;
        scoreUpSound.play();
    }
    if(ball.value < 0){
        scoreDownSound.currentTime = 0;
        scoreDownSound.play();
    }
    

    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);


    if (!ball.isExploding && ball.value !== 0) {
        score += ball.value;
        score = Math.max(0, Math.min(100, score));
        scoreEl.textContent = "Volume: " + score;
    }

    balls.splice(i, 1);
}
}
    

  requestAnimationFrame(animate);
}

function spawnBall(){
   
    const y = Math.random() * (canvas.height - 30) + 30;
    const speed = Math.random() * 1 + 1.4;

    const num = Math.floor(Math.random() * 11 ) -5;

    balls.push(new Ball(0, y, speed, 0, 30, num));
}

canvas.addEventListener("click", (event)=> {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];

    const dx = mouseX - ball.x;
    const dy = mouseY - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball.radius) {
        if (ball.value === 0) {
            score = 0;
            bombSound.currentTime = 0;
            bombSound.play();
            scoreEl.textContent = "Volume: " + score;

            ball.isExploding = true;
            ball.dx = 0;
            ball.dy = 0;

            setTimeout(() => {
                const index = balls.indexOf(ball);
                if (index !== -1) {
                    balls.splice(index, 1);
                }
            }, 800);

            } else {
                
                popSound.currentTime = 0;
                popSound.play();
    
                balls.splice(i, 1);
            }
            }
}



})

let imagesLoaded = 0;

function checkLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 4) {
    animate(); 
    
    setTimeout(() => {
      setInterval(spawnBall, 900);
    }, 1000);
    
  }
}

greenHex.onload = checkLoaded;
redHex.onload = checkLoaded;
bombImg.onload = checkLoaded;
explosion.onload = checkLoaded;

