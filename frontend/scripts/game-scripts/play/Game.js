import Utils from "../Utils.js";
import Guitar from "./Guitar.js";

// global variables
let noteText = null;
let scoreText = null;
let lastPlayedNoteText = null;
let stringText = null;
// TODO: remove these testing variables
let scText = null;
let testQual2 = null;
let testQual3 = null;
let testQual4 = null;
let testQual5 = null;
let pluck = Utils.initiializePluck();

class Game {
  constructor(layer, playConfig) {
    this._config = playConfig;
    this._dispLayer = layer;
    this._display = new Konva.Group({
      x: 0,
      y: 0,
    });
    this._guitar = new Guitar(150, 100);
    this._display.add(this._guitar.fretboardDisplay);

    this._score = 0;
    this._firstTry = true;
    this._totalRounds = 1;
    this._mostRecentNote = "-";

    const scoreLabel = new Konva.Text({
      x: 202,
      y: 27,
      text: "score:",
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    scoreLabel.offsetX(scoreLabel.width() / 2);
    this.display.add(scoreLabel);
    scoreText = new Konva.Text({
      x: 200,
      y: 50,
      text: this._score + " / " + this._totalRounds,
      fontSize: 40,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
    });
    scoreText.offsetX(scoreText.width() / 2);
    this.display.add(scoreText);

    const lastPlayedText = new Konva.Text({
      x: 415,
      y: 50,
      text: "You played:",
      fontSize: 30,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    lastPlayedText.offsetX(lastPlayedText.width() / 2);
    lastPlayedNoteText = new Konva.Text({
      x: 555,
      y: 45,
      text: this._mostRecentNote,
      fontSize: 40,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
    });
    lastPlayedNoteText.offsetX(lastPlayedNoteText.width() / 2);
    this.display.add(lastPlayedText);
    this.display.add(lastPlayedNoteText);

    const waveDisplay = new Konva.Group({
      x: 450,
      y: 375,
    });
    const waveBg = new Konva.Rect({
      width: playConfig.BOX_WIDTH,
      height: playConfig.BOX_HEIGHT,
      fill: "#dddddd21",
      cornerRadius: 20,
    });
    waveBg.offsetX(waveBg.width() / 2);
    waveDisplay.add(waveBg);
    waveDisplay.add(this._config.waveform);
    this._display.add(waveDisplay);

    noteText = new Konva.Text({
      x: 145,
      y: 375,
      text: "-",
      fontSize: 55,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
    });
    noteText.offsetX(noteText.width() / 2);
    stringText = new Konva.Text({
      x: 270,
      y: 375,
      text: "-",
      fontSize: 55,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
    });
    stringText.offsetX(stringText.width() / 2);
    const separatingLine = new Konva.Line({
      points: [225, 375, 225, 443],
      stroke: "#ddd",
      strokeWidth: 5,
      lineCap: "round",
    });
    const noteDescText = new Konva.Text({
      x: 145,
      y: 430,
      text: "note",
      fontSize: 15,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    noteDescText.offsetX(noteDescText.width() / 2);
    const stringDescText = new Konva.Text({
      x: 270,
      y: 430,
      text: "string",
      fontSize: 15,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    stringDescText.offsetX(stringDescText.width() / 2);
    const targetText = new Konva.Text({
      x: 225,
      y: 352,
      text: " target:",
      fontSize: 15,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    targetText.offsetX(targetText.width() / 2);

    const playNoteButton = new Konva.Group({
      x: 675,
      y: 365,
    });
    const playNoteText = new Konva.Text({
      x: 0,
      y: 0,
      text: "Play Note",
      fontSize: 25,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
    });
    playNoteText.offsetX(playNoteText.width() / 2);
    const optRect1 = new Konva.Rect({
      x: 0,
      y: 13,
      width: 145,
      height: 55,
      fill: "#dddddd5a",
      cornerRadius: 20,
    });
    optRect1.offsetX(optRect1.width() / 2);
    optRect1.offsetY(optRect1.height() / 2);
    playNoteButton.add(optRect1);
    playNoteButton.add(playNoteText);

    const menuButton = new Konva.Group({
      x: 675,
      y: 425,
    });
    const menuText = new Konva.Text({
      x: 0,
      y: 0,
      text: "Back",
      fontSize: 25,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
    });
    menuText.offsetX(menuText.width() / 2);
    const optRect2 = new Konva.Rect({
      x: 0,
      y: 13,
      width: 145,
      height: 55,
      fill: "#dddddd5a",
      cornerRadius: 20,
    });
    optRect2.offsetX(optRect2.width() / 2);
    optRect2.offsetY(optRect2.height() / 2);
    menuButton.add(optRect2);
    menuButton.add(menuText);

    playNoteButton.on("mouseover", () => {
      new Konva.Tween({
        node: playNoteText,
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

    playNoteButton.on("mouseout", () => {
      new Konva.Tween({
        node: playNoteText,
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

    menuButton.on("mouseover", () => {
      new Konva.Tween({
        node: menuText,
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

    menuButton.on("mouseout", () => {
      new Konva.Tween({
        node: menuText,
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

    menuButton.on("click", () => {
      layer.removeChildren();
      playConfig.initialized = false;
      playConfig.playState = "modes";
    });

    playNoteButton.on("click", () => {
      this.pluckCurrentNote();
    });

    this._display.add(noteDescText);
    this._display.add(stringDescText);
    this._display.add(targetText);
    this._display.add(separatingLine);
    this._display.add(noteText);
    this._display.add(stringText);
    this._display.add(playNoteButton);
    this._display.add(menuButton);

    this._guitar.newRandomNote();
    this.updateTarget();

    // ==================
    //   testing stuff
    // ==================
    scText = new Konva.Text({
      x: 600,
      y: 0,
      text: "SC: ---",
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    const q2Text = new Konva.Text({
      x: 600,
      y: 20,
      text: "Qual 2: " + testQual2,
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    const q3Text = new Konva.Text({
      x: 600,
      y: 40,
      text: "Qual 3: " + testQual3,
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    const q4Text = new Konva.Text({
      x: 600,
      y: 60,
      text: "Qual 4: " + testQual4,
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    const q5Text = new Konva.Text({
      x: 600,
      y: 80,
      text: "Qual 5: " + testQual5,
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    this._display.add(scText);
    this._display.add(q2Text);
    this._display.add(q3Text);
    this._display.add(q4Text);
    this._display.add(q5Text);

    playConfig.startMeydaAnalyzer();
  }

  // getters
  get guitar() {
    return this._guitar;
  }

  get display() {
    return this._display;
  }

  get score() {
    return this._score;
  }

  get totalRounds() {
    return this._totalRounds;
  }

  // returns the current target note's pitch and string
  guitarPitchAndString() {
    return this._guitar.currentNotePitchAndString();
  }

  // returns the current target note's pitch
  guitarPitch() {
    return this._guitar.currentNotePitch();
  }

  // returns the current target note's string
  guitarString() {
    return this._guitar.currentNoteString();
  }

  // increment score and total rounds by one (in case of correct choice)
  incrementScoreAndRound() {
    this._score += 1;
    this.totalRounds += 1;
  }

  // increment only total rounds (in case of incorrect choice)
  incrementRound() {
    this._totalRounds += 1;
  }

  // updates the waveform to display mic audio
  updateWaveform() {
    this._config.drawWaveform(this._dispLayer);
  }

  // updates the displayed target note and string
  updateTarget() {
    let [pitch, string] = this.guitarPitchAndString();
    noteText.text(pitch);
    noteText.offsetX(noteText.width() / 2);
    stringText.text(string + 1);
  }

  // play a plucked guitar string sound with the pitch of the current note
  pluckCurrentNote() {
    Utils.pluck(this.guitar.currentNotePitch(), pluck);
  }

  updateTests() {
    //scText.text("SC: " + ...);
  }
}

export default Game;
