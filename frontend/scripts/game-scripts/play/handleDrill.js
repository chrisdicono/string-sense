// imports
import Utils from "../Utils.js";
import Guitar from "./Guitar.js";
import Game from "./Game.js";

// global variables and setup
let game = null;
let guitar = null;

function handleDrill(primaryLayer, stage, newState, playConfig) {
  if (!playConfig.initialized) {
    game = new Game(primaryLayer, playConfig);
    guitar = game.guitar;
    primaryLayer.add(game.display);
    primaryLayer.draw();

    playConfig.initialized = true;
  }

  game.updateWaveform();
}

export default handleDrill;

// setTimeout(() => {
//   guitar.animateNoteSelection(0, 11, false);
//   console.log("incorrect animation played");
// }, 1000);
