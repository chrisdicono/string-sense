// imports
import Selectable from "./Selectable.js";

class Radio extends Selectable {
  constructor(x, y, text, layer) {
    super(x, y, true, text, layer);
  }

  // toggleSelection does everything but also
  // returns name and state of super.selected
  // code here
}

export default Radio;
