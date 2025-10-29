// imports
import Utils from "../Utils.js";

function handleTuner(primaryLayer, stage, newState, playConfig) {
  if (!playConfig.initialized) {
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
      primaryLayer.removeChildren();
      playConfig.initialized = false;
      playConfig.playState = "modes";
    });

    const promptText = new Konva.Text({
      x: stage.width() / 2,
      y: stage.height() / 2 - 155,
      text: "Play any note.",
      fontSize: 30,
      fontFamily: "Space Mono",
      fill: "#ddd",
      offsetX: 0,
    });
    promptText.offsetX(promptText.width() / 2);

    const waveDisplay = new Konva.Group({
      x: stage.width() / 2,
      y: stage.height() / 2 + 30,
    });

    const waveBg = new Konva.Rect({
      width: playConfig.BOX_WIDTH,
      height: playConfig.BOX_HEIGHT,
      fill: "#dddddd21",
      cornerRadius: 20,
    });
    waveBg.offsetX(waveBg.width() / 2);

    waveDisplay.add(waveBg);
    waveDisplay.add(playConfig.waveform);

    const centerX = stage.width() / 2;
    const centerY = stage.height() / 2 + 150;
    const radius = 200;

    for (let i = 5; i >= 1; i--) {
      const angleDeg = (-80 / 5) * i;
      const angleRad = Konva.getAngle(angleDeg);
      const x = centerX + radius * Math.sin(angleRad) + 10;
      const y = centerY - radius * Math.cos(angleRad);
      const tempBlock = new Konva.Rect({
        x,
        y,
        width: 50,
        height: 25,
        fill: "#dddddd5a",
        cornerRadius: 20,
        rotation: (-80 / 5) * i,
      });
      tempBlock.offsetX(tempBlock.width() / 2);
      tempBlock.offsetY(tempBlock.height() / 2);
      playConfig.pushToTunerBlocks(tempBlock);
    }
    const middleBlock = new Konva.Rect({
      x: centerX,
      y: centerY - 200,
      width: 25,
      height: 50,
      fill: "#dddddd5a",
      cornerRadius: 20,
    });
    middleBlock.offsetX(middleBlock.width() / 2);
    middleBlock.offsetY(middleBlock.height() / 2);
    playConfig.pushToTunerBlocks(middleBlock);
    for (let i = 1; i <= 5; i++) {
      const angleDeg = (80 / 5) * i;
      const angleRad = Konva.getAngle(angleDeg);
      const x = centerX + radius * Math.sin(angleRad) - 10;
      const y = centerY - radius * Math.cos(angleRad);
      const tempBlock = new Konva.Rect({
        x,
        y,
        width: 50,
        height: 25,
        fill: "#dddddd5a",
        cornerRadius: 20,
        rotation: (80 / 5) * i,
      });
      tempBlock.offsetX(tempBlock.width() / 2);
      tempBlock.offsetY(tempBlock.height() / 2);
      playConfig.pushToTunerBlocks(tempBlock);
    }

    primaryLayer.add(backButton);
    primaryLayer.add(promptText);
    primaryLayer.add(waveDisplay);
    primaryLayer.add(playConfig.noteText);
    for (const block of playConfig.tunerBlocks) {
      primaryLayer.add(block);
    }
    primaryLayer.draw();

    window.addEventListener("keydown", (keyEvent) => {
      playConfig.resumeAudioContext();
      if (keyEvent.key == "t") {
        playConfig.toggleTestMic();
      }
    });

    playConfig.initialized = true;
  }

  playConfig.drawWaveform(primaryLayer);
  playConfig.fillTuner();
}

export default handleTuner;
