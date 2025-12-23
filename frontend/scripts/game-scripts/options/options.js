// imports
import Utils from "../Utils.js";
import Selectable from "./Selectable.js";
import Checkbox from "./Checkbox.js";
import CheckboxGroup from "./CheckboxGroup.js";
import Guitar from "../play/Guitar.js";

// global variables
let initialized = false;

function handleOptions(primaryLayer, stage, newState) {
  if (!initialized) {
    const preferredNotes = JSON.parse(localStorage.getItem("preferredNotes"));
    const ps = JSON.parse(localStorage.getItem("preferredStrings"));
    const preferredStrings = ps.map((str) =>
      Utils.stringIndexToLetter(str - 1)
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

    primaryLayer.add(backButton);
    primaryLayer.draw();

    const guitar = new Guitar(275, 25);
    primaryLayer.add(guitar.fretboardDisplay);
    guitar.displayValidNotes();

    const noteText = new Konva.Text({
      x: 50,
      y: 20,
      text: "Select Notes:",
      fontSize: 25,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
    });
    primaryLayer.add(noteText);
    const noteGroup = new CheckboxGroup(50, 245, 150, 245, [], primaryLayer);
    const note1 = new Checkbox(50, 55, "A", primaryLayer);
    const note2 = new Checkbox(115, 55, "A#", primaryLayer);
    const note3 = new Checkbox(180, 55, "B", primaryLayer);
    const note4 = new Checkbox(50, 105, "C", primaryLayer);
    const note5 = new Checkbox(115, 105, "C#", primaryLayer);
    const note6 = new Checkbox(180, 105, "D", primaryLayer);
    const note7 = new Checkbox(50, 155, "D#", primaryLayer);
    const note8 = new Checkbox(115, 155, "E", primaryLayer);
    const note9 = new Checkbox(180, 155, "F", primaryLayer);
    const note10 = new Checkbox(50, 205, "F#", primaryLayer);
    const note11 = new Checkbox(115, 205, "G", primaryLayer);
    const note12 = new Checkbox(180, 205, "G#", primaryLayer);
    const notes = [
      note1,
      note2,
      note3,
      note4,
      note5,
      note6,
      note7,
      note8,
      note9,
      note10,
      note11,
      note12,
    ];
    notes.forEach((note) => {
      if (preferredNotes.includes(note.text)) note.select();
    });
    noteGroup.addList(notes);

    const stringText = new Konva.Text({
      x: 50,
      y: 315,
      text: "Select Strings:",
      fontSize: 25,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
    });
    primaryLayer.add(stringText);
    const stringGroup = new CheckboxGroup(50, 435, 150, 435, [], primaryLayer);
    const string1 = new Checkbox(50, 350, "E", primaryLayer);
    const string2 = new Checkbox(115, 350, "A", primaryLayer);
    const string3 = new Checkbox(180, 350, "D", primaryLayer);
    const string4 = new Checkbox(50, 400, "G", primaryLayer);
    const string5 = new Checkbox(115, 400, "B", primaryLayer);
    const string6 = new Checkbox(180, 400, "e", primaryLayer);
    const strings = [string1, string2, string3, string4, string5, string6];
    strings.forEach((str) => {
      if (preferredStrings.includes(str.text)) str.select();
    });
    stringGroup.addList(strings);

    const saveGroup = new Konva.Group({
      x: 710,
      y: 440,
    });
    const saveBg = new Konva.Rect({
      x: 0,
      y: 0,
      width: 175,
      height: 50,
      fill: "#dddddd5a",
      cornerRadius: 15,
      opacity: 1,
    });
    const saveText = new Konva.Text({
      x: saveBg.width() / 2,
      y: saveBg.height() / 2,
      text: "Save Settings",
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
    });
    saveText.offsetX(saveText.width() / 2);
    saveText.offsetY(saveText.height() / 2);
    saveGroup.add(saveBg);
    saveGroup.add(saveText);
    saveGroup.on("mouseover", () => {
      saveBg.fill("#dddddd8a");
    });
    saveGroup.on("mouseout", () => {
      saveBg.fill("#dddddd5a");
    });
    saveGroup.on("click", () => {
      let prefNotesSel = noteGroup.allSelected().map((s) => {
        return s.text;
      });
      let prefStrsSel = stringGroup.allSelected().map((s) => {
        return Utils.stringLetterToIndex(s.text) + 1;
      });
      if (prefNotesSel.length === 0) prefNotesSel = Utils.defaultNotes();
      if (prefStrsSel.length === 0) prefStrsSel = Utils.defaultStringNumbers();
      localStorage.setItem("preferredNotes", JSON.stringify(prefNotesSel));
      localStorage.setItem("preferredStrings", JSON.stringify(prefStrsSel));

      guitar.displayValidNotes();
    });

    primaryLayer.add(saveGroup);

    initialized = true;
  }

  // other code here
}

export default handleOptions;
