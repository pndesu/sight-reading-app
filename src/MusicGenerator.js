class MusicGenerator {
  constructor(timeSignature, progression, chordMap, rhythmStrategy, pitchStrategy, numMeasures) {
    this.timeSignatures = ["2/4", "4/4", "3/4", "6/8"];
    this.rhythmStrategy = rhythmStrategy;
    this.noteDurations = rhythmStrategy.getDurations();
    this.pitchStrategy = pitchStrategy;
    this.timeSignature = timeSignature;
    this.progression = progression;
    this.chordMap = chordMap;
    this.trebleRange = { low: { note: "A", octave: 3 }, high: { note: "G", octave: 6 } };
    this.bassRange = { low: { note: "G", octave: 1 }, high: { note: "F", octave: 4 } };
    this.numMeasures = numMeasures;
  }

    getTotalDuration() {
    const [beats, beatType] = this.timeSignature.split("/").map(Number);
    // duration in quarter notes (beatType 4 means quarter note)
    return this.numMeasures * beats * (4 / beatType);
  }
  

  // generateMeasure(timeSignature, clef, measureIdx, numMeasures) {
  //   const rhythm = this.rhythmStrategy.assignRhythm(timeSignature, clef, numMeasures);
  //   const pitches = this.pitchStrategy.assignPitches(rhythm, clef, measureIdx, numOfNotes);
  //   return { rhythm, pitches };
  // }

  
  getTreblePitch(measureIdx) {
    const chordName = this.progression[measureIdx % this.progression.length];
    const chordNotes = this.chordMap[chordName];
    const note = chordNotes[Math.floor(Math.random() * chordNotes.length)];
    const octave = this.pitchStrategy.getRandomOctaveForClef(note, "treble");
    const harmonyCandidates = this.pitchStrategy.getHarmonyCandidate(note, octave, "treble", chordNotes);
    return this.pitchStrategy.addHarmony(note, octave, "treble", harmonyCandidates);
  }
  getBassPitch(measureIdx) {
    const chordName = this.progression[measureIdx % this.progression.length];
    const chordNotes = this.chordMap[chordName];
    const note = chordNotes[Math.floor(Math.random() * chordNotes.length)];
    const octave = this.pitchStrategy.getRandomOctaveForClef(note, "bass");
    const harmonyCandidates = this.pitchStrategy.getHarmonyCandidate(note, octave, "bass", chordNotes);
    return this.pitchStrategy.addHarmony(note, octave, "bass", harmonyCandidates);
  }
  breakScoreDownToMeasures(rhythm, pitches) {
    const [beats, beatType] = this.timeSignature.split("/").map(Number);
    const notesPerMeasure = beats * (4 / beatType); // Convert to quarter notes
    const measures = [];
    let currentMeasure = { rhythm: [], pitches: [] };
    let currentDuration = 0;

    for (let i = 0; i < rhythm.length; i++) {
        currentMeasure.rhythm.push(rhythm[i]);
        currentMeasure.pitches.push(pitches[i]);
        currentDuration += rhythm[i].value;

        if (currentDuration === notesPerMeasure) {
            measures.push(currentMeasure);
            currentMeasure = { rhythm: [], pitches: [] };
            currentDuration = 0;
        }
    }
    // Handle any remaining notes
    if (currentMeasure.rhythm.length > 0) {
        measures.push(currentMeasure);
    }

    return measures;
  }

  generateScore() {
    
    const totalDuration = this.getTotalDuration();
    const trebleRhythm = this.rhythmStrategy.assignRhythm(this.timeSignature, "treble", totalDuration);
    const treblePitches = this.pitchStrategy.assignPitches(trebleRhythm, "treble", totalDuration);
    const trebleMeasures = this.breakScoreDownToMeasures(trebleRhythm, treblePitches);
    const bassRhythm = this.rhythmStrategy.assignRhythm(this.timeSignature, "bass", totalDuration);
    const bassPitches = this.pitchStrategy.assignPitches(bassRhythm, "bass", totalDuration);
    const bassMeasures = this.breakScoreDownToMeasures(bassRhythm, bassPitches);
    return { treble: trebleMeasures, bass: bassMeasures };
  }
}

export default MusicGenerator;
