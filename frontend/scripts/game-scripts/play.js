// imports
import Utils from './Utils.js';
import { PitchDetector } from "https://esm.sh/pitchy@4";

// global variables
let initialized = false;
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = ctx.createAnalyser();

// audio setup
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const source = ctx.createMediaStreamSource(stream);
source.connect(analyser);
analyser.connect(ctx.destination);

// record current audio info 
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

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
    }

    //drawWaveform(primaryLayer);
}

function drawWaveform(layer) {
    const WIDTH = 500;
    const HEIGHT = 200;  
    const drawVisual = requestAnimationFrame(drawWaveform);
    analyser.getByteTimeDomainData(dataArray);
    // Fill solid color
    // layer.fillStyle = "rgb(200 200 200)";
    // layer.fillRect(0, 0, WIDTH, HEIGHT);'
    const bg = new Konva.Rect({
      x: stage.width() / 2,
      y: stage.height() / 2 + 60,
      width: WIDTH,
      height: HEIGHT,
      fill: 'grey',
      shadowBlur: 5,
      cornerRadius: 10,
    });
    layer.add(bg);

    // Begin the path
    layer.lineWidth = 2;
    layer.strokeStyle = "rgb(0 0 0)";
    layer.beginPath();
    // Draw each point in the waveform
    const sliceWidth = WIDTH / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * (HEIGHT / 2);

      if (i === 0) {
        layer.moveTo(x, y);
      } else {
        layer.lineTo(x, y);
      }

      x += sliceWidth;
    }

    // Finish the line
    layer.lineTo(WIDTH, HEIGHT / 2);
    layer.stroke();
}

export default handlePlay;