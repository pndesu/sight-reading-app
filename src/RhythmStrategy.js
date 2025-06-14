class RhythmStrategy {
  constructor() {
    this.noteDurations = [];
  }
  getAllRhythmSubdivisions(target = 1, current = [], results = []) {
    // Recursively find all combinations of noteDurations that sum to target
    for (const n of this.noteDurations) {
      const sum = current.reduce((acc, note) => acc + note.value, 0) + n.value;
      if (sum < target) {
        this.getAllRhythmSubdivisions(target, [...current, n], results);
      } else if (sum === target) {
        results.push([...current, n]);
      }
    }
    return results;
  }
  assignRhythm(timeSignature, clef, totalDuration) {
    const beats = Number(timeSignature.split("/")[0]);
    let rhythm = [];
    if (clef === "treble") {
      rhythm = this.getRhythms(timeSignature, totalDuration, beats);
    } else if (clef === "bass") {
      rhythm = this.getRhythms(timeSignature, totalDuration, 1);
    }
    return rhythm;
  }
  getRhythms(timeSignature, totalDuration, target) {
    // const beats = Number(timeSignature.split("/")[0]);
    const rhythm = [];
    const subdivisions = this.getAllRhythmSubdivisions(target);
    let remainingDuration = totalDuration;

    // Fill complete beats
    while (remainingDuration >= target) {
        let group = subdivisions[Math.floor(Math.random() * subdivisions.length)];
        rhythm.push(...group);
        remainingDuration -= target;
    }

    // Handle remaining duration if any
    if (remainingDuration > 0) {
        // Filter noteDurations to only include those that fit in remaining duration
        const availableNotes = this.noteDurations.filter(n => n.value <= remainingDuration);
        
        // Keep adding notes until we fill the remaining duration
        while (remainingDuration > 0 && availableNotes.length > 0) {
            const note = availableNotes[Math.floor(Math.random() * availableNotes.length)];
            rhythm.push(note);
            remainingDuration -= note.value;
        }
    }

    return rhythm;
  }
  getDurations() {
    return this.noteDurations;
  }
}

class RhythmStrategyLevel1 extends RhythmStrategy {
    constructor() {
        super();
        this.noteDurations = [
            { type: "8", value: 4 },
            { type: "4", value: 2 },
            { type: "3", value: 1.5 },
            { type: "2", value: 1 },
    ];
    }
}

export {RhythmStrategyLevel1 };
