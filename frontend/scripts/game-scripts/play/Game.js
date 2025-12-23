import Utils from "../Utils.js";
import Guitar from "./Guitar.js";

// global variables
let noteText = null;
let scoreText = null;
let lastPlayedNoteText = null;
let stringText = null;
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
    this._totalRounds = 0;

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
      text: "-",
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
      playConfig.stopMeydaAnalyzer();
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

    document.addEventListener("keydown", (event) => {
      const pressedKey = event.key;

      if (pressedKey === " ") {
        console.log("Space was pressed!");
        console.log(localStorage.getItem("e2"));
      }
      if (pressedKey === "Enter") {
        console.log("Enter key was pressed!");
        console.log(playConfig.divideLocalAverage("e2"));
      }
      if (pressedKey === "Backspace") {
        console.log("Delete key was pressed!");
        localStorage.clear();
      }
      if (pressedKey === "q") {
        console.log("Removing last feature!");
        playConfig.subMostRecentFeature();
        console.log(localStorage.getItem("e2_count"));
      }
    });

    playConfig.setReactToNoteCB((note) => this.selectionLogic(note));

    setTimeout(() => this.pluckCurrentNote(), 300);

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

  // returns the current target note's fret
  guitarFret() {
    return this._guitar.currentNoteFret();
  }

  // increment score by one
  incrementScore() {
    this._score += 1;
  }

  // increment only total rounds
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
    stringText.text(Utils.stringIndexToLetter(string));
  }

  // updates the score of the current session
  updateScore() {
    scoreText.text(this._score + " / " + this._totalRounds);
  }

  // play a plucked guitar string sound with the pitch of the current note
  pluckCurrentNote() {
    Utils.pluck(this.guitar.currentNotePitch(), pluck);
  }

  // sets the current note to a new random note
  newRandomNote() {
    this._guitar.newRandomNote();
  }

  selectionLogic(selectedNote) {
    console.log("hi");
    console.log(this.guitarString());
    console.log(this.guitarFret());
    const correctness =
      selectedNote.string == this.guitarString() &&
      selectedNote.fret == this.guitarFret();
    console.log(correctness);
    this.guitar.animateNoteSelection(
      selectedNote.string,
      selectedNote.fret,
      correctness
    );
    if (correctness) {
      this.incrementRound();
      if (this._firstTry) this.incrementScore();
      this.newRandomNote();
      this.updateTarget();
      this.updateScore();
      this._firstTry = true;

      // add to heatmap
      setTimeout(() => this.pluckCurrentNote(), 300);
    } else {
      if (this._firstTry) this._firstTry = false;

      // add to heatmap
    }
    lastPlayedNoteText.text(selectedNote.note);
    this._dispLayer.draw();
    console.log("================");
    console.log(this._score);
    console.log(this._totalRounds);
    console.log(this._firstTry);
  }
}

export default Game;
