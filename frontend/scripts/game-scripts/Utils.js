// imports
import { freqs440 } from './note-freqs.js';

/*
Utility functions for the game.
*/
class Utils {
    static initiializePluck() {
        return new Tone.Sampler({
            urls: {
                E2: 'E2.wav',
                A2: 'A2.wav',
                D3: 'D3.wav',
                G3: 'G3.wav',
                B3: 'B3.wav',
                E4: 'E4.wav',
                A4: 'A4.wav',
                D5: 'D5.wav',
                G5: 'G5.wav',
                B5: 'B5.wav',
            },
            baseUrl: '/backend/audio-files/guitar-samples/',
        });
    }

    /*
    Generates a note from a musical note and duration.
    */
    static async pluck(note, sampler) {
        sampler.toDestination();
        sampler.triggerAttackRelease(note, '4n');
    }

    /*
    Converts a note (e.g. "A4") to its corresponding frequency in Hz.
    */
    static noteToFrequency(note) {
        return freqs440.get(note) || 440; // default to A4 if not found
    }

    /*
    Pick a random note image from the available options.
    */
    static pickRandomNoteImage() {
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

    /*
    Pick a random note letter from the available options.
    */
    static randomNoteLetter() {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        return letters[Math.floor(Math.random() * letters.length)];
    }

    /*
    Pick a random note octave from the available options.
    */
    static randomNoteOctave() {
        const octaves = [2, 3, 4, 5, 6];
        return octaves[Math.floor(Math.random() * octaves.length)];
    }

    /*
    Pick a random note.
    */
    static randomNote() {
        const letter = this.randomNoteLetter();
        const octave = this.randomNoteOctave();
        return `${letter}${octave}`;
    }

    /*
    Pick a random note in a specific octave range.
    */
    static randomNoteInRange(lowerOctave, upperOctave) {
        if (lowerOctave > upperOctave) {
            throw new Error('Invalid octave range');
        }

        const octaves = [];
        for (let octave = lowerOctave; octave <= upperOctave; octave++) {
            if (octave < 0 || octave > 7) {
                throw new Error('Octave out of bounds (0-7)');
            }
            octaves.push(octave);
        }

        const letter = this.randomNoteLetter();
        const octave = octaves[Math.floor(Math.random() * octaves.length)];
        return `${letter}${octave}`;
    }
}

export default Utils;