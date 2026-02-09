import React, { useState, useEffect } from 'react';
import './CircleOfFifths.css';
import VF from 'vexflow';
import { minorTonalities } from '../exercises/NoteQuizSets';

const CircleOfFifths = () => {
  const tonalities = [
    'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C'
  ];

  const [selectedTonality, setSelectedTonality] = useState(null);
  const [highlightedTonalities, setHighlightedTonalities] = useState([]);

  useEffect(() => {
    if (selectedTonality) {
      renderKeySignature(selectedTonality);
    }
  }, [selectedTonality]);

  const handleTonalityClick = (tonality) => {
    setSelectedTonality(tonality);
    highlightTonalities(tonality);
  };

  const highlightTonalities = (tonality) => {
    const tonalityIndex = tonalities.indexOf(tonality);
    const highlighted = [
      (tonalityIndex + 1) % 12,
      (tonalityIndex + 2) % 12,
      (tonalityIndex + 3) % 12,
      (tonalityIndex + 4) % 12,
      (tonalityIndex - 1 + 12) % 12,
      (tonalityIndex + 5) % 12
    ];
    setHighlightedTonalities(highlighted);
  };

  const getEnharmonic = (tonality) => {
    const enharmonics = {
      'Db': 'C#',
      'Eb': 'D#',
      'Gb': 'F#',
      'Ab': 'G#',
      'Bb': 'A#',
    };

    if (selectedTonality && ['C', 'G', 'D', 'A', 'E', 'B'].includes(selectedTonality)) {
      return enharmonics[tonality] || tonality;
    }
    // Wyjątek dla Gb
    if (selectedTonality === 'Gb' && tonality === 'B') {
      return 'Cb';
    }

    return tonality;
  };

  const renderTonalityName = (tonality) => {
    return getEnharmonic(tonality);
  };


  const getDegree = (tonality, index) => {
    const tonalityIndex = tonalities.indexOf(tonality);
    let degreeIndex;

    if (tonalityIndex !== -1) {
      degreeIndex = (index === tonalityIndex) ? 1 : (index === (tonalityIndex + 1) % 12) ? 5 : (index === (tonalityIndex + 2) % 12) ? 2 : (index === (tonalityIndex + 3) % 12) ? 6 : (index === (tonalityIndex + 4) % 12) ? 3 : (index === (tonalityIndex - 1 + 12) % 12) ? 4 : (index === (tonalityIndex + 5) % 12) ? 7 : null;
    }

    return degreeIndex;
  };

  const renderKeySignature = (tonality) => {
    const vexContainer = document.getElementById('vex-container');
    vexContainer.innerHTML = '';

    const vf = new VF.Factory({ renderer: { elementId: 'vex-container', width: 125, height: 1 } });
    const div = document.getElementById('vex-container');
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    renderer.resize(110, 120);
    const context = renderer.getContext();

    context.setViewBox(0, -10, 115, 100);
    context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');

    const stave = vf.Stave();
    stave.addClef('treble').addKeySignature(tonality).setContext(context).draw();
  };

  const shouldRenderMolTonality = (tonality, index) => {
    const degree = getDegree(selectedTonality, index);
    return !selectedTonality || 
           (selectedTonality !== tonality && !highlightedTonalities.includes(tonalities.indexOf(tonality))) || 
           degree === null;
  };

  return (
    <div className="circle-container">
      <div className="circle">
        <div className="center-circle">
          <div id="vex-container" />
        </div>
        {tonalities.map((tonality, index) => (
          <div
            key={tonality}
            className={`segment segment-${index + 1} ${selectedTonality === tonality ? 'selected' : ''} ${highlightedTonalities.includes(index) ? 'highlighted' : ''}`}
            onClick={() => handleTonalityClick(tonality)}
          >
            <div className="tonality-name bold">
              {renderTonalityName(tonality)}
            </div>
            {shouldRenderMolTonality(tonality, index) && (
              <div className="tonality-name normal">
                {minorTonalities[tonality]}
              </div>
            )}
            {selectedTonality && (
              <React.Fragment>
                <div className={`degree ${getDegree(selectedTonality, index)}`}>
                  {getDegree(selectedTonality, index)}
                </div>
              </React.Fragment>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircleOfFifths;
