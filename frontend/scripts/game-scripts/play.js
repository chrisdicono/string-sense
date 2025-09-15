// imports
import Utils from "./Utils.js";
import { PitchDetector } from "https://esm.sh/pitchy@4";

// global variables
let initialized = false;
let testing = false;
let waveform;
let noteText;
let detector;
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = ctx.createAnalyser();
const SAMPLE_RATE = 2048;
const BOX_WIDTH = 500;
const BOX_HEIGHT = 100;
const WAVE_START = 205;
const WAVE_END = 695;

// audio setup
let source;
let bufferLength;
let dataArray;
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);

    // record current audio info
    analyser.fftSize = SAMPLE_RATE;
    bufferLength = analyser.fftSize;
    dataArray = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(dataArray);

    detector = PitchDetector.forFloat32Array(analyser.fftSize);
    detector.minVolumeDecibels = -20;
  })
  .catch(console.error);

// FIXME: handle audio context unpause with user interaction
function handlePlay(primaryLayer, stage, newState) {
  if (!initialized) {
    const promptText = new Konva.Text({
      x: stage.width() / 2,
      y: stage.height() / 2 - 95,
      text: "Play any note.",
      fontSize: 30,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    promptText.offsetX(promptText.width() / 2);

    noteText = new Konva.Text({
      x: stage.width() / 2,
      y: stage.height() / 2 - 60,
      text: "-",
      fontSize: 70,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
      align: "center",
      alignVertical: "middle",
      id: "note",
    });
    noteText.offsetX(noteText.width() / 2);

    const waveBg = new Konva.Rect({
      x: stage.width() / 2,
      y: stage.height() / 2 + 25,
      width: BOX_WIDTH,
      height: BOX_HEIGHT,
      fill: "#dddddd5a",
      cornerRadius: 20,
    });
    waveBg.offsetX(waveBg.width() / 2);

    waveform = new Konva.Line({
      points: [WAVE_START, 330, WAVE_END, 330],
      stroke: "#8b8b8bff",
      strokeWidth: 2,
    });

    primaryLayer.add(promptText);
    primaryLayer.add(noteText);
    primaryLayer.add(waveBg);
    primaryLayer.add(waveform);
    primaryLayer.draw();

    window.addEventListener("keydown", (keyEvent) => {
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      if (keyEvent.key == "t") {
        toggleTestMic();
      }
    });

    initialized = true;
  }

  drawWaveform(primaryLayer, stage);
}

function toggleTestMic() {
  try {
    switch (testing) {
      case false:
        analyser.connect(ctx.destination);
        testing = true;
        alert("testing");
        break;
      case true:
        analyser.disconnect(ctx.destination);
        testing = false;
        alert("not testing");
        break;
      default:
        alert("hello");
        console.warn(`Unexpected state for bool 'testing', ${testing}`);
        break;
    }
  } catch (e) {
    console.error("Error in toggleTestMic:", e);
  }
}

// TODO audio seems a little choppy when testing
// Waveform too, but waveform looks fine otherwise.
function drawWaveform(layer, stage) {
  analyser.getFloatTimeDomainData(dataArray);
  // plot each point in the waveform
  const sliceWidth = BOX_WIDTH / bufferLength;
  let x = WAVE_START;
  let wavePoints = [];
  for (let i = 0; i < bufferLength; i++) {
    if (x >= WAVE_END) {
      break;
    }
    const v = dataArray[i];
    const y = BOX_HEIGHT / 2 + 280 + (v * BOX_HEIGHT) / 2;
    // console.log("----- point -----");
    // console.log(dataArray[i]);
    // console.log(v);
    // console.log(y);
    // console.log(x);

    wavePoints.push(x);
    wavePoints.push(y);

    x += sliceWidth;
  }
  waveform.points(wavePoints);

  // redraw afterwards
  layer.draw();
  updatePitch(detector, dataArray);
}

function updatePitch(detector, input) {
  try {
    if (!detector || !input) return;

    const [pitch, clarity] = detector.findPitch(input, ctx.sampleRate);

    if (noteText) {
      noteText.text(Math.round(pitch * 10) / 10);
      noteText.offsetX(noteText.width() / 2);
    }
  } catch (error) {
    console.error("Error in updatePitch:", error);
  }

  // window.setTimeout(
  //   () => updatePitch(analyserNode, detector, input, sampleRate),
  //   100
  // );
}

export default handlePlay;
