// imports
import Utils from './Utils.js';

// global variables
let titleScreen = true;
const particles = [];
const pluckSampler = Utils.initiializePluck();

function handleMenu(primaryLayer, stage, newState) {
    const particleLayer = stage.findOne('#game-layer-1');

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

        function handleKeyDown(e) {
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
                    primaryLayer.destroyChildren();
                    makeMenu(primaryLayer, stage, newState);

                    window.removeEventListener('keydown', handleKeyDown);
                }, 300);
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        primaryLayer.add(welcomeText1);
        primaryLayer.add(titleText);
        primaryLayer.add(welcomeText2);
        primaryLayer.draw();

        // spawn particles initially
        for (let i = 0; i < 10; i++) {
            particles.push(createParticle(particleLayer, stage));
            // console.log('spawned particle ' + i);
        }

        titleScreen = false;
    }

    // handle animated particles
    handleParticles(particleLayer, stage);
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
        stage.findOne('#game-layer-1').destroyChildren();
        layer.destroyChildren();
        newState('play'); 
    });

    optionsButton.on('click', () => {
        stage.findOne('#game-layer-1').destroyChildren();
        layer.destroyChildren();
        newState('options');
    });

    layer.add(playButton);
    layer.add(optionsButton);
}


function handleParticles(layer, stage) {
    for (let i = 0; i < particles.length; i++) {
        const note = particles[i];
        checkHasShown(note, stage);

        // handle popping

        // if a particle was popped or is offscreen, then:
        const wasReset = resetNote(note, i, layer, stage);
        if (wasReset) {
            i--;
        }
    }
}

function createParticle(layer, stage) {
    const imageObj = new Image();
    imageObj.onload = () => {
        note.image(imageObj);
        layer.add(note);
        layer.draw();
        note.cache();
        note.filters([Konva.Filters.Invert]);
    };
    const randomParticle = randomPointOutsideBounds(stage);
    const note = new Konva.Image({
        x: randomParticle.position.x,
        y: randomParticle.position.y,
        image: imageObj,
        width: 50,
        height: 50,
        opacity: 0.35,
        filter: Konva.Filters.Invert,
    });
    imageObj.src = Utils.pickRandomNoteImage();
    note.vx = randomParticle.velocity.velocityX;
    note.vy = randomParticle.velocity.velocityY;
    note.hasShown = false;
    note.isPopped = false;
    note.spawnX = randomParticle.position.x;
    note.spawnY = randomParticle.position.y;

    // add animation
    const anim = new Konva.Animation(() => {
        note.x(note.x() + note.vx);
        note.y(note.y() + note.vy);
    }, layer);

    // on click, explode animation
    note.on('click', () => {
        // random note generated
        const randomNote = Utils.randomNoteInRange(2, 5);
        Utils.pluck(randomNote, pluckSampler);

        // poof cloud particles
        noteExplosion(note.x() + note.width() / 2, note.y() + note.height() / 2, layer);

        // fade to zero opacity
        note.to({
            opacity: 0,
            duration: 0.05,
            onFinish: () => {
                note.isPopped = true;
            }
        });
    });

    anim.start();

    layer.add(note);

    // console.log(`Created particle at (${note.x().toFixed(2)}, ${note.y().toFixed(2)})`);

    return note;
}

function randomPointOutsideBounds(stage) {
    // offset ratios
    const offsetX = 0.1;
    const offsetY = 0.15;

    // calculate with offset to random sides, scale up to stage size
    const x = (Math.random() < 0.5 ? -offsetX : 1 + offsetX) * stage.width();
    const y = (Math.random() < 0.5 ? -offsetY : 1 + offsetY) * stage.height();
    // console.log(`Creating particle at (${x}, ${y})`);

    // calculate speed of particles
    const speed = Math.random() / 5 + 0.2; // between 0.2 and 0.4

    // calculate x + y velocities
    const { velocityX, velocityY } = calculateVelocity(stage, x, y, speed);

    return { 
        position: { x, y },
        velocity: { velocityX, velocityY } 
    };
}

function calculateVelocity(stage, x, y, speed) {
    // target point (random)
    const targetPoint = {
        x: Math.random() * stage.width() / 2,
        y: Math.random() * stage.height() / 2,
    }

    // delta values
    let dX = targetPoint.x - x;
    let dY = targetPoint.y - y;

    // normalizing for speed scaling
    const length = Math.sqrt(dX*dX + dY*dY);
    dX /= length;
    dY /= length;

    return {
        velocityX: dX * speed,
        velocityY: dY * speed
    };
}

function checkHasShown(particle, stage) {
    if (particle.hasShown) {
        // Particle has already been shown, no need to do anything
        return;
    } else if ((particle.x() > 0 && particle.x() < stage.width()) && (particle.y() > 0 && particle.y() < stage.height())) {
        // Particle has entered the screen
        particle.hasShown = true;
    }
}

function resetNote(note, noteIndex, layer, stage) {
    if (handleBounds(note, stage) || note.isPopped) {
        particles.splice(noteIndex, 1);
        particles.push(createParticle(layer, stage));
        note.getLayer().find('Animation').forEach(anim => anim.stop());
        note.destroy();
        return true;
    }

    return false;
}

function handleBounds(note, stage) {
    const spawnX = note.spawnX;
    const spawnY = note.spawnY;
    if (spawnX < 0 && note.x() > stage.width() || spawnY < 0 && note.y() > stage.height()) {
        return true;
    }
    else if (spawnX > stage.width() && note.x() + note.width() < 0 || spawnY > stage.height() && note.y() + note.height() < 0) {
        return true;
    }
    return false;
}

function noteExplosion(x, y, layer) {
    // create explosion particles
    const numParticles = 10;
    const distance = 100;
    for (let i = 0; i < numParticles; i++) {
        const randomAngle = Math.random() * 30 - 15 + i * (360 / numParticles);
        const angleInRadians = randomAngle * (Math.PI / 180);
        const particle = new Konva.Circle({
            x: x,
            y: y,
            radius: Math.random() * 2 + 3,
            fill: 'white',
            opacity: 0.65,
        });

        particle.to({
            x: x + Math.cos(angleInRadians) * distance,
            y: y + Math.sin(angleInRadians) * distance,
            radius: 0,
            opacity: 0,
            duration: 0.75,
            easing: Konva.Easings.EaseOut,
            onFinish: () => {
                    particle.destroy();
                }
            });
        layer.add(particle);
    }
}

export default handleMenu;

// <a href="https://www.flaticon.com/free-icons/music-note" title="music note icons">Music note icons created by Valeria - Flaticon</a>
// <a href="https://www.flaticon.com/free-icons/music-and-multimedia" title="music and multimedia icons">Music and multimedia icons created by Valeria - Flaticon</a>
// 