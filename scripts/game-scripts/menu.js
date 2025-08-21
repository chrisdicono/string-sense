let titleScreen = true;

function handleMenu(layer, stage, newState) {
    // initialize menu only once
    if (titleScreen) {
        const welcomeText1 = new Konva.Text({
            x: stage.width() / 2,
            y: stage.height() / 2 - 75,
            text: 'welcome to',
            fontSize: 30,
            fontFamily: 'Space Mono',
            fill: '#ddd',
            offsetX: 0,
        });
        welcomeText1.offsetX(welcomeText1.width() / 2);

        const titleText = new Konva.Text({
            x: stage.width() / 2,
            y: stage.height() / 2 - 40,
            text: 'StringSense',
            fontSize: 70,
            fontFamily: 'DynaPuff',
            fill: '#ddd',
            offsetX: 0,
            align: 'center',
            alignVertical: 'middle',
        });
        titleText.offsetX(titleText.width() / 2);

        const welcomeText2 = new Konva.Text({
            x: stage.width() / 2,
            y: stage.height() / 2 + 35,
            text: 'press space to continue',
            fontSize: 30,
            fontFamily: 'Space Mono',
            fill: '#ddd',
            offsetX: 0,
        });
        welcomeText2.offsetX(welcomeText2.width() / 2);

        let negOrPos = 1;
        titleText.on('mouseover', () => {
            new Konva.Tween({
                node: titleText,
                duration: 0.1,
                rotation: 2 * negOrPos,
            }).play();
            negOrPos *= -1;
        });

        titleText.on('mouseout', () => {
            new Konva.Tween({
                node: titleText,
                duration: 0.1,
                rotation: 0,
            }).play();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                new Konva.Tween({
                    node: titleText,
                    duration: 0.2,
                    opacity: 0,
                }).play();
                new Konva.Tween({
                    node: welcomeText1,
                    duration: 0.2,
                    opacity: 0,
                }).play();
                new Konva.Tween({
                    node: welcomeText2,
                    duration: 0.2,
                    opacity: 0,
                }).play();
                setTimeout(() => {
                    layer.destroyChildren();
                    makeMenu(layer, stage, newState);
                }, 300);
            }
        });

        layer.add(welcomeText1);
        layer.add(titleText);
        layer.add(welcomeText2);

        titleScreen = false;
    }
}

function makeMenu(layer, stage, newState) {
    const playButton = new Konva.Text({
        x: stage.width() / 2,
        y: stage.height() / 2 - 65,
        text: 'Play',
        fontSize: 35,
        fontFamily: 'Space Mono',
        fill: '#ddd',
        offsetX: 0,
        align: 'center',
        alignVertical: 'middle',
    });
    playButton.offsetX(playButton.width() / 2);

    const optionsButton = new Konva.Text({
        x: stage.width() / 2,
        y: stage.height() / 2 + 15,
        text: 'Options',
        fontSize: 35,
        fontFamily: 'Space Mono',
        fill: '#ddd',
        offsetX: 0,
        align: 'center',
        alignVertical: 'middle',
    });
    optionsButton.offsetX(optionsButton.width() / 2);
    
    playButton.on('mouseover', () => {
        playButton.fill('#fff');
    });

    playButton.on('mouseout', () => {
        playButton.fill('#ddd');
    });

    optionsButton.on('mouseover', () => {
        optionsButton.fill('#fff');
    });

    optionsButton.on('mouseout', () => {
        optionsButton.fill('#ddd');
    });

    playButton.on('click', () => {
        layer.destroyChildren();
        newState('game'); 
    });

    optionsButton.on('click', () => {
        layer.destroyChildren();
        newState('options');
    });

    layer.add(playButton);
    layer.add(optionsButton);
}

export default handleMenu;

// <a href="https://www.flaticon.com/free-icons/music-note" title="music note icons">Music note icons created by Valeria - Flaticon</a>
// <a href="https://www.flaticon.com/free-icons/music-and-multimedia" title="music and multimedia icons">Music and multimedia icons created by Valeria - Flaticon</a>
// 