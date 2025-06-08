class ChordProgressionGenerator {
    constructor(chordProgressionRule, key) {
        this.progression = [];
        this.chordMap = {};
        this.progressionLength = 4;
        this.rule = chordProgressionRule;
        this.key = key;
    }
    buildProgression(){
        this.progression.push("I");
        for (let i = 0; i < this.progressionLength - 1; i++){
            if (i == this.progressionLength - 2) {
                const avaiableChords = this.findChordsFollowI();
                const nextChord = avaiableChords[Math.floor(Math.random() * avaiableChords.length)];
                this.progression.push(nextChord);
            }else{
                const nextChordChoices = this.rule[this.progression[i]];
                this.progression.push(nextChordChoices[Math.floor(Math.random() * nextChordChoices.length)]);
            }
        }
        return this.progression;
    }
    buildChordMap() {
        const key = this.key; // e.g., "C" for C major
        const scale = this.getScale(key); // Get the scale for the key

        this.chordMap = {};
        this.progression.forEach(chord => {
            switch (chord) {
                case "I":
                    this.chordMap["I"] = this.buildTriad(scale[0]);
                    break;
                case "ii":
                    this.chordMap["ii"] = this.buildTriad(scale[1]);
                    break;
                case "iii":
                    this.chordMap["iii"] = this.buildTriad(scale[2]);
                    break;
                case "IV":
                    this.chordMap["IV"] = this.buildTriad(scale[3]);
                    break;
                case "V":
                    this.chordMap["V"] = this.buildTriad(scale[4]);
                    break;
                case "vi":
                    this.chordMap["vi"] = this.buildTriad(scale[5]);
                    break;
                default:
                    console.warn(`Chord ${chord} not recognized.`);
            }
        });
        return this.chordMap;
    }
    getScale() {
        // Define the major scale intervals
        const intervals = [0, 1, 2, 3, 4, 5, 6];
        const notes = ["C", "D", "E", "F", "G", "A", "B"];
        const keyIndex = notes.indexOf(this.key);
        return intervals.map(interval => notes[(keyIndex + interval) % 7]);
    }
    buildTriad(root) {
        // Build a major triad
        const notes = ["C", "D", "E", "F", "G", "A", "B"]; // Natural notes
        const rootIndex = notes.indexOf(root);
        return [
            root,
            notes[(rootIndex + 2) % 7], // Major third
            notes[(rootIndex + 4) % 7]  // Perfect fifth
        ];
    }
    findChordsFollowI() {
        const chords = [];
        for (const key in this.rule) {
            if (this.rule[key].includes("I")) {
                chords.push(key);
            }
        }
        return chords;
    }
    getChordProgression(){
        return this.progression;
    }
}

export default ChordProgressionGenerator;
