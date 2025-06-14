class AbcNotationParser {
    constructor() {
        this.measures = 4;
        this.quarterNoteDuration = 1;
    }

    // Helper method to check if notes should be tied
    shouldBeTied(notes) {
        let totalDuration = 0;
        for (const note of notes) {
            totalDuration += note.value;
        }
        return totalDuration === this.quarterNoteDuration;
    }

    // Helper method to format tied notes
    formatTiedNotes(notes, pitches) {
        if (notes.length === 1) {
            return `${pitches[0]}${notes[0].type}`;
        }
        
        if (this.shouldBeTied(notes)) {
            // Combine pitches without spaces for tied notes
            return notes.map((note, idx) => `${pitches[idx]}${note.type}`).join('') + ' ';
        }
        
        // Regular notes with spaces
        return notes.map((note, idx) => `${pitches[idx]}${note.type}`).join(' ');
    }

    generateAbcNotation(scoreData, clef, measures = this.measures) {
        let abcString = "";
        const staffData = clef === "treble" ? scoreData.treble : scoreData.bass;
        
        if (staffData.length > 0) {
            abcString += `V:${clef === "treble" ? "1" : "2"} ${clef}\n`;
            let i = 0;
            staffData.forEach((measure, measureIdx) => {
                i++;
                let currentGroup = [];
                let currentPitches = [];
                console.log(measure);
                
                measure.rhythm.forEach((note, idx) => {
                    currentGroup.push(note);
                    currentPitches.push(measure.pitches[idx]);
                    let groupDuration = currentGroup.reduce((sum, n) => sum + n.value, 0);

                    if (groupDuration === this.quarterNoteDuration) {
                        abcString += this.formatTiedNotes(currentGroup, currentPitches);

                        // Add measure bar or line break
                        if (idx === measure.rhythm.length - 1) {
                            if (measureIdx === staffData.length - 1) {
                                abcString += " |]";
                            } else {
                                if (i % measures === 0) {
                                    abcString += " |\n";
                                } else {
                                    abcString += " |";
                                }
                            }
                        } else {
                            abcString += " ";
                        }

                        // Reset groups
                        currentGroup = [];
                        currentPitches = [];
                    } else if (groupDuration > this.quarterNoteDuration) {
                        // If group duration exceeds 1, process all but the last note
                        // (the last note starts a new group)
                        // Process currentGroup except the last note
                        const lastNote = currentGroup.pop();
                        const lastPitch = currentPitches.pop();
                        abcString += this.formatTiedNotes(currentGroup, currentPitches) + " ";

                        // Start new group with the last note
                        currentGroup = [lastNote];
                        currentPitches = [lastPitch];
                    }

                    // If it's the last note and group is not empty, process it
                    if (idx === measure.rhythm.length - 1 && currentGroup.length > 0) {
                        abcString += this.formatTiedNotes(currentGroup, currentPitches);

                        if (measureIdx === staffData.length - 1) {
                            abcString += " |]";
                        } else {
                            if (i % measures === 0) {
                                abcString += " |\n";
                            } else {
                                abcString += " |";
                            }
                        }
                    }
                });
            });
            abcString += "|\n";
        }
        return abcString;
    }

    generateFullScore(scoreData, timeSignature, scoreKey) {
        let abcString = `X:1\nM:${timeSignature}\nL:1/8\nK:${scoreKey}\nQ:1/4=80\n`;
        
        // Add treble clef notes
        abcString += this.generateAbcNotation(scoreData, "treble");
        
        // Add bass clef notes
        abcString += this.generateAbcNotation(scoreData, "bass");
        
        return abcString;
    }
}
export default AbcNotationParser;
