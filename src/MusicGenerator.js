class MusicGenerator {
  constructor(progression, chordMap) {
    this.timeSignatures = ["2/4", "4/4", "3/4", "6/8"];
    this.noteDurations = [
      { type: "8", value: 4 },
      { type: "4", value: 2 },
      { type: "2", value: 1 },
      { type: "1", value: 0.5 },
    ];
    this.progression = progression;
    this.chordMap = chordMap;
  }

  getTotalDuration(timeSignature) {
    const [beats, beatType] = timeSignature.split("/").map(Number);
    // duration in quarter notes (beatType 4 means quarter note)
    return beats * (4 / beatType);
  }

  generateMeasure(timeSignature, clef) {
    const totalDuration = this.getTotalDuration(timeSignature);
    let remaining = totalDuration;
    let rhythm = [];

    while (remaining > 0) {
      const availableNotes = this.noteDurations.filter(
        (n) => n.value <= remaining
      );
      const note =
        availableNotes[Math.floor(Math.random() * availableNotes.length)];
      rhythm.push(note);
      remaining -= note.value;
    }

    const pitches = this.assignPitches(rhythm, clef);
    return { rhythm, pitches };
  }

  assignPitches(rhythm, clef, measureIdx = 0) {
    // For both clefs, use chord progression
    if (clef === "treble") {
      const chordName = this.progression[measureIdx % this.progression.length];
      const chordNotes = this.chordMap[chordName];
      const firstNote = chordNotes[0]; // First note of the chord
      const pitches = rhythm.map((_, index) => {
        if (index === 0 || index === rhythm.length - 1) {
          return firstNote; // First and last note must be the first note of the chord
        }
        return this.getTreblePitch(measureIdx);
      });
      return pitches;
    } else {
      // For bass, use chord progression
      return rhythm.map(() => this.getBassPitch(measureIdx));
    }
  }

  getRandomPitch(clef) {
    const treblePitches = [
      "C",
      "D",
      "E",
      "F",
      "G",
      "A",
      "B",
      "c",
      "d",
      "e",
      "f",
      "g",
      "a",
      "b",
      "c'",
    ];
    const bassPitches = [
      "C,,",
      "D,,",
      "E,,",
      "F,,",
      "G,,",
      "A,,",
      "B,,",
      "C,",
      "D,",
      "E,",
      "F,",
      "G,",
      "A,",
      "B,",
      "C",
    ];

    const pool = clef === "treble" ? treblePitches : bassPitches;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  getBassPitch(measureIdx) {
    // Get the chord for this measure
    const chordName = this.progression[measureIdx % this.progression.length];
    const chordNotes = this.chordMap[chordName];
    const note = chordNotes[Math.floor(Math.random() * chordNotes.length)];
    return note + ",";
  }
  getTreblePitch(measureIdx) {
    const chordName = this.progression[measureIdx % this.progression.length];
    const chordNotes = this.chordMap[chordName];
    const note = chordNotes[Math.floor(Math.random() * chordNotes.length)];
    return note;
  }

  generateScore(numMeasures, timeSignature) {
    const trebleMeasures = [];
    const bassMeasures = [];
    for (let i = 0; i < numMeasures; i++) {
      const trebleRhythm = this.generateMeasure(timeSignature, "treble").rhythm;
      const treblePitches = this.assignPitches(trebleRhythm, "treble", i);
      trebleMeasures.push({ rhythm: trebleRhythm, pitches: treblePitches });
      // Pass measure index to assignPitches for bass
      const bassRhythm = this.generateMeasure(timeSignature, "bass").rhythm;
      const bassPitches = this.assignPitches(bassRhythm, "bass", i);
      bassMeasures.push({ rhythm: bassRhythm, pitches: bassPitches });
    }
    return { treble: trebleMeasures, bass: bassMeasures };
  }
}

export default MusicGenerator;
