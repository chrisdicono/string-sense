// imports
import Utils from "./Utils.js";
import { PitchDetector } from "https://esm.sh/pitchy@4";

// global variables
let initialized = false;
let playState = "modes";
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

function handlePlay(primaryLayer, stage, newState) {
  switch (playState) {
    case "modes":
      handleModes(primaryLayer, stage, newState);
      break;
    case "tuner":
      handleTuner(primaryLayer, stage, newState);
      break;
    default:
      console.log(`invalid play state: ${playState}`);
      break;
  }
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

    let detectedNote = Utils.roundNearestNote(pitch);
    if (detectedNote === "C0") {
      detectedNote = "-";
    }

    if (noteText) {
      noteText.text(detectedNote);
      noteText.text(detectedNote);
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

function handleTuner(primaryLayer, stage, newState) {
  if (!initialized) {
    const backButton = new Konva.Text({
      x: 25,
      y: 13,
      text: "<",
      fontSize: 30,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    backButton.offsetX(backButton.width() / 2);

    backButton.on("mouseover", () => {
      backButton.fill("#fff");
    });
    backButton.on("mouseout", () => {
      backButton.fill("#ddd");
    });
    backButton.on("click", () => {
      primaryLayer.destroyChildren();
      initialized = false;
      playState = "modes";
    });

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

    primaryLayer.add(backButton);
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

function handleModes(primaryLayer, stage, newState) {
  if (!initialized) {
    window.addEventListener(
      "click",
      () => {
        if (ctx.state === "suspended") {
          ctx.resume();
        }
      },
      { once: true }
    );

    const backButton = new Konva.Text({
      x: 25,
      y: 13,
      text: "<",
      fontSize: 30,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    backButton.offsetX(backButton.width() / 2);

    backButton.on("mouseover", () => {
      backButton.fill("#fff");
    });
    backButton.on("mouseout", () => {
      backButton.fill("#ddd");
    });
    backButton.on("click", () => {
      primaryLayer.destroyChildren();
      initialized = false;
      newState("menu");
    });

    const mainText = new Konva.Text({
      x: stage.width() / 2,
      y: stage.height() / 2 - 125,
      text: "choose a gamemode",
      fontSize: 35,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    mainText.offsetX(mainText.width() / 2);

    const tunerText = new Konva.Text({
      x: stage.width() - 60,
      y: 15,
      text: "tuner",
      fontSize: 25,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    tunerText.offsetX(tunerText.width() / 2);

    tunerText.on("mouseover", () => {
      tunerText.fill("#fff");
    });
    tunerText.on("mouseout", () => {
      tunerText.fill("#ddd");
    });
    tunerText.on("click", () => {
      primaryLayer.destroyChildren();
      initialized = false;
      playState = "tuner";
    });

    const zenButton = new Konva.Group({
      x: stage.width() / 2 - 120,
      y: stage.height() / 2 + 20,
    });

    const drillButton = new Konva.Group({
      x: stage.width() / 2 + 120,
      y: stage.height() / 2 + 20,
    });

    // "zen" and "drill" mode w/ dynapuff font
    const zenText = new Konva.Text({
      x: 0,
      y: 0,
      text: "Zen",
      fontSize: 55,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
    });
    zenText.offsetX(zenText.width() / 2);

    const drillText = new Konva.Text({
      x: 0,
      y: 0,
      text: "Drill",
      fontSize: 55,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
    });
    drillText.offsetX(drillText.width() / 2);

    const optRect1 = new Konva.Rect({
      x: 0,
      y: 25,
      width: 200,
      height: 165,
      fill: "#dddddd5a",
      cornerRadius: 20,
    });
    optRect1.offsetX(optRect1.width() / 2);
    optRect1.offsetY(optRect1.height() / 2);

    const optRect2 = new Konva.Rect({
      x: 0,
      y: 25,
      width: 200,
      height: 165,
      fill: "#dddddd5a",
      cornerRadius: 20,
    });
    optRect2.offsetX(optRect2.width() / 2);
    optRect2.offsetY(optRect2.height() / 2);

    zenButton.add(optRect1);
    zenButton.add(zenText);
    drillButton.add(optRect2);
    drillButton.add(drillText);

    // short description over hover (possibly animation later)
    primaryLayer.add(backButton);
    primaryLayer.add(mainText);
    primaryLayer.add(tunerText);
    primaryLayer.add(zenButton);
    primaryLayer.add(drillButton);
    primaryLayer.draw();

    zenButton.on("mouseover", () => {
      new Konva.Tween({
        node: zenText,
        duration: 0.2,
        scaleX: 1.05,
        scaleY: 1.05,
        easing: Konva.Easings.EaseInOut,
      }).play();

      new Konva.Tween({
        node: optRect1,
        duration: 0.2,
        scaleX: 1.1,
        scaleY: 1.1,
        fill: "#85b1dacc",
        easing: Konva.Easings.EaseInOut,
      }).play();
    });

    zenButton.on("mouseout", () => {
      new Konva.Tween({
        node: zenText,
        duration: 0.2,
        scaleX: 1,
        scaleY: 1,
        easing: Konva.Easings.EaseInOut,
      }).play();

      new Konva.Tween({
        node: optRect1,
        duration: 0.2,
        scaleX: 1,
        scaleY: 1,
        fill: "#dddddd5a",
        easing: Konva.Easings.EaseInOut,
      }).play();
    });

    drillButton.on("mouseover", () => {
      new Konva.Tween({
        node: drillText,
        duration: 0.2,
        scaleX: 1.05,
        scaleY: 1.05,
        easing: Konva.Easings.EaseInOut,
      }).play();

      new Konva.Tween({
        node: optRect2,
        duration: 0.2,
        scaleX: 1.1,
        scaleY: 1.1,
        fill: "#85b1dacc",
        easing: Konva.Easings.EaseInOut,
      }).play();
    });

    drillButton.on("mouseout", () => {
      new Konva.Tween({
        node: drillText,
        duration: 0.2,
        scaleX: 1,
        scaleY: 1,
        easing: Konva.Easings.EaseInOut,
      }).play();

      new Konva.Tween({
        node: optRect2,
        duration: 0.2,
        scaleX: 1,
        scaleY: 1,
        fill: "#dddddd5a",
        easing: Konva.Easings.EaseInOut,
      }).play();
    });

    initialized = true;
  }
}

export default handlePlay;
