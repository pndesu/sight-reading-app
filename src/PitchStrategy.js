class PitchStrategy {
    constructor(progression, chordMap) {
        this.progression = progression;
        this.chordMap = chordMap;
        this.trebleRange = { low: { note: "A", octave: 3 }, high: { note: "G", octave: 6 } };
        this.bassRange = { low: { note: "G", octave: 1 }, high: { note: "F", octave: 4 } };
    }

    getRandomOctaveForClef(note, clef) {
        let minOctave, maxOctave, low, high;
        if (clef === "treble") {
            low = this.trebleRange.low;
            high = this.trebleRange.high;
        } else if (clef === "bass") {
            low = this.bassRange.low;
            high = this.bassRange.high;
        } else {
            minOctave = maxOctave = 4;
            return this.randomInt(minOctave, maxOctave);
        }
        minOctave = low.octave;
        maxOctave = high.octave;
        // Clamp notes at the edges
        if (this.noteIndex(note) < this.noteIndex(low.note)) minOctave += 1;
        if (this.noteIndex(note) > this.noteIndex(high.note)) maxOctave -= 1;
        return this.randomInt(minOctave, maxOctave);
    }

    getHarmonyCandidate(note, octave, clef, chordNotes) {
        let range, compareFn, boundaryFn;
        if (clef === "treble") {
        range = this.trebleRange;
        // Lower than input note, but not lower than treble low
        compareFn = (cNote, cOct, n, o) =>
            cOct < o || (cOct === o && this.noteIndex(cNote) < this.noteIndex(n));
        boundaryFn = (cNote, cOct) =>
            cOct > range.low.octave ||
            (cOct === range.low.octave && this.noteIndex(cNote) >= this.noteIndex(range.low.note));
        } else if (clef === "bass") {
        range = this.bassRange;
        // Higher than input note, but not higher than bass high
        compareFn = (cNote, cOct, n, o) =>
            cOct > o || (cOct === o && this.noteIndex(cNote) > this.noteIndex(n));
        boundaryFn = (cNote, cOct) =>
            cOct < range.high.octave ||
            (cOct === range.high.octave && this.noteIndex(cNote) <= this.noteIndex(range.high.note));
        } else {
        return [];
        }

        const candidates = [];
        for (const chordNote of chordNotes) {
        // Try all octaves in the clef's range
        for (let o = range.low.octave; o <= range.high.octave; o++) {
            if (compareFn(chordNote, o, note, octave) && boundaryFn(chordNote, o)) {
            candidates.push({ note: chordNote, octave: o });
            }
        }
        }
        return candidates;
    }
    addHarmony(note, octave, clef, harmonyCandidates, numOfNotes = 0) {
        const mainPitch = this.toAbcPitch(note, octave);

        if (harmonyCandidates && harmonyCandidates.length > 0 && numOfNotes > 0) {
        // Shuffle harmonyCandidates and pick up to numOfNotes
        const shuffled = harmonyCandidates
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        const selected = shuffled.slice(0, numOfNotes);
        const group = [mainPitch, ...selected.map(c => this.toAbcPitch(c.note, c.octave))];
        return `[${group.join("")}]`;
        } else {
        return mainPitch;
        }
    }

    assignPitches(rhythm, clef, measureIdx, numOfNotes = 0) {
        const pitches = [];
        for (let i = 0; i < rhythm.length; i++) {
            const currentChord= this.progression[measureIdx % this.progression.length];
            const chordNotes = this.chordMap[currentChord];
            const note = chordNotes[Math.floor(Math.random() * chordNotes.length)];
            const octave = this.getRandomOctaveForClef(note, clef);
            const harmonyCandidates = this.getHarmonyCandidate(note, octave, clef, chordNotes);
            const pitch = this.addHarmony(note, octave, clef, harmonyCandidates, numOfNotes);
            pitches.push(pitch);
        }
        return pitches;
    }

    noteIndex(note) {
      const order = ["C", "D", "E", "F", "G", "A", "B"];
      return order.indexOf(note[0].toUpperCase());
    }
    isLower(note, octave, cmpNote, cmpOctave) {
        return octave < cmpOctave || (octave === cmpOctave && noteIndex(note) < noteIndex(cmpNote));
    }

    // Returns true if (note, octave) is greater than (cmpNote, cmpOctave)
    isHigher(note, octave, cmpNote, cmpOctave) {
        return octave > cmpOctave || (octave === cmpOctave && noteIndex(note) > noteIndex(cmpNote));
    }
    toAbcPitch(note, octave) {
    // ABC reference: C4 = C, C5 = c, C6 = c', C3 = C,
    const noteLetter = note[0].toUpperCase();
    const accidental = note.length > 1 ? note.slice(1) : '';
    let abcNote = noteLetter + accidental;

    if (octave === 4) {
        // Middle C octave, just return as is
        return abcNote;
    } else if (octave > 4) {
        // For each octave above 4, make lowercase and add apostrophes
        abcNote = abcNote.toLowerCase();
        abcNote += "'".repeat(octave - 5);
        return abcNote;
    } else {
        // For each octave below 4, add commas
        abcNote += ",".repeat(4 - octave);
        return abcNote;
    }
  }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export default PitchStrategy;