// imports
import Utils from './Utils.js';
import { PitchDetector } from "https://esm.sh/pitchy@4";

// global variables
let initialized = false;

function handlePlay(primaryLayer, stage, newState) {
    if (!initialized) {
        const promptText = new Konva.Text({
            x: stage.width() / 2,
            y: stage.height() / 2 - 75,
            text: 'Play any note.',
            fontSize: 30,
            fontFamily: 'Space Mono',
            fill: '#ddd',
            offsetX: 0,
        });
        promptText.offsetX(promptText.width() / 2);

        const noteText = new Konva.Text({
            x: stage.width() / 2,
            y: stage.height() / 2 - 40,
            text: '...',
            fontSize: 70,
            fontFamily: 'DynaPuff',
            fill: '#ddd',
            offsetX: 0,
            align: 'center',
            alignVertical: 'middle',
            id: 'note',
        });
        noteText.offsetX(noteText.width() / 2);

        primaryLayer.add(promptText);
        primaryLayer.add(noteText);
        primaryLayer.draw();

        initialized = true;

        const ctx = new AudioContext();
    }

    // more code
}

export default handlePlay;