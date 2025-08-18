let canvas = document.getElementById('gameCanvas');
let gameContainer = document.querySelector('.game-container');
let ctx = canvas.getContext('2d');
const canvasParent = canvas.parentElement;

function resizeCanvasToParent() {
    canvas.width = canvasParent.clientWidth;
    const canvasHeight = canvasParent.clientHeight;
    canvas.height = canvasHeight;
}

// Canvas resizing
resizeCanvasToParent();
window.addEventListener('resize', resizeCanvasToParent);
// Border radius + other properties
canvas.style.borderRadius = '15px';

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Update and render game objects here
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(50, 50, 100, 100);
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
