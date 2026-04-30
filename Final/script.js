const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const scoreEl = document.getElementById("score");
let score = 0;


const greenHex = new Image();
greenHex.src = "GreenHex.png"; // make sure this path is correct
const redHex = new Image();
redHex.src = "RedHex.png";

function drawGrid() {
  const gridSize = 50; 

  ctx.strokeStyle = "#42663a"; // dark gray lines
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
    }

    draw(){
    const img = this.value >= 0 ? greenHex : redHex;

    const height = this.radius * 2;
    const width = height * (img.naturalWidth / img.naturalHeight);

    ctx.drawImage(
        img,
        this.x - width / 2,
        this.y - height / 2,
        width,
        height
    );

    // shadow settings
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // text
    ctx.fillStyle = "white";
    ctx.font = "14px Futura";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.value, this.x, this.y);

    //  reset shadow so it doesn't affect other drawings
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
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

  if (
    ball.x > canvas.width ||
    ball.x < 0 ||
    ball.y > canvas.height ||
    ball.y < 0
  ) {
    balls.splice(i, 1);
  }
}
    

  requestAnimationFrame(animate);
}

function spawnBall(){
   
    const y = Math.random() * (canvas.height - 30) + 30;
    const speed = Math.random() * 1 + .7;
    const num = Math.floor(Math.random() * 31 ) -15;

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
        score += ball.value;
        score = Math.max(0, Math.min(100, score));
        scoreEl.textContent = "Score: " + score;
        balls.splice(i, 1);
    }
}



})

let imagesLoaded = 0;

function checkLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    animate(); 
    
    setTimeout(() => {
      setInterval(spawnBall, 1900);
    }, 1000);
    
  }
}

greenHex.onload = checkLoaded;
redHex.onload = checkLoaded;

