import Utils from "../Utils.js";

// Guitar class consists of:
// - Guitar display
// - Current note
// - Change current note
// - Methods related to selection
// - Animation for incorrect choice
// - Animation/dealing with correct choice

class Guitar {
  constructor(dispX, dispY) {
    // constants and variable definition
    const fretboardX = 0;
    const fretboardY = 0;
    const fretboardWidth = 600;
    const fretboardHeight = 240;
    const numFrets = 12;
    const numStrings = 6;
    const cornerRadius = 10;
    const stringSpacing = fretboardHeight / (numStrings - 1);
    let strings = [];
    let fretPositions = [];
    this._fretNumbers = [];
    this._numbersHidden = true;
    // display groups
    this._fretboardDisplay = new Konva.Group({
      x: dispX,
      y: dispY,
    });
    this.fretboardBackground = new Konva.Rect({
      x: 0,
      y: 0,
      width: fretboardWidth,
      height: fretboardHeight,
      fill: "#dddddd50",
      stroke: "#ddd",
      strokeWidth: 4,
      cornerRadius: cornerRadius,
    });
    this._fretboardDisplay.add(this.fretboardBackground);
    // create and add strings
    for (let i = 0; i <= 5; i++) {
      let stringY = fretboardY + fretboardHeight - i * stringSpacing;
      let stringStart = fretboardX;
      let stringEnd = fretboardX + fretboardWidth;
      if (i == 0 || i == 5) {
        stringStart += cornerRadius;
        stringEnd -= cornerRadius;
      }
      let tempString = new Konva.Line({
        points: [stringStart, stringY, stringEnd, stringY],
        stroke: "#ddd",
        strokeWidth: 4 - i * 0.5,
      });
      strings.push(tempString);
      this._fretboardDisplay.add(strings[i]);
    }
    // create and add frets
    for (let i = 0; i <= numFrets; i++) {
      const position = 2 * fretboardWidth * (1 - Math.pow(2, -i / 12));
      fretPositions.push(position);
      let fretStart = fretboardY;
      let fretEnd = fretboardY + fretboardHeight;
      if (i == 0 || i == 12) {
        fretStart += 10;
        fretEnd -= 10;
      }
      const fret = new Konva.Line({
        points: [
          fretboardX + position,
          fretStart,
          fretboardX + position,
          fretEnd,
        ],
        stroke: "#ddd",
        strokeWidth: 3,
      });
      this._fretboardDisplay.add(fret);
    }
    // create and add fret markers and numbers
    let markerNums = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
    let markerRadius = 7;
    for (let i = 0; i <= numFrets; i++) {
      if (markerNums.includes(i + 1)) {
        let markerX =
          fretboardX + (fretPositions[i] + fretPositions[i + 1]) / 2;
        if ((i + 1) % 12 == 0) {
          let m1 = new Konva.Circle({
            x: markerX,
            y: fretboardY + stringSpacing * 1.5,
            radius: markerRadius,
            fill: "#ddddddb0",
          });
          let m2 = new Konva.Circle({
            x: markerX,
            y: fretboardY + stringSpacing * 3.5,
            radius: markerRadius,
            fill: "#ddddddb0",
          });
          this._fretboardDisplay.add(m1);
          this._fretboardDisplay.add(m2);
        } else {
          let m1 = new Konva.Circle({
            x: markerX,
            y: fretboardY + stringSpacing * 2.5,
            radius: markerRadius,
            fill: "#ddddddb0",
          });
          this._fretboardDisplay.add(m1);
        }
        let text = new Konva.Text({
          x: markerX,
          y: fretboardY + fretboardHeight + 10,
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
  }

  // code here
}

export default Guitar;
