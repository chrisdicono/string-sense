class Selectable {
  constructor(x, y, isRadio, text, layer) {
    this._x = x;
    this._y = y;
    this._text = text;
    this._selected = false;
    this._hidden = false;
    const cornerRadius = isRadio ? 10 : 5;

    this.boxGroup = new Konva.Group({
      x: this.x,
      y: this.y,
    });
    this.outerBox = new Konva.Rect({
      x: 0,
      y: 0,
      width: 20,
      height: 20,
      fill: "#dddddd5a",
      cornerRadius: cornerRadius,
      opacity: 1,
    });
    this.innerBox = new Konva.Rect({
      x: 3,
      y: 3,
      width: 14,
      height: 14,
      fill: "#3185d4cc", // #85b1dacc
      cornerRadius: cornerRadius,
      opacity: 0,
    });
    this.boxText = new Konva.Text({
      x: this.outerBox.width() * 1.5,
      y: this.outerBox.height() / 10,
      text: text,
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
      opacity: 1,
    });

    this.boxGroup.add(this.outerBox);
    this.boxGroup.add(this.innerBox);
    this.boxGroup.add(this.boxText);

    this.boxGroup.on("mouseover", () => {
      this.outerBox.fill("#ddddddd0");
    });
    this.boxGroup.on("mouseout", () => {
      this.outerBox.fill("#dddddd5a");
    });
    this.boxGroup.on("click", () => {
      this.toggleSelection();
    });

    layer.add(this.boxGroup);
    layer.draw();
  }

  // returns the base x-coordinate of this selectable
  get x() {
    return this._x;
  }

  // returns the base y-coordinate of this selectable
  get y() {
    return this._y;
  }

  // returns the text of this selectable
  get text() {
    return this._text;
  }

  // returns whether or not the selectable is selected
  get selected() {
    return this._selected;
  }

  // returns whether or not the selectable is hidden
  get hidden() {
    return this._hidden;
  }

  // sets this._selected to the given boolean value
  set selected(val) {
    this._selected = val;
  }

  // sets this._hidden to the given boolean value
  set hidden(val) {
    this._hidden = val;
  }

  // selects or unselects the selectable
  toggleSelection() {
    if (!this.hidden) {
      if (this.selected) {
        new Konva.Tween({
          node: this.innerBox,
          duration: 0.2,
          opacity: 0,
          easing: Konva.Easings.EaseInOut,
        }).play();
        this.selected = false;
      } else {
        new Konva.Tween({
          node: this.innerBox,
          duration: 0.2,
          opacity: 1,
          easing: Konva.Easings.EaseInOut,
        }).play();
        this.selected = true;
      }
    }
  }

  // reveals or hides the selectable
  toggleDisplay() {
    if (this.hidden) {
      new Konva.Tween({
        node: this.outerBox,
        duration: 0.2,
        opacity: 1,
        easing: Konva.Easings.EaseInOut,
      }).play();
      new Konva.Tween({
        node: this.boxText,
        duration: 0.2,
        opacity: 1,
        easing: Konva.Easings.EaseInOut,
      }).play();
      this.hidden = false;
    } else {
      new Konva.Tween({
        node: this.innerBox,
        duration: 0.2,
        opacity: 0,
        easing: Konva.Easings.EaseInOut,
      }).play();
      new Konva.Tween({
        node: this.outerBox,
        duration: 0.2,
        opacity: 0,
        easing: Konva.Easings.EaseInOut,
      }).play();
      new Konva.Tween({
        node: this.boxText,
        duration: 0.2,
        opacity: 0,
        easing: Konva.Easings.EaseInOut,
      }).play();
      this.hidden = true;
    }
  }
}

export default Selectable;
