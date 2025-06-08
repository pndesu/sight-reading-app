// ChordProgressionGenerator.test.js
import ChordProgressionGenerator from '../src/ChordProgressionGenerator';

describe('ChordProgressionGenerator', () => {
    let generator;
    let rule ={
            "I": ["I", "ii", "iii", "IV", "V", "vi"],
            "ii": ["ii", "iii", "V"],
            "iii": ["ii", "iii", "vi"],
            "IV": ["I", "IV", "V", "vi"],
            "V": ["I", "IV", "V", "vi"],
            "vi": ["I", "iii", "IV", "V", "vi"],
    };
  beforeEach(() => {
    generator = new ChordProgressionGenerator(rule, "C");
  });
  test('should generate a scale for the given key', () => {
    generator.key = 'C';
    expect(generator.getScale()).toEqual(["C", "D", "E", "F", "G", "A", "B"]);

    generator.key = 'G';
    expect(generator.getScale()).toEqual(["G", "A", "B", "C", "D", "E", "F"]);

    generator.key = 'D';
    expect(generator.getScale()).toEqual(["D", "E", "F", "G", "A", "B", "C"]);

    generator.key = 'A';
    expect(generator.getScale()).toEqual(["A", "B", "C", "D", "E", "F", "G"]);

    generator.key = 'E';
    expect(generator.getScale()).toEqual(["E", "F", "G", "A", "B", "C", "D"]);

    generator.key = 'B';
    expect(generator.getScale()).toEqual(["B", "C", "D", "E", "F", "G", "A"]);

    generator.key = 'F';
    expect(generator.getScale()).toEqual(["F", "G", "A", "B", "C", "D", "E"]);
  });
  test('should generate a chord map for the given key', () => {
    generator.key = 'C';
    generator.progression = ["I", "IV", "V"];
    generator.buildChordMap();
    expect(generator.chordMap).toEqual({
      "I": ["C", "E", "G"],
      "IV": ["F", "A", "C"],
      "V": ["G", "B", "D"],
    });
  });
  test('should generate a valid chord progression', () => {
    const progression = generator.buildProgression();

    // Log the progression
    console.log('Generated Chord Progression:', progression);

    // Check the length of the progression
    expect(progression.length).toBe(4); // Assuming the progression should have 4 chords

    // Check that all chords are valid
    const validChords = ["I", "ii", "iii", "IV", "V", "vi"];
    progression.forEach(chord => {
      expect(validChords).toContain(chord);
    });
  });
});