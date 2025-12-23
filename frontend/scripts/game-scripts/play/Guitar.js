import Utils from "../Utils.js";
import locationToNote from "../locationToNote.js";

class Guitar {
  constructor(dispX, dispY) {
    // constants and variable definition
    this._fretboardX = 0;
    this._fretboardY = 0;
    this._fretboardWidth = 600;
    this._fretboardHeight = 240;
    this._numFrets = 12;
    this._numStrings = 6;
    const cornerRadius = 10;
    const stringSpacing = this._fretboardHeight / (this._numStrings - 1);
    this._currentNote = null;
    this.initValidNotes();
    this._worstNotes = new Map();
    this._bestNotes = new Map();
    this._strings = [];
    this._fretPositions = [];
    this._fretNumbers = [];
    this._numbersHidden = true;
    this._notes = [];
    // display groups
    this._fretboardDisplay = new Konva.Group({
      x: dispX,
      y: dispY,
    });
    this.fretboardBackground = new Konva.Rect({
      x: 0,
      y: 0,
      width: this._fretboardWidth,
      height: this._fretboardHeight,
      fill: "#dddddd50",
      stroke: "#ddd",
      strokeWidth: 4,
      cornerRadius: cornerRadius,
    });
    this._fretboardDisplay.add(this.fretboardBackground);
    // create and add frets
    for (let i = 0; i <= this._numFrets; i++) {
      const position = 2 * this._fretboardWidth * (1 - Math.pow(2, -i / 12));
      this._fretPositions.push(position);
      let fretStart = this._fretboardY;
      let fretEnd = this._fretboardY + this._fretboardHeight;
      if (i == 0 || i == 12) {
        fretStart += 10;
        fretEnd -= 10;
      }
      const fret = new Konva.Line({
        points: [
          this._fretboardX + position,
          fretStart,
          this._fretboardX + position,
          fretEnd,
        ],
        stroke: "#ddd",
        strokeWidth: 3,
      });
      this._fretboardDisplay.add(fret);
    }
    // create and add strings
    for (let i = 0; i <= 5; i++) {
      let stringY =
        this._fretboardY + this._fretboardHeight - i * stringSpacing;
      let stringStart = this._fretboardX;
      let stringEnd = this._fretboardX + this._fretboardWidth;
      if (i == 0 || i == 5) {
        stringStart += cornerRadius;
        stringEnd -= cornerRadius;
      }
      let tempString = new Konva.Line({
        points: [stringStart, stringY, stringEnd, stringY],
        stroke: "#ddd",
        strokeWidth: 4 - i * 0.5,
      });
      this._strings.push(tempString);
      this._fretboardDisplay.add(this._strings[i]);
    }
    // create and add fret markers and numbers
    let markerNums = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
    let markerRadius = 7;
    for (let i = 0; i <= this._numFrets; i++) {
      if (markerNums.includes(i + 1)) {
        let markerX =
          this._fretboardX +
          (this._fretPositions[i] + this._fretPositions[i + 1]) / 2;
        if ((i + 1) % 12 == 0) {
          let m1 = new Konva.Circle({
            x: markerX,
            y: this._fretboardY + stringSpacing * 1.5,
            radius: markerRadius,
            fill: "#ddddddb0",
          });
          let m2 = new Konva.Circle({
            x: markerX,
            y: this._fretboardY + stringSpacing * 3.5,
            radius: markerRadius,
            fill: "#ddddddb0",
          });
          this._fretboardDisplay.add(m1);
          this._fretboardDisplay.add(m2);
        } else {
          let m1 = new Konva.Circle({
            x: markerX,
            y: this._fretboardY + stringSpacing * 2.5,
            radius: markerRadius,
            fill: "#ddddddb0",
          });
          this._fretboardDisplay.add(m1);
        }
        let text = new Konva.Text({
          x: markerX,
          y: this._fretboardY + this._fretboardHeight + 10,
          text: i + 1,
          fontSize: 15,
          fontFamily: "Space Mono",
          fill: "#ddddddb0",
          offsetX: 0,
        });
        text.offsetX(text.width() / 2);
        this._fretNumbers.push(text);
        this._fretboardDisplay.add(text);
      }
    }
    // fret numbers should be zero opacity by default
    for (const t of this._fretNumbers) {
      t.opacity(0);
    }
    // add notes, opacity 0 by default
    let noteRadius = 8;
    for (let i = 0; i < 6; i++) {
      let noteY = this._fretboardY + this._fretboardHeight - i * stringSpacing;
      let tempArray = [];
      for (let j = 0; j < this._numFrets; j++) {
        let noteX =
          this._fretboardX +
          (this._fretPositions[j] + this._fretPositions[j + 1]) / 2;
        let tempNote = new Konva.Circle({
          x: noteX,
          y: noteY,
          radius: noteRadius + Math.abs(12 - j) * 0.2,
          fill: "#707070ff",
          opacity: 0,
        });
        tempArray.push(tempNote);
        this._fretboardDisplay.add(tempNote);
      }
      this._notes.push(tempArray);
    }
    this.newRandomNote();
  }

  // getters
  get fretboardDisplay() {
    return this._fretboardDisplay;
  }

  get currentNote() {
    return this._currentNote;
  }

  get validNotes() {
    return this._validNotes;
  }

  get numbersHidden() {
    return this._numbersHidden;
  }

  get notes() {
    return this._notes;
  }

  get fretboardWidth() {
    return this._fretboardWidth;
  }

  get fretboardHeight() {
    return this._fretboardHeight;
  }

  get numFrets() {
    return this.numFrets;
  }

  get numStrings() {
    return this.numStrings;
  }

  // returns the current note's pitch
  currentNotePitch() {
    return this._currentNote.pitch;
  }

  // returns the current note's string
  currentNoteString() {
    return this._currentNote.string;
  }

  // returns the current note's fret
  currentNoteFret() {
    return this._currentNote.fret;
  }

  // returns the current note's pitch and string
  currentNotePitchAndString() {
    return [this.currentNotePitch(), this.currentNoteString()];
  }

  // TODO: add getters for best and worst heatmap

  // setters
  set currentNote(newNote) {
    if (!newNote instanceof Note) {
      console.error("The new note must be an instance of the Note class.");
      return;
    }
    this._currentNote = newNote;
  }

  // change current note randomly
  newRandomNote() {
    let tempNote =
      this.validNotes[Math.floor(Math.random() * this.validNotes.length)];
    this._currentNote = tempNote;
  }

  // determines the location of a note based on its string and fret
  noteXY(note) {
    let string = note.string;
    let fret = note.fret;
    let noteX =
      this._fretboardX +
      (this._fretPositions[fret] + this._fretPositions[fret + 1]) / 2;
    let noteY = this._fretboardY + string * stringSpacing;
    return [noteX, noteY];
  }

  // selects a given note indefinitely
  selectNote(string, fret) {
    if (fret > 0) {
      let note = this.notes[string][fret - 1];
      note.opacity(1);
    } else {
      let tempString = this._strings[string];
      tempString.stroke("#707070ff");
    }
  }

  // deselects a given note indefinitely
  deselectNote(string, fret) {
    if (fret > 0) {
      let note = this.notes[string][fret - 1];
      note.opacity(0);
    } else {
      let tempString = this._strings[string];
      tempString.stroke("#ddd");
    }
  }

  // displays all valid notes indefinitely
  displayValidNotes() {
    this.validNotes.forEach((n) => {
      this.deselectNote(n.string, n.fret);
    });
    this.initValidNotes();
    this.validNotes.forEach((n) => {
      this.selectNote(n.string, n.fret);
    });
  }

  // initializes the array of valid notes
  initValidNotes() {
    this._validNotes = [];
    this._preferredNotes = JSON.parse(localStorage.getItem("preferredNotes"));
    this._preferredStrings = JSON.parse(
      localStorage.getItem("preferredStrings")
    );
    for (let s = 0; s < this._preferredStrings.length; s++) {
      for (let f = 0; f <= this._numFrets; f++) {
        let tempNote = new Note(f, this._preferredStrings[s] - 1);
        //console.log(preferredStrings[s] - 1);
        if (
          this._preferredNotes.includes(
            tempNote.pitch.substring(0, tempNote.pitch.length - 1)
          )
        ) {
          this._validNotes.push(tempNote);
        }
      }
    }
  }

  // animates and briefly displays a note that is either correct or incorrect
  animateNoteSelection(string, fret, isCorrect) {
    if (fret > 0) {
      let note = this.notes[string][fret - 1];
      isCorrect ? note.fill("#2f9e4cff") : note.fill("#b23636ff");
      const fadeIn = new Konva.Tween({
        node: note,
        duration: 0.3,
        opacity: 1,
        easing: Konva.Easings.EaseOut,
        onFinish: () => {
          const fadeOut = new Konva.Tween({
            node: note,
            duration: 0.3,
            opacity: 0,
            easing: Konva.Easings.EaseOut,
          });
          setTimeout(() => fadeOut.play(), 1500);
        },
      });
      const popIn1 = new Konva.Tween({
        node: note,
        duration: 0.1,
        scaleX: 1.2,
        scaleY: 1.2,
        easing: Konva.Easings.EaseOut,
        onFinish: () => {
          const popIn2 = new Konva.Tween({
            node: note,
            duration: 0.5,
            scaleX: 1,
            scaleY: 1,
            easing: Konva.Easings.EaseOut,
          });
          popIn2.play();
        },
      });
      fadeIn.play();
      popIn1.play();
    } else if (fret == 0) {
      let tempString = this._strings[string];
      const color = isCorrect ? "#2f9e4cff" : "#b23636ff";
      tempString.stroke(color);
      const fadeIn = new Konva.Tween({
        node: tempString,
        duration: 0.3,
        stroke: color,
        easing: Konva.Easings.EaseOut,
        onFinish: () => {
          const fadeOut = new Konva.Tween({
            node: tempString,
            duration: 0.3,
            stroke: "#ddd",
            easing: Konva.Easings.EaseOut,
          });
          setTimeout(() => fadeOut.play(), 1500);
        },
      });
      fadeIn.play();
    }
  }

  // adds a note to the given heatmap, and appends the count if it already exists
  addNoteToHeatmap(note, map) {
    const key = `${note.fret}:${note.string}`;
    map.set(key, (map.get(key) || 0) + 1);
  }

  // adds a note to the worstNotes map
  addWorstNote(note) {
    this.addNoteToHeatmap(note, this._worstNotes);
  }

  // adds a note to the bestNotes map
  addBestNote(note) {
    this.addNoteToHeatmap(note, this._bestNotes);
  }
}

class Note {
  constructor(fret, string) {
    this._fret = fret;
    this._string = string;
    // console.log(this._fret);
    // console.log(this._string);
    this._pitch = locationToNote[string].get(fret);
  }

  // getters
  get fret() {
    return this._fret;
  }

  get string() {
    return this._string;
  }

  get pitch() {
    return this._pitch;
  }

  // others
  // toTuple() {
  //   return [this._string, this._fret];
  // }
}

export default Guitar;
