let menuInitialized = false;

function handleMenu(layer, stage) {
    // initialize menu only once
    if (!menuInitialized) {
        const rect = new Konva.Rect({
            x: stage.width() / 2 - 50,
            y: stage.height() / 2 - 50,
            width: 100,
            height: 100,
            fill: 'red',
            draggable: true,
        });
        layer.add(rect);

        menuInitialized = true;
    }
}

export default handleMenu;