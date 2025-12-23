// imports
import { freqs440 } from "./note-freqs.js";

/*
Utility functions for the game.
*/
class Utils {
  /*
    Translates the index of a string to the correct letter name.
    */
  static stringIndexToLetter(i) {
    switch (i) {
      case 0:
        return "E";
      case 1:
        return "A";
      case 2:
        return "D";
      case 3:
        return "G";
      case 4:
        return "B";
      case 5:
        return "e";
    }
  }

  /*
    Translates the index of a string to the correct number (high to low).
    */
  static stringIndexToNumber(i) {
    return 6 - i;
  }

  /*
    Determines the letter and octave of a note from its frequency.
    */
  static getNoteFromFreq(freq) {
    let closestKey = null;
    let minDiff = Number.MAX_VALUE;
    freqs440.forEach((value, key) => {
      const diff = Math.abs(freq - value);
      if (diff < minDiff) {
        minDiff = diff;
        closestKey = key;
      }
    });
    return closestKey;
  }

  /*
    Formats a detected note's string and fret to be processed for identification.
    */
  static formatStringAndFret(str, fret) {
    let formattedString = "";
    switch (str) {
      case 0:
        formattedString = "lowE";
        break;
      case 1:
        formattedString = "A";
        break;
      case 2:
        formattedString = "D";
        break;
      case 3:
        formattedString = "G";
        break;
      case 4:
        formattedString = "B";
        break;
      case 5:
        formattedString = "highE";
        break;
      default:
        return null;
    }
    if (fret >= 0 && fret <= 12) {
      return formattedString + "_" + fret;
    }
    return null;
  }

  /*
    Calculates the amount of cents off a note is from a target pitch.
    */
  static calculateCentsOff(frequency) {
    const targetFrequency = freqs440.get(Utils.roundNearestNote(frequency));
    return 1200 * Math.log2(frequency / targetFrequency);
  }

  /*
    Rounds a given frequency to the nearest note within the Western 12-tone system.
    */
  static roundNearestNote(frequency) {
    let smallestDiff = Infinity;
    let closestKey;
    for (let [key, value] of freqs440.entries()) {
      const tempDiff = Math.abs(frequency - value);
      if (tempDiff < smallestDiff) {
        smallestDiff = tempDiff;
        closestKey = key;
      }
    }
    return closestKey;
  }

  /*
    Initializes a plucked guitar synth using Tone.js.
    */
  static initiializePluck() {
    return new Tone.Sampler({
      urls: {
        E2: "E2.wav",
        A2: "A2.wav",
        D3: "D3.wav",
        G3: "G3.wav",
        B3: "B3.wav",
        E4: "E4.wav",
        A4: "A4.wav",
        D5: "D5.wav",
        G5: "G5.wav",
        B5: "B5.wav",
      },
      baseUrl: "/backend/audio-files/guitar-samples/",
    });
  }

  /*
    Generates a note from a musical note and duration.
    */
  static async pluck(note, sampler) {
    sampler.toDestination();
    sampler.triggerAttackRelease(note, "4n");
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
      "1-16th.png",
      "2-8ths.png",
      "2-16ths.png",
      "8th.png",
      "16th-triplet.png",
      "bass-clef.png",
      "treble-clef.png",
      "quarter.png",
    ];
    const randomIndex = Math.floor(Math.random() * noteImages.length);
    return "../images/music-notes/" + noteImages[randomIndex];
  }

  /*
    Pick a random note letter from the available options.
    */
  static randomNoteLetter() {
    const letters = ["A", "B", "C", "D", "E", "F", "G"];
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
      throw new Error("Invalid octave range");
    }

    const octaves = [];
    for (let octave = lowerOctave; octave <= upperOctave; octave++) {
      if (octave < 0 || octave > 7) {
        throw new Error("Octave out of bounds (0-7)");
      }
      octaves.push(octave);
    }

    const letter = this.randomNoteLetter();
    const octave = octaves[Math.floor(Math.random() * octaves.length)];
    return `${letter}${octave}`;
  }
}

export default Utils;
