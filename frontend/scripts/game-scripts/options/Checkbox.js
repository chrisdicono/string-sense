// imports
import Selectable from "./Selectable.js";

class Checkbox extends Selectable {
  constructor(x, y, text, layer) {
    super(x, y, false, text, layer);
  }

  // selects the checkbox
  select() {
    if (!this.selected) {
      new Konva.Tween({
        node: this.innerBox,
        duration: 0.2,
        opacity: 1,
        easing: Konva.Easings.EaseInOut,
      }).play();
      this.selected = true;
    }
  }

  // unselects the checkbox
  unselect() {
    if (this.selected) {
      new Konva.Tween({
        node: this.innerBox,
        duration: 0.2,
        opacity: 0,
        easing: Konva.Easings.EaseInOut,
      }).play();
      this.selected = false;
    }
  }
}

export default Checkbox;
