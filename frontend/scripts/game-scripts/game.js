// imports
import { freqs440 } from './note-freqs.js';
import handleMenu from './menu.js';
import handlePlay from './play.js';
import handleOptions from './options.js';

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

// create layer(s) where interactivity goes
const layer1 = new Konva.Layer({ id: 'game-layer-1' });
const layer2 = new Konva.Layer({ id: 'game-layer-2' });
// const layer3 = new Konva.Layer({ id: 'game-layer-3' });
// const layer4 = new Konva.Layer({ id: 'game-layer-4' });
stage.add(layer1);
stage.add(layer2);
// stage.add(layer3);
// stage.add(layer4);

// Game variables
let gameState = 'menu';

// Game loop
function gameLoop() {
    // Update game state
    switch (gameState) {
        case 'menu':
            handleMenu(layer2, stage, (newState) => {
                gameState = newState;
            });
            break;
        case 'play':
            handlePlay(layer2, stage, (newState) => {
                gameState = newState;
            });
            break;
        case 'options':
            handleOptions(layer2, stage, (newState) => {
                gameState = newState;
            });
            break;
        default:
            // code
            break;
    }

    // Render the stage
    backgroundLayer.draw();
    layer1.draw();
    layer2.draw();
    // layer3.draw();
    // layer4.draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
