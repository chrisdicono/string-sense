// imports
import { freqs440 } from './note-freqs.js';
import handleMenu from './menu.js';

// initialize Konva Stage
const gameContainer = document.querySelector('.game-container');
const stage = new Konva.Stage({
    container: 'konva-container',
    width: gameContainer.clientWidth,
    height: gameContainer.clientHeight,
});

// create Konva layer and add it to the stage
const layer = new Konva.Layer();
stage.add(layer);

// Game variables
let gameState = 'menu';

// Game loop
function gameLoop() {
    // Update game state
    if (gameState === 'menu') {
        handleMenu(layer, stage);
    } else {
        // different game state
    }

    // Render the stage
    layer.draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
