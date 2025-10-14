import Utils from "../Utils.js";
import { PitchDetector } from "https://esm.sh/pitchy@4";

// 1. Create a class
class School {
  // 2. Constructor with 3 parameters
  constructor(name, level, numberOfStudents) {
    // 3. Set properties
    this._name = name;
    this._level = level;
    this._numberOfStudents = numberOfStudents;
  }

  // 4. Getters
  get name() {
    return this._name;
  }

  get level() {
    return this._level;
  }

  get numberOfStudents() {
    return this._numberOfStudents;
  }

  // 5. Setter
  set numberOfStudents(newNumberOfStudents) {
    if (typeof newNumberOfStudents === "number") {
      this._numberOfStudents = newNumberOfStudents;
    } else {
      console.log("Invalid input: numberOfStudents must be set to a Number.");
    }
  }

  // 6. quickFacts()
  quickFacts() {
    console.log(
      `${this.name} educates ${this.numberOfStudents} students at the ${this.level} school level.`
    );
  }

  // 7. pickSubstituteTeacher()
  static pickSubstituteTeacher(substituteTeachers) {
    const randIndex = Math.floor(Math.random() * substituteTeachers.length);
    return substituteTeachers[randIndex];
  }
}

class PlayConfig {
  constructor() {
    // global variables
    this._initialized = false;
    this._playState = "modes";
    this._testing = false;
    this._waveform = null;
    this._noteText = null;
    this._detector = null;
    this._tunerBlocks = [];
    this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    this._analyser = this._ctx.createAnalyser();
    this._SAMPLE_RATE = 2048;
    this._BOX_WIDTH = 250;
    this._BOX_HEIGHT = 75;
    this._WAVE_START = 0;
    this._WAVE_END = this._BOX_WIDTH - this._BOX_WIDTH / 10;

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

  // getters or setters can go here as needed

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

  drawWaveform(layer, stage) {
    this._analyser.getFloatTimeDomainData(this._dataArray);
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
    updatePitch(this._detector, this._dataArray);
  }

  getPitch(input) {
    const [pitch, clarity] = this._detector.findPitch(
      input,
      this._ctx.sampleRate
    );
    return pitch;
  }

  getNote(detector, input) {
    let pitch = this.getPitch(detector, input);
    let detectedNote = Utils.roundNearestNote(pitch);
    if (detectedNote === "C0") {
      detectedNote = "-";
    }
    return detectedNote;
  }

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
}

export default PlayConfig;
