const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: 'blue',
    dx: 2,
    dy: 2,
    gravity: 0.5,
    bounce: 0.7
};

let obstacles = [
    { x: 300, y: 500, width: 100, height: 20, color: 'red', dx: 1 },
    { x: 500, y: 400, width: 100, height: 20, color: 'red', dx: -1 }
];

let keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function checkCollision(ball, obstacle) {
    return ball.x + ball.radius > obstacle.x &&
           ball.x - ball.radius < obstacle.x + obstacle.width &&
           ball.y + ball.radius > obstacle.y &&
           ball.y - ball.radius < obstacle.y + obstacle.height;
}

function updateBall() {
    if (keys['ArrowUp']) {
        ball.dy -= 0.5;
    }
    if (keys['ArrowDown']) {
        ball.dy += 0.5;
    }
    if (keys['ArrowLeft']) {
        ball.dx -= 0.5;
    }
    if (keys['ArrowRight']) {
        ball.dx += 0.5;
    }

    ball.dy += ball.gravity;
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.dy *= -ball.bounce;
    }

    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.dy *= -ball.bounce;
    }

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    obstacles.forEach(obstacle => {
        if (checkCollision(ball, obstacle)) {
            ball.dy *= -ball.bounce;
            ball.dx *= -1;
        }
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x += obstacle.dx;

        if (obstacle.x + obstacle.width < 0 || obstacle.x > canvas.width) {
            obstacles = obstacles.filter(o => o !== obstacle);
        }
    });
}

function addObstacle() {
    const newObstacle = {
        x: Math.random() > 0.5 ? 0 : canvas.width - 100,
        y: Math.random() * (canvas.height - 20),
        width: 100,
        height: 20,
        color: 'red',
        dx: Math.random() > 0.5 ? 1 : -1
    };
    obstacles.push(newObstacle);

    setTimeout(() => {
        obstacles.push(newObstacle);
    }, 5000);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawObstacles();
    updateBall();
    updateObstacles();
    requestAnimationFrame(gameLoop);
}

setInterval(addObstacle, 3000);
gameLoop();