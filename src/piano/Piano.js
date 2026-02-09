import './Piano.css'
import React, { useState } from 'react';
import PianoScale from './PianoScale';
import PianoKeys from './PianoKeys';
import PianoSettings from './PianoSettings';

export default function Piano({ onNoteSelect, showCheckbox = true,}) {
  const [volume, setVolume] = useState(1);
  const [showKeyNames, setShowKeyNames] = useState(false);

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handleToggleKeyNames = (value) => {
    setShowKeyNames(value);
  };

  return (
    <div className="piano">
      <PianoSettings
        onVolumeChange={handleVolumeChange}
        onToggleKeyNames={handleToggleKeyNames}
        showKeyNames={showKeyNames}
        showCheckbox={showCheckbox}
      />
      <PianoScale showKeyNames={showKeyNames} volume={volume}>
        <div className="piano__top-bar"></div>
        <PianoKeys volume={volume} onNoteSelect={onNoteSelect}/>
      </PianoScale>
    </div>
  );
}