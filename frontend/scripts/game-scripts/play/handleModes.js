// imports
import Utils from "../Utils.js";
import PlayConfig from "./PlayConfig.js";

function handleModes(primaryLayer, stage, newState, playConfig) {
  if (!playConfig.initialized) {
    window.addEventListener(
      "click",
      () => {
        playConfig.resumeAudioContext();
      },
      { once: true }
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
      playConfig.initialized = false;
      newState("menu");
    });

    const mainText = new Konva.Text({
      x: stage.width() / 2,
      y: stage.height() / 2 - 125,
      text: "choose a gamemode",
      fontSize: 35,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    mainText.offsetX(mainText.width() / 2);

    const tunerText = new Konva.Text({
      x: stage.width() - 60,
      y: 15,
      text: "tuner",
      fontSize: 25,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    tunerText.offsetX(tunerText.width() / 2);

    tunerText.on("mouseover", () => {
      tunerText.fill("#fff");
    });
    tunerText.on("mouseout", () => {
      tunerText.fill("#ddd");
    });
    tunerText.on("click", () => {
      primaryLayer.destroyChildren();
      playConfig.initialized = false;
      playConfig.playState = "tuner";
    });

    const zenButton = new Konva.Group({
      x: stage.width() / 2 - 120,
      y: stage.height() / 2 + 20,
    });

    const drillButton = new Konva.Group({
      x: stage.width() / 2 + 120,
      y: stage.height() / 2 + 20,
    });

    // "zen" and "drill" mode w/ dynapuff font
    const zenText = new Konva.Text({
      x: 0,
      y: 0,
      text: "Zen",
      fontSize: 55,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
    });
    zenText.offsetX(zenText.width() / 2);

    const drillText = new Konva.Text({
      x: 0,
      y: 0,
      text: "Drill",
      fontSize: 55,
      fontFamily: "DynaPuff",
      fill: "#ddd",
      offsetX: 0,
    });
    drillText.offsetX(drillText.width() / 2);

    const optRect1 = new Konva.Rect({
      x: 0,
      y: 25,
      width: 200,
      height: 165,
      fill: "#dddddd5a",
      cornerRadius: 20,
    });
    optRect1.offsetX(optRect1.width() / 2);
    optRect1.offsetY(optRect1.height() / 2);

    const optRect2 = new Konva.Rect({
      x: 0,
      y: 25,
      width: 200,
      height: 165,
      fill: "#dddddd5a",
      cornerRadius: 20,
    });
    optRect2.offsetX(optRect2.width() / 2);
    optRect2.offsetY(optRect2.height() / 2);

    zenButton.add(optRect1);
    zenButton.add(zenText);
    drillButton.add(optRect2);
    drillButton.add(drillText);

    drillButton.on("click", () => {
      primaryLayer.destroyChildren();
      playConfig.initialized = false;
      playConfig.playState = "drill";
    });

    const zenDesc = new Konva.Text({
      x: stage.width() / 2,
      y: stage.height() - 30,
      text: "Coming Soon!",
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      opacity: 0,
      offsetX: 0,
    });
    zenDesc.offsetX(zenDesc.width() / 2);
    const drillDesc = new Konva.Text({
      x: stage.width() / 2,
      y: stage.height() - 30,
      text: "Correctly guess the prompted notes and build your muscle memory!",
      fontSize: 20,
      fontFamily: "Space Mono",
      fill: "#ddd",
      opacity: 0,
      offsetX: 0,
    });
    drillDesc.offsetX(drillDesc.width() / 2);

    // short description over hover (possibly animation later)
    primaryLayer.add(backButton);
    primaryLayer.add(mainText);
    primaryLayer.add(tunerText);
    primaryLayer.add(zenButton);
    primaryLayer.add(drillButton);
    primaryLayer.add(zenDesc);
    primaryLayer.add(drillDesc);
    primaryLayer.draw();

    zenButton.on("mouseover", () => {
      new Konva.Tween({
        node: zenText,
        duration: 0.2,
        scaleX: 1.05,
        scaleY: 1.05,
        easing: Konva.Easings.EaseInOut,
      }).play();
      new Konva.Tween({
        node: optRect1,
        duration: 0.2,
        scaleX: 1.1,
        scaleY: 1.1,
        fill: "#85b1dacc",
        easing: Konva.Easings.EaseInOut,
      }).play();
      new Konva.Tween({
        node: zenDesc,
        duration: 0.2,
        opacity: 1,
        easing: Konva.Easings.EaseInOut,
      }).play();
    });

    zenButton.on("mouseout", () => {
      new Konva.Tween({
        node: zenText,
        duration: 0.2,
        scaleX: 1,
        scaleY: 1,
        easing: Konva.Easings.EaseInOut,
      }).play();
      new Konva.Tween({
        node: optRect1,
        duration: 0.2,
        scaleX: 1,
        scaleY: 1,
        fill: "#dddddd5a",
        easing: Konva.Easings.EaseInOut,
      }).play();
      new Konva.Tween({
        node: zenDesc,
        duration: 0.2,
        opacity: 0,
        easing: Konva.Easings.EaseInOut,
      }).play();
    });

    drillButton.on("mouseover", () => {
      new Konva.Tween({
        node: drillText,
        duration: 0.2,
        scaleX: 1.05,
        scaleY: 1.05,
        easing: Konva.Easings.EaseInOut,
      }).play();
      new Konva.Tween({
        node: optRect2,
        duration: 0.2,
        scaleX: 1.1,
        scaleY: 1.1,
        fill: "#85b1dacc",
        easing: Konva.Easings.EaseInOut,
      }).play();
      new Konva.Tween({
        node: drillDesc,
        duration: 0.2,
        opacity: 1,
        easing: Konva.Easings.EaseInOut,
      }).play();
    });

    drillButton.on("mouseout", () => {
      new Konva.Tween({
        node: drillText,
        duration: 0.2,
        scaleX: 1,
        scaleY: 1,
        easing: Konva.Easings.EaseInOut,
      }).play();
      new Konva.Tween({
        node: optRect2,
        duration: 0.2,
        scaleX: 1,
        scaleY: 1,
        fill: "#dddddd5a",
        easing: Konva.Easings.EaseInOut,
      }).play();
      new Konva.Tween({
        node: drillDesc,
        duration: 0.2,
        opacity: 0,
        easing: Konva.Easings.EaseInOut,
      }).play();
    });

    playConfig.initialized = true;
  }
}

export default handleModes;
