// imports
import Checkbox from "./Checkbox.js";
import SelectableGroup from "./SelectableGroup.js";

class CheckboxGroup extends SelectableGroup {
  constructor(allX, allY, clearX, clearY, checkList, layer) {
    super(checkList);
    checkList.forEach((s) => {
      if (!(s instanceof Checkbox)) {
        console.error("Input needs to be a Checkbox.");
      }
    });

    this.allGroup = new Konva.Group({
      x: allX,
      y: allY,
    });
    this.allBg = new Konva.Rect({
      x: 0,
      y: 0,
      width: 75,
      height: 50,
      fill: "#dddddd5a",
      cornerRadius: 15,
      opacity: 1,
    });
    this.allText = new Konva.Text({
      x: this.allBg.width() / 2,
      y: this.allBg.height() / 2,
      text: "All",
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
    });
    this.allText.offsetX(this.allText.width() / 2);
    this.allText.offsetY(this.allText.height() / 2);
    this.allGroup.add(this.allBg);
    this.allGroup.add(this.allText);

    this.clearGroup = new Konva.Group({
      x: clearX,
      y: clearY,
    });
    this.clearBg = new Konva.Rect({
      x: 0,
      y: 0,
      width: 75,
      height: 50,
      fill: "#dddddd5a",
      cornerRadius: 15,
      opacity: 1,
    });
    this.clearText = new Konva.Text({
      x: this.clearBg.width() / 2,
      y: this.clearBg.height() / 2,
      text: "Clear",
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
    });
    this.clearText.offsetX(this.clearText.width() / 2);
    this.clearText.offsetY(this.clearText.height() / 2);
    this.clearGroup.add(this.clearBg);
    this.clearGroup.add(this.clearText);

    this.allGroup.on("mouseover", () => {
      this.allBg.fill("#dddddd8a");
    });
    this.allGroup.on("mouseout", () => {
      this.allBg.fill("#dddddd5a");
    });
    this.allGroup.on("click", () => {
      super.selectables.forEach((sel) => {
        sel.select();
      });
    });
    this.clearGroup.on("mouseover", () => {
      this.clearBg.fill("#dddddd8a");
    });
    this.clearGroup.on("mouseout", () => {
      this.clearBg.fill("#dddddd5a");
    });
    this.clearGroup.on("click", () => {
      super.selectables.forEach((sel) => {
        sel.unselect();
      });
    });

    layer.add(this.allGroup);
    layer.add(this.clearGroup);
    layer.draw();
  }
}

export default CheckboxGroup;
