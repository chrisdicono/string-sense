// imports
import Utils from "./Utils.js";

// global variables
let initialized = false;

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

    initialized = true;
  }

  // other code here
}

export default handleOptions;
