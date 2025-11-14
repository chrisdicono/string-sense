import Utils from "../Utils.js";
import { PitchDetector } from "https://esm.sh/pitchy@4";
import Meyda from "https://cdn.skypack.dev/meyda";
import noteFretFeatures from "../noteFretFeatures.js";

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
        this._monitorStream = stream.clone();
        this._monitorCtx = new (window.AudioContext ||
          window.webkitAudioContext)();
        this._monitorSource = this._monitorCtx.createMediaStreamSource(stream);

        // record current audio info
        this._analyser.fftSize = this._SAMPLE_RATE;
        this._bufferLength = this._analyser.fftSize;
        this._dataArray = new Float32Array(this._bufferLength);
        this._analyser.getFloatTimeDomainData(this._dataArray);
        this._frequencyData = new Float32Array(
          this._analyser.frequencyBinCount
        );

        this._detector = PitchDetector.forFloat32Array(this._analyser.fftSize);
        this._detector.minVolumeDecibels = -20;

        this._meydaAnalyser = Meyda.createMeydaAnalyzer({
          audioContext: this._ctx,
          source: this._source,
          bufferSize: this._SAMPLE_RATE,
          featureExtractors: [
            "rms",
            "spectralCentroid",
            "spectralRolloff",
            "spectralSlope",
          ],
          callback: (features) => {
            this._currentFeatures = features;
            this.processNote(features);
          },
        });
      })
      .catch(console.error);

    this._reactToNote = null;
    this._isNoteActive = false;
    this._prevRMS = 0;
    this._attackTime = null;
    this._attackThreshold = 0.02;
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

  get reactToNote() {
    return this._reactToNote;
  }

  get isNoteActive() {
    return this._isNoteActive;
  }

  get prevRMS() {
    return this._prevRMS;
  }

  get attackTime() {
    return this._attackTime;
  }

  get attackThreshold() {
    return this._attackThreshold;
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

  // TODO: make setters
  // this._reactToNote = null;
  // this._isNoteActive = false;
  // this._prevRMS = 0;
  // this._attackTime = null;
  // this._attackThreshold = 0.02;

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

  // Toggle microphone testing (connect/disconnect monitor source to destination)
  toggleTestMic() {
    try {
      if (!this._monitorCtx || !this._monitorSource) {
        alert("Microphone not initialized yet.");
        return;
      }
      switch (this._testing) {
        case false:
          this._monitorSource.connect(this._monitorCtx.destination);
          this._testing = true;
          alert("testing");
          break;
        case true:
          this._monitorSource.disconnect(this._monitorCtx.destination);
          this._testing = false;
          alert("not testing");
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

  // TODO: finish this? don't know why this is here
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

  // starts the meyda analyzer
  startMeydaAnalyzer() {
    this._meydaAnalyser.start();
  }

  // stops the meyda analyzer
  stopMeydaAnalyzer() {
    this._meydaAnalyser.stop();
  }

  // normalizes meyda features by pitch
  normalizeFeaturesByPitch(features, pitch) {
    if (!pitch || pitch === 0) return null;
    return {
      pitch: pitch,
      rms: features.rms,
      spectralCentroid: features.spectralCentroid / pitch,
      spectralRolloff: features.spectralRolloff / pitch,
      spectralSlope: features.spectralSlope,
    };
  }

  // detects the onset of a note being played
  detectOnset(features) {
    if (this._isNoteActive) {
      return false;
    }

    const rmsDiff = features.rms - this._prevRMS;
    this._prevRMS = features.rms;

    if (rmsDiff > this._attackThreshold && !this._isNoteActive) {
      console.log("note detected!!");
      this._attackTime = Date.now();
      this._isNoteActive = true;
      return true;
    }

    return false;
  }

  // adds the contents of the second given feature to the first
  addToFeature(f, f2) {
    f.pitch += f2.pitch;
    f.rms += f2.rms;
    f.spectralCentroid += f2.spectralCentroid;
    f.spectralRolloff += f2.spectralRolloff;
    f.spectralSlope += f2.spectralSlope;
  }

  // divides all the attributes within a feature by the given number
  divideFeatureBy(f, i) {
    f.pitch /= i;
    f.rms /= i;
    f.spectralCentroid /= i;
    f.spectralRolloff /= i;
    f.spectralSlope /= i;
  }

  // averages an array of features from a meyda analyzer
  averageFeatures(f) {
    let feat = {
      pitch: 0,
      rms: 0,
      spectralCentroid: 0,
      spectralRolloff: 0,
      spectralSlope: 0,
    };
    for (let i = 0; i < f.length; i++) {
      try {
        this.addToFeature(feat, f[i]);
      } catch (error) {
        console.log(error);
        return null;
      }
    }
    this.divideFeatureBy(feat, f.length);
    return feat;
  }

  // adds note features to a local average
  // KEEP!! can be used for profiling a specific guitar
  addToLocalAverage(key, features) {
    let noteAvg = JSON.parse(localStorage.getItem(key));
    if (!noteAvg || noteAvg.pitch === null) {
      noteAvg = {
        pitch: 0,
        rms: 0,
        spectralCentroid: 0,
        spectralRolloff: 0,
        spectralSlope: 0,
      };
    }
    this.addToFeature(noteAvg, features);
    let noteAvgTotal = Number(localStorage.getItem(key + "_total"));
    if (!noteAvgTotal) {
      noteAvgTotal = 0;
    }
    noteAvgTotal++;
    localStorage.setItem(key, JSON.stringify(noteAvg));
    localStorage.setItem(key + "_total", noteAvgTotal);
  }

  // divides all added feature values together to get an average value
  // KEEP!! can be used for profiling a specific guitar
  divideLocalAverage(key) {
    let noteAvg = JSON.parse(localStorage.getItem(key));
    if (!noteAvg || noteAvg === null) return null;
    let noteAvgTotal = Number(localStorage.getItem(key + "_total"));
    this.divideFeatureBy(noteAvg, noteAvgTotal);
    return noteAvg;
  }

  // skips the attack period and collects note data across the sustain period
  async collectNoteData(features) {
    let incFeats = [];
    let incsLeft = 10;

    // skip attack phase (~50 ms)
    const skipAttack = 50;
    if (this._isNoteActive) {
      await new Promise((resolve) => setTimeout(resolve, skipAttack));
      console.log(`Waited ${skipAttack}ms`);

      while (incsLeft > 0) {
        const pitch = this.getPitch(this._dataArray);
        const norm = this.normalizeFeaturesByPitch(
          this._currentFeatures,
          pitch
        );
        incFeats.push(norm);
        await new Promise((resolve) => setTimeout(resolve, 100));
        incsLeft--;
      }
      this._isNoteActive = false;
    }
    // console.log(incFeats);
    const avg = this.averageFeatures(incFeats);
    if (avg === null) {
      console.error("Note processing failed.");
      return null;
    }
    //console.log(JSON.stringify(avg));
    this.addToLocalAverage("e2", avg);
    return avg;
    // return [incFeats, this.averageFeatures(incFeats)];
  }

  featureDistance(a, b) {
    return Math.sqrt(
      Math.pow(a.rms - b.rms, 2) +
        Math.pow(a.spectralCentroid - b.spectralCentroid, 2) // +
      //Math.pow(a.spectralRolloff - b.spectralRolloff, 2) +
      //Math.pow(a.spectralSlope - b.spectralSlope, 2)
    );
  }

  mostSimilarFeatures(features) {
    console.log(features.pitch.toFixed(2));
    const note = Utils.getNoteFromFreq(features.pitch.toFixed(2));
    console.log(note);
    const eqNotes = noteFretFeatures.filter((item) => item.note === note);
    const inpFeats = {
      rms: features.rms,
      spectralCentroid: features.spectralCentroid,
      spectralRolloff: features.spectralRolloff,
      spectralSlope: features.spectralSlope,
    };
    let minDistance = Number.MAX_VALUE;
    let minDistancePoint = null;
    for (let i = 0; i < eqNotes.length; i++) {
      const iterFeats = {
        rms: eqNotes[i].rms,
        spectralCentroid: eqNotes[i].spectralCentroid,
        spectralRolloff: eqNotes[i].spectralRolloff,
        spectralSlope: eqNotes[i].spectralSlope,
      };
      const tempDist = this.featureDistance(inpFeats, iterFeats);
      if (tempDist < minDistance) {
        minDistance = tempDist;
        minDistancePoint = eqNotes[i];
      }
    }
    return minDistancePoint;
  }

  // encapsulates all note processing logic
  processNote(features) {
    if (this.detectOnset(features)) {
      this.collectNoteData(features).then((val) => {
        console.log(val);
        console.log(localStorage.getItem("e2_total"));
        console.log(this.mostSimilarFeatures(val));
        // if (!this._reactToNote) {
        //   this._reactToNote(val);
        // }
      });
    }
  }
}

export default PlayConfig;
