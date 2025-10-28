// imports
import Utils from "../Utils.js";
import Guitar from "./Guitar.js";
import Game from "./Game.js";

// global variables and setup
let userPref = {};

function handleDrill(primaryLayer, stage, newState, playConfig) {
  if (!playConfig.initialized) {
    let guitar = new Guitar(150, 100);
    primaryLayer.add(guitar._fretboardDisplay);
    primaryLayer.draw();

    playConfig.initialized = true;
  }

  // extra code here
}

export default handleDrill;
