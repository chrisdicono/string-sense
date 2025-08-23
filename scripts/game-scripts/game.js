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

// create background Konva layer
const backgroundLayer = new Konva.Layer();
stage.add(backgroundLayer);
backgroundLayer.add(new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    fillLinearGradientStartPoint: { x: 0, y: 0 },
    fillLinearGradientEndPoint: { x: stage.width(), y: stage.height() },
    fillLinearGradientColorStops: [0, '#85b1da', 1, '#d464d8ff'],
}));

// create layer where interactivity goes
const layer = new Konva.Layer();
stage.add(layer);

// Game variables
let gameState = 'menu';

// Game loop
function gameLoop() {
    // Update game state
    if (gameState === 'menu') { 
        handleMenu(layer, stage, (newState) => {
            gameState = newState;
        });
    } else {
        // handle other states
    }

    // Render the stage
    layer.draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
