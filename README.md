<div>
<h1 style="margin-bottom:0;padding-bottom:0">🎸 Introducing: 
StringSense!</h1>
<h3 style="margin-top:0">An interactive memory game for 
guitarists</h3>
</div>

## 💭 Motive

The fretboard has a _lot_ of notes. On a standard 22-fret guitar,
there are 132 different fretted notes, and 4-5 ways to play one
specific note in some cases. This makes it very hard for beginners,
and even seasoned players, to find their way around the fretboard.

Knowing where notes are on the fretboard is more helpful than you
would think, in cases like:

- **Reading Sheet Music:** Sometimes the sheet music for a great song
  is all you have to go off. Knowing the fretboard by heart is the only
  way to easily read this type of notation.

- **Improvising**: Instead of playing with shapes, playing with notes
  lets you highlight the "colors" of a chord. Learn the fretboard to
  sound smooth and know what you're doing.

- **Analysing music**: Music theory is all about how notes sound
  together. If you want to know _why_ something works, it's essential
  to know what it's made up of first!

- **Writing music**: Of course, you can get by writing songs without
  knowing what makes up the chords you play, but once you _do_, you can
  make your _own_ chords and melodies that serve your songs how you
  want.

So, ask yourself - if you were told to play a C# on the G string,
G string, would you be able to hit it immediately, or would you
fumble around before finding it? Can you play a C# in all possible
spots? If not, StringSense could be what you're looking for to help
you internalize the fretboard in a fun and engaging way. All you need
is a microphone, a guitar, and a calm place to play!

## 🎼 How to Use

StringSense is not yet in operation, but it will eventually be hosted
on the web. Users will simply visit the website in a browser of their
choice and ensure the correct microphone is selected.
Some notes for input choice:

- If you have an audio interface that plugs into your computer through
  USB, plug your guitar into that and select it as your microphone
  through your browser. This guarantees proper capture of your
  guitar's audio.

- If you do not have an audio interface, use your device's default
  microphone and ensure your guitar can be heard. Use a clean signal
  if plugged into an amplifier.

After ensuring your audio input is set up properly, navigate to the
Game page and select your desired gamemode after starting the game
through the menu. <Br>

"Drill":

- The game will prompt you with a target note on the fretboard from
  frets 0 (open) to 12 that is both played aloud and displayed in the
  bottom-left of the screen.
- Players can then play the note on their guitar that they think
  matches with the target note.
- The game will visually indicate whether the choice is correct or
  incorrect via a red or green circle popping up on the game's
  fretboard display.
- If a note is correctly guessed the first time, a point is gained and
  a new target note is chosen. Otherwise, the point is not gained when
  the note is finally guessed, and the game still moves on.
- Players can play for as long as they want.
- Future aspects of the game that are yet to be implemented:
  - A timed game, which once ends gives analytics about the player's
    performance.
  - Varying levels of difficulty and assistance.
  - Customizable game preferences through the settings page.

"Zen":

- The "Zen" gamemode will be introduced at a later date, and will
  identify the most recent note played on the guitar and have
  displays in the background changing based on your playing, as well
  as droning music. Note displays and background designs will be
  changed with the arrow keys.

**Please note that StringSense is currently only optimised for
usablility on desktop/laptop computers. Support for mobile devices is
coming soon.**

## 🎛️ Tech Stack

**Front-End:** JavaScript, HTML/CSS
<br>
**JS Libaries Used:** Web Audio API, Tone.js, pitchy, Konva.js

## 🗒️ Acknowledgements and Notes

Everything in this project was made by Chris DiCono (me!).
<br>
A big thanks to my dad for being so supportive as I work through this
project.
<br>
I used a lot of Codecademy resources to help me along the building
process. Specifically the Full-Stack Developer learning path. I
reccomend this to anyone who is interested in full-stack development!
