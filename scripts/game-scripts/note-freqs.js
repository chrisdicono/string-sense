const freqs440 = new Map();

// Octave 0
freqs440.set("C0", 16.35);
freqs440.set("C#0", 17.32);
freqs440.set("Db0", 17.32);
freqs440.set("D0", 18.35);
freqs440.set("D#0", 19.45);
freqs440.set("Eb0", 19.45);
freqs440.set("E0", 20.6);
freqs440.set("F0", 21.83);
freqs440.set("F#0", 23.12);
freqs440.set("Gb0", 23.12);
freqs440.set("G0", 24.5);
freqs440.set("G#0", 25.96);
freqs440.set("Ab0", 25.96);
freqs440.set("A0", 27.5);
freqs440.set("A#0", 29.14);
freqs440.set("Bb0", 29.14);
freqs440.set("B0", 30.87);

// Octave 1
freqs440.set("C1", 32.70);
freqs440.set("C#1", 34.65);
freqs440.set("Db1", 34.65);
freqs440.set("D1", 36.71);
freqs440.set("D#1", 38.89);
freqs440.set("Eb1", 38.89);
freqs440.set("E1", 41.20);
freqs440.set("F1", 43.65);
freqs440.set("F#1", 46.25);
freqs440.set("Gb1", 46.25);
freqs440.set("G1", 49.00);
freqs440.set("G#1", 51.91);
freqs440.set("Ab1", 51.91);
freqs440.set("A1", 55.00);
freqs440.set("A#1", 58.27);
freqs440.set("Bb1", 58.27);
freqs440.set("B1", 61.74);

// Octave 2
freqs440.set("C2", 65.41);
freqs440.set("C#2", 69.30);
freqs440.set("Db2", 69.30);
freqs440.set("D2", 73.42);
freqs440.set("D#2", 77.78);
freqs440.set("Eb2", 77.78);
freqs440.set("E2", 82.41);
freqs440.set("F2", 87.31);
freqs440.set("F#2", 92.50);
freqs440.set("Gb2", 92.50);
freqs440.set("G2", 98.00);
freqs440.set("G#2", 103.83);
freqs440.set("Ab2", 103.83);
freqs440.set("A2", 110.00);
freqs440.set("A#2", 116.54);
freqs440.set("Bb2", 116.54);
freqs440.set("B2", 123.47);

// Octave 3
freqs440.set("C3", 130.81);
freqs440.set("C#3", 138.59);
freqs440.set("Db3", 138.59);
freqs440.set("D3", 146.83);
freqs440.set("D#3", 155.56);
freqs440.set("Eb3", 155.56);
freqs440.set("E3", 164.81);
freqs440.set("F3", 174.61);
freqs440.set("F#3", 185.00);
freqs440.set("Gb3", 185.00);
freqs440.set("G3", 196.00);
freqs440.set("G#3", 207.65);
freqs440.set("Ab3", 207.65);
freqs440.set("A3", 220.00);
freqs440.set("A#3", 233.08);
freqs440.set("Bb3", 233.08);
freqs440.set("B3", 246.94);

// Octave 4
freqs440.set("C4", 261.63);
freqs440.set("C#4", 277.18);
freqs440.set("Db4", 277.18);
freqs440.set("D4", 293.66);
freqs440.set("D#4", 311.13);
freqs440.set("Eb4", 311.13);
freqs440.set("E4", 329.63);
freqs440.set("F4", 349.23);
freqs440.set("F#4", 369.99);
freqs440.set("Gb4", 369.99);
freqs440.set("G4", 392.00);
freqs440.set("G#4", 415.30);
freqs440.set("Ab4", 415.30);
freqs440.set("A4", 440.00);
freqs440.set("A#4", 466.16);
freqs440.set("Bb4", 466.16);
freqs440.set("B4", 493.88);

// Octave 5
freqs440.set("C5", 523.25);
freqs440.set("C#5", 554.37);
freqs440.set("Db5", 554.37);
freqs440.set("D5", 587.33);
freqs440.set("D#5", 622.25);
freqs440.set("Eb5", 622.25);
freqs440.set("E5", 659.26);
freqs440.set("F5", 698.46);
freqs440.set("F#5", 739.99);
freqs440.set("Gb5", 739.99);
freqs440.set("G5", 783.99);
freqs440.set("G#5", 830.61);
freqs440.set("Ab5", 830.61);
freqs440.set("A5", 880.00);
freqs440.set("A#5", 932.33);
freqs440.set("Bb5", 932.33);
freqs440.set("B5", 987.77);

// Octave 6
freqs440.set("C6", 1046.50);
freqs440.set("C#6", 1108.73);
freqs440.set("Db6", 1108.73);
freqs440.set("D6", 1174.66);
freqs440.set("D#6", 1244.51);
freqs440.set("Eb6", 1244.51);
freqs440.set("E6", 1318.51);
freqs440.set("F6", 1396.91);
freqs440.set("F#6", 1479.98);
freqs440.set("Gb6", 1479.98);
freqs440.set("G6", 1567.98);
freqs440.set("G#6", 1661.22);
freqs440.set("Ab6", 1661.22);
freqs440.set("A6", 1760.00);
freqs440.set("A#6", 1864.66);
freqs440.set("Bb6", 1864.66);
freqs440.set("B6", 1975.53);

// Octave 7
freqs440.set("C7", 2093.00);
freqs440.set("C#7", 2217.46);
freqs440.set("Db7", 2217.46);
freqs440.set("D7", 2349.32);
freqs440.set("D#7", 2489.02);
freqs440.set("Eb7", 2489.02);
freqs440.set("E7", 2637.02);
freqs440.set("F7", 2793.83);
freqs440.set("F#7", 2959.96);
freqs440.set("Gb7", 2959.96);
freqs440.set("G7", 3135.96);
freqs440.set("G#7", 3322.44);
freqs440.set("Ab7", 3322.44);
freqs440.set("A7", 3520.00);
freqs440.set("A#7", 3729.31);
freqs440.set("Bb7", 3729.31);
freqs440.set("B7", 3951.07);

export { freqs440 };
