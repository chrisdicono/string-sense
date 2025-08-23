let titleScreen = true;
const particles = [];

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

        // spawn particles initially
        for (let i = 0; i < 10; i++) {
            particles.push(createParticle(layer, stage));
        }

        titleScreen = false;
    }

    // handle animated particles
    handleParticles(layer, stage);
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


function handleParticles(layer, stage) {
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].x > stage.width() || particles[i].y > stage.height() || particles[i].x < 0 || particles[i].y < 0) {
            particles.splice(i, 1);
            i--;
            particles.unshift(createParticle(layer, stage));
        }
    }
}

function createParticle(layer, stage) {
    const imageObj = new Image();
    imageObj.src = pickRandomNoteImage();
    const randomParticle = randomPointOutsideBounds(stage);
    const note = new Konva.Image({
        x: randomParticle.position[0],
        y: randomParticle.position[1],
        image: imageObj,
        width: 32,
        height: 32,
        vx: randomParticle.velocity[0],
        vy: randomParticle.velocity[1],
    });

    // add animation
    const anim = new Konva.Animation((frame) => {
        const time = frame.time;
        const timeDiff = frame.timeDiff;
        const frameRate = frame.frameRate;

        note.x(note.x + note.vx);
        note.y(note.y + note.vy);

        // remove particle if out of bounds
        if (note.x < 0 || note.x > stage.width() || note.y < 0 || note.y > stage.height()) {
            layer.remove(note);
            anim.stop();
        }
    });

    layer.add(note);

    return note;
}

function pickRandomNoteImage() {
    const noteImages = [
        '1-16th.png',
        '2-8ths.png',
        '2-16ths.png',
        '8th.png',
        '16th-triplet.png',
        'bass-clef.png',
        'treble-clef.png',
        'quarter.png',
    ];
    const randomIndex = Math.floor(Math.random() * noteImages.length);
    return "../images/music-notes/" + noteImages[randomIndex];
}

function randomPointOutsideBounds(stage) {
    // offset ratios
    const offsetX = 0.1;
    const offsetY = 0.15;

    // calculate with offset to random sides, scale up to stage size
    const x = (Math.random() < 0.5 ? -offsetX : 1 + offsetX) * stage.width();
    const y = (Math.random() < 0.5 ? -offsetY : 1 + offsetY) * stage.height();

    // calculate speed of particles
    const speed = Math.random() * 1 + 0.5; // between 0.5 and 1.5

    // calculate x + y velocities
    const { velocityX, velocityY } = calculateVelocity(x, y, speed);

    return { 
        position: { x, y },
        velocity: { velocityX, velocityY } 
    };
}

function calculateVelocity(x, y, speed) {
    // target point (random)
    const targetPoint = {
        x: Math.random() * stage.width() - 100,
        y: Math.random() * stage.height() - 100,
    }

    // delta values
    const dX = targetPoint.x - x;
    const dY = targetPoint.y - y;

    // normalizing for speed scaling
    const length = Math.sqrt(dX*dX + dY*dY);
    dX /= length;
    dY /= length;

    return {
        velocityX: dX * speed,
        velocityY: dY * speed
    };
}

export default handleMenu;

// <a href="https://www.flaticon.com/free-icons/music-note" title="music note icons">Music note icons created by Valeria - Flaticon</a>
// <a href="https://www.flaticon.com/free-icons/music-and-multimedia" title="music and multimedia icons">Music and multimedia icons created by Valeria - Flaticon</a>
// 