// imports
import Utils from "../Utils.js";
import Selectable from "./Selectable.js";
import Checkbox from "./Checkbox.js";
import CheckboxGroup from "./CheckboxGroup.js";

// global variables
let initialized = false;
const preferredNotes = JSON.parse(localStorage.getItem("preferredNotes"));
const ps = JSON.parse(localStorage.getItem("preferredStrings"));
const preferredStrings = ps.map((str) => Utils.stringIndexToLetter(str - 1));

function handleOptions(primaryLayer, stage, newState) {
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
      newState("menu");
    });

    primaryLayer.add(backButton);
    primaryLayer.draw();

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

    // TODO: implement "Save Settings" Button

    initialized = true;
  }

  // other code here
}

export default handleOptions;
