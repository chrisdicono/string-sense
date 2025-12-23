// imports
import Selectable from "./Selectable.js";

class SelectableGroup {
  constructor(selList) {
    let seenSels = [];
    selList.forEach((s) => {
      if (!(s instanceof Selectable)) {
        console.error("Input needs to be a Selectable.");
      }
      if (
        seenSels.some((s1) => {
          s1.text == s.text;
        })
      ) {
        console.error("Group cannot contain duplicate texts.");
      }
      seenSels.push(s);
    });
    this._selectables = selList;
  }

  // returns the list of all selectables within this SelectableGroup
  get selectables() {
    return this._selectables;
  }

  // adds the given selectable to this SelectableGroup
  add(sel) {
    if (
      this.selectables.some((s1) => {
        s1.text == sel.text;
      })
    ) {
      console.error("Group cannot contain duplicate texts.");
    }
    this.selectables.push(sel);
  }

  // adds the list of selectables to this SelectableGroup
  addList(selList) {
    selList.forEach((s) => {
      this.add(s);
    });
  }

  // TODO: returns a list of all selected components
  allSelected() {
    // code here
  }
}

export default SelectableGroup;
