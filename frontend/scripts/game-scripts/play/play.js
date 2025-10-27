// imports
import Utils from "../Utils.js";
import PlayConfig from "./PlayConfig.js";
import handleTuner from "./handleTuner.js";
import handleModes from "./handleModes.js";
import handleDrill from "./handleDrill.js";

let playConfig = null;
let initialized = false;

function handlePlay(primaryLayer, stage, newState) {
  if (!initialized) {
    playConfig = new PlayConfig(stage);
    initialized = true;
  }
  switch (playConfig.playState) {
    case "modes":
      handleModes(primaryLayer, stage, newState, playConfig);
      break;
    case "tuner":
      handleTuner(primaryLayer, stage, newState, playConfig);
      break;
    case "drill":
      handleDrill(primaryLayer, stage, newState, playConfig);
      break;
    default:
      console.log(`invalid play state: ${playConfig.playState}`);
      break;
  }
}

export default handlePlay;
