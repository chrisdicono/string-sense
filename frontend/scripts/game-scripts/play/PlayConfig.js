import Utils from "../Utils.js";
import { PitchDetector } from "https://esm.sh/pitchy@4";

class PlayConfig {
  constructor(stage) {
    // global variables
    this._SAMPLE_RATE = 2048;
    this._BOX_WIDTH = 250;
    this._BOX_HEIGHT = 75;
    this._WAVE_START = 0;
    this._WAVE_END = this._BOX_WIDTH - this._BOX_WIDTH / 10;
    this._initialized = false;
    this._playState = "modes";
    this._testing = false;
    this._waveform = new Konva.Line({
      points: [
        this._WAVE_START,
        this._BOX_HEIGHT / 2,
        this._WAVE_END,
        this._BOX_HEIGHT / 2,
      ],
      stroke: "#8b8b8b47",
      strokeWidth: 2,
    });
    this._waveform.offsetX(this._waveform.width() / 2);
    this._noteText = new Konva.Text({
      x: stage.width() / 2,
      y: stage.height() / 2 + 35,
      text: "-",
      fontSize: 70,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
      align: "center",
      alignVertical: "middle",
      id: "note",
    });
    this._noteText.offsetX(this._noteText.width() / 2);
    this._detector = null;
    this._tunerBlocks = [];
    this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    this._analyser = this._ctx.createAnalyser();

    // audio variables
    this._source = null;
    this._bufferLength = null;
    this._dataArray = null;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this._source = this._ctx.createMediaStreamSource(stream);
        this._source.connect(this._analyser);

        // record current audio info
        this._analyser.fftSize = this._SAMPLE_RATE;
        this._bufferLength = this._analyser.fftSize;
        this._dataArray = new Float32Array(this._bufferLength);
        this._analyser.getFloatTimeDomainData(this._dataArray);

        this._detector = PitchDetector.forFloat32Array(this._analyser.fftSize);
        this._detector.minVolumeDecibels = -20;
      })
      .catch(console.error);

    // other game variables can go here
  }

  // getters and setters below
  get initialized() {
    return this._initialized;
  }

  get playState() {
    return this._playState;
  }

  get testing() {
    return this._testing;
  }

  get waveform() {
    return this._waveform;
  }

  get noteText() {
    return this._noteText;
  }

  get detector() {
    return this._detector;
  }

  get tunerBlocks() {
    return this._tunerBlocks;
  }

  get ctx() {
    return this._ctx;
  }

  get analyser() {
    return this._analyser;
  }

  get SAMPLE_RATE() {
    return this._SAMPLE_RATE;
  }

  get BOX_WIDTH() {
    return this._BOX_WIDTH;
  }

  get BOX_HEIGHT() {
    return this._BOX_HEIGHT;
  }

  get WAVE_START() {
    return this._WAVE_START;
  }

  get WAVE_END() {
    return this._WAVE_END;
  }

  get source() {
    return this._source;
  }

  get bufferLength() {
    return this._bufferLength;
  }

  get dataArray() {
    return this._dataArray;
  }

  set initialized(value) {
    if (typeof value !== "boolean") {
      console.error("Invalid input: initialized must be set to a Boolean.");
      return;
    }
    this._initialized = value;
  }

  set playState(newState) {
    const validStates = ["modes", "tuner", "drill"];
    if (validStates.includes(newState)) {
      this._playState = newState;
    } else {
      console.warn(`Invalid play state: ${newState}`);
    }
  }

  set testing(value) {
    if (typeof value !== "boolean") {
      console.error("Invalid input: testing must be set to a Boolean.");
      return;
    }
    this._testing = value;
  }

  set waveform(newWaveform) {
    if (!(newWaveform instanceof Konva.Line)) {
      console.error("Invalid input: waveform must be a Konva.Line instance.");
      return;
    }
    this._waveform = newWaveform;
  }

  set noteText(newNoteText) {
    if (!(newNoteText instanceof Konva.Text)) {
      console.error("Invalid input: noteText must be a Konva.Text instance.");
      return;
    }
    this._noteText = newNoteText;
  }

  set detector(newDetector) {
    if (!(newDetector && typeof newDetector.findPitch === "function")) {
      console.error("Invalid input: detector must have a findPitch method.");
      return;
    }
    this._detector = newDetector;
  }

  pushToTunerBlocks(newNoteText) {
    if (!(newNoteText instanceof Konva.Rect)) {
      console.error(
        "Invalid input: the pushed block must be a Konva.Rect instance."
      );
    }
    this._tunerBlocks.push(newNoteText);
  }

  // resume audio context if suspended
  resumeAudioContext() {
    if (this._ctx.state === "suspended") {
      this._ctx.resume();
    }
  }

  // Toggle microphone testing (connect/disconnect analyser to destination)
  toggleTestMic() {
    try {
      switch (this._testing) {
        case false:
          this._analyser.connect(this._ctx.destination);
          this._testing = true;
          alert("testing");
          break;
        case true:
          this._analyser.disconnect(this._ctx.destination);
          this._testing = false;
          alert("not testing");
          break;
        default:
          alert("hello");
          console.warn(`Unexpected state for bool 'testing', ${this._testing}`);
          break;
      }
    } catch (e) {
      console.error("Error in toggleTestMic:", e);
    }
  }

  // waits for the components needed in drawWaveform to be defined before continuing
  async waitForAudioCtx() {
    while (!this._analyser || !this._dataArray) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    this._analyser.getFloatTimeDomainData(this._dataArray);
  }

  // Draw the waveform on the given Konva layer
  drawWaveform(layer) {
    this.waitForAudioCtx();
    // plot each point in the waveform
    const sliceWidth = this._BOX_WIDTH / this._bufferLength;
    let x = this._WAVE_START;
    let wavePoints = [];
    for (let i = 0; i < this._bufferLength; i++) {
      if (x >= this._WAVE_END) {
        break;
      }
      const v = this._dataArray[i];
      const y = this._BOX_HEIGHT / 2 + (v * this._BOX_HEIGHT) / 2;
      // console.log("----- point -----");
      // console.log(dataArray[i]);
      // console.log(v);
      // console.log(y);
      // console.log(x);

      wavePoints.push(x);
      wavePoints.push(y);

      x += sliceWidth;
    }
    this._waveform.points(wavePoints);

    // redraw afterwards
    layer.draw();
    this.updatePitch(this._dataArray);
  }

  // draws the waveform with a background at the given coordinates

  // Use pitchy to get the pitch from the audio input
  getPitch(input) {
    const [pitch, clarity] = this._detector.findPitch(
      input,
      this._ctx.sampleRate
    );
    return pitch;
  }

  // Get the nearest note from the detected pitch
  getNote(input) {
    let pitch = this.getPitch(input);
    let detectedNote = Utils.roundNearestNote(pitch);
    if (detectedNote === "C0") {
      detectedNote = "-";
    }
    return detectedNote;
  }

  // Update the pitch and note display
  updatePitch(input) {
    try {
      if (!this._detector || !input) return;

      let detectedNote = this.getNote(input);

      if (this._noteText) {
        this._noteText.text(detectedNote);
        this._noteText.text(detectedNote);
        this._noteText.offsetX(this._noteText.width() / 2);
      }
    } catch (error) {
      console.error("Error in updatePitch:", error);
    }
  }

  fillTuner() {
    for (let i = 0; i < this._tunerBlocks.length; i++) {
      this._tunerBlocks[i].fill("#dddddd5a");
    }

    let offset = Utils.calculateCentsOff(this.getPitch(this._dataArray));
    if (offset > -50) this._tunerBlocks[0].fill("#E63946ff");
    if (offset > -40) this._tunerBlocks[1].fill("#F77F00ff");
    if (offset > -30) this._tunerBlocks[2].fill("#FCBF49ff");
    if (offset > -20) this._tunerBlocks[3].fill("#FDD835ff");
    if (offset > -10) this._tunerBlocks[4].fill("#F9E79Fff");
    if (offset > -3) this._tunerBlocks[5].fill("#06d64fff");
    if (offset > 3) this._tunerBlocks[6].fill("#F9E79Fff");
    if (offset > 10) this._tunerBlocks[7].fill("#FDD835ff");
    if (offset > 20) this._tunerBlocks[8].fill("#FCBF49ff");
    if (offset > 30) this._tunerBlocks[9].fill("#F77F00ff");
    if (offset > 40) this._tunerBlocks[10].fill("#E63946ff");
  }
}

export default PlayConfig;
