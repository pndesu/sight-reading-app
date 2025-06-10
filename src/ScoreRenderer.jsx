import React, { useEffect, useRef } from "react";
import abcjs from "abcjs";
import AbcNotationParser from "./AbcNotationParser";

const ScoreRenderer = ({ scoreData, timeSignature, scoreKey }) => {
  const containerRef = useRef(null);
  const synthControlRef = useRef(null);
  const abcStringRef = useRef("");
  const playheadRef = useRef(null);
  const synthInstanceRef = useRef(null);
  const abcParser = useRef(new AbcNotationParser());

  useEffect(() => {
    if (!scoreData) return;

    // Generate ABC notation using the new class
    const abcString = abcParser.current.generateFullScore(scoreData, timeSignature, scoreKey);
    abcStringRef.current = abcString;

    // Render the ABC notation and get the visualObj
    const handleNoteClick = (abcElem, tuneNumber, classes, analysis, drag, mouseEvent) => {
      if (abcElem && synthInstanceRef.current && synthInstanceRef.current.timer && synthInstanceRef.current.midiBuffer) {
        // Calculate percent of the note's time in the tune
        const ms = abcElem.currentTrackMilliseconds;
        const totalMs = synthInstanceRef.current.midiBuffer.duration * 1000;
        if (typeof ms === "number" && typeof totalMs === "number" && totalMs > 0) {
          const percent = ms / totalMs;
          synthInstanceRef.current.timer.setProgress(percent);
          synthInstanceRef.current.midiBuffer.seek(percent);
        }
      }
    };

    const visualObjs = abcjs.renderAbc(containerRef.current, abcString, {
      responsive: "resize",
      staffwidth: 700,
      scale: 1.2,
      paddingtop: 20,
      paddingbottom: 20,
      paddingright: 20,
      paddingleft: 20,
      clickListener: handleNoteClick,
    });
    const visualObj = visualObjs[0];

    // Set up audio
    if (visualObj.setUpAudio) visualObj.setUpAudio();

    // Add playhead line to SVG
    const svg = containerRef.current.querySelector("svg");
    let playhead = svg.querySelector("#abcjs-playhead");
    if (!playhead) {
      playhead = document.createElementNS("http://www.w3.org/2000/svg", "line");
      playhead.setAttribute("id", "abcjs-playhead");
      playhead.setAttribute("stroke", "blue");
      playhead.setAttribute("stroke-width", "2");
      playhead.style.display = "none";
      svg.appendChild(playhead);
    }
    playheadRef.current = playhead;

    // Define CursorControl
    const cursorControl = {
      onReady: (synthControl) => {
        synthInstanceRef.current = synthControl;
      },
      onStart: () => {
        if (playheadRef.current) playheadRef.current.style.display = "";
      },
      onFinished: () => {
        if (playheadRef.current) playheadRef.current.style.display = "none";
      },
      onEvent: (event) => {
        if (
          playheadRef.current &&
          event &&
          event.left !== undefined &&
          event.top !== undefined &&
          event.height !== undefined
        ) {
          playheadRef.current.setAttribute("x1", event.left);
          playheadRef.current.setAttribute("x2", event.left);
          playheadRef.current.setAttribute("y1", event.top);
          playheadRef.current.setAttribute("y2", event.top + event.height);
          playheadRef.current.style.display = "";
        } else if (playheadRef.current) {
          playheadRef.current.style.display = "none";
        }
      }
    };

    if (synthControlRef.current) {
      synthControlRef.current.innerHTML = "";
      const synthControl = new abcjs.synth.SynthController();
      synthControl.load(synthControlRef.current, cursorControl, {
        displayRestart: true,
        displayPlay: true,
        displayProgress: true,
        displayWarp: true,
      });
      synthControl.setTune(visualObj, false, {
        chordsOff: true,
      });
    }

  }, [scoreData, timeSignature]);

  return (
    <div className="score-renderer">
        <div ref={containerRef}></div>
        <div ref={synthControlRef} className="synth-control"></div>
    </div>
  );
};

export default ScoreRenderer;
