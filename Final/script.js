const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const scoreEl = document.getElementById("score");
let score = 0;


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
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.fillStyle = this.value >= 0 ? "green" : "red";
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.value, this.x, this.y)
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }

}

let balls = [];

function animate() {
    console.log("bawl spawn");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    console.log("bawl spawn");
    const y = Math.random() * (canvas.height - 30) + 30;
    const speed = Math.random() * 1 + .7;
    const num = Math.floor(Math.random() * 41 ) -20;

    balls.push(new Ball(0, y, speed, 0, 15, num));
}

canvas.addEventListener("click", (event)=> {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    balls.forEach((ball, index) => {
        const dx = mouseX - ball.x;
        const dy = mouseY - ball.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < ball.radius){
            score += ball.value;
            if(score > 100){
                score = 100;
            }
            else if(score < 0){
                score = 0;
            }
            scoreEl.textContent = "Score: " + score;
            balls.splice(index, 1);

            
        }

    })



})

animate();

setTimeout(() => {
  setInterval(spawnBall, 1000);
}, 300);