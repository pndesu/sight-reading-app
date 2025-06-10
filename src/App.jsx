import React, { use, useEffect, useState } from "react";
import MusicGenerator from "./MusicGenerator";
import ScoreRenderer from "./ScoreRenderer.jsx";
import { ChordProgressionRule1 } from "./ChordProgressionRule";
import ChordProgressionGenerator from "./ChordProgressionGenerator";
import "./App.css";
import "abcjs/abcjs-audio.css";
function App() {
  const [score, setScore] = useState(null);
  const [timeSignature, setTimeSignature] = useState("4/4");
  const [scoreIndex, setScoreIndex] = useState(0);
  const [measures, setMeasures] = useState(2);
  const [scoreKey, setScoreKey] = useState('C');

  const generateScore = () => {
    const ChordProgressionRule = new ChordProgressionRule1();
    const chordProgressionGenerator = new ChordProgressionGenerator(ChordProgressionRule.getRule(), scoreKey);
    chordProgressionGenerator.buildProgression();
    chordProgressionGenerator.buildChordMap();
    console.log(chordProgressionGenerator.progression, chordProgressionGenerator.chordMap);
    const musicGenerator = new MusicGenerator(chordProgressionGenerator.progression, chordProgressionGenerator.chordMap);
    const generatedScore = musicGenerator.generateScore(measures, timeSignature);
    setScore(generatedScore);
    setScoreIndex((prevIndex) => prevIndex + 1); // Increment key to force re-render
  };
  
  return (
    <div className="App">
      <h2>Sight Reading Practice</h2>
      <div className="controls">
        <label>
          Time Signature:
          <select
            value={timeSignature}
            onChange={(e) => setTimeSignature(e.target.value)}
          >
            <option value="2/4">2/4</option>
            <option value="3/4">3/4</option>
            <option value="4/4">4/4</option>
            <option value="6/8">6/8</option>
          </select>
        </label>
        <label>
          Measures:
          <input type="number" value={measures} onChange={(e) => setMeasures(e.target.value)} />
        </label>
        <label>
          Key:
          <select
            value={scoreKey}
            onChange={(e) => setScoreKey(e.target.value)}
          >
            <option value="C">C</option>
            <option value="G">G</option>
            <option value="D">D</option>
            <option value="A">A</option>
            <option value="E">E</option>
            <option value="B">B</option>
            <option value="F#">F#</option>
            <option value="F">F</option>
            <option value="Bb">Bb</option>
            <option value="Eb">Eb</option>
            <option value="Ab">Ab</option>
            <option value="Db">Db</option>
          </select>
          </label>
        <button onClick={generateScore}>Generate Score</button>
      </div>

      {score && (
        <ScoreRenderer
          key={scoreIndex}
          scoreData={score}
          timeSignature={timeSignature}
          scoreKey={scoreKey}
        />
      )}
    </div>
  );
}

export default App;
