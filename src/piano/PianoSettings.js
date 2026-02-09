import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

const PianoSettings = ({ onVolumeChange, onToggleKeyNames, showKeyNames, showCheckbox = true }) => {
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [lastVolume, setLastVolume] = useState(1);

  const handleVolumeChange = (event) => {
    const newVolume = event.target.valueAsNumber;
    setVolume(newVolume);

    if (newVolume === 0 && !muted) {
      // Jeśli wartość głośności wynosi 0 i nie jest wyciszona automatycznie wycisz
      setMuted(true);
      onVolumeChange(0);
    } else if (newVolume > 0 && muted) {
      // Jeśli nowa wartość głośności jest większa niż 0 z wlaczonym wyciszeniem, wyłącz wyciszenie
      setMuted(false);
      setVolume(newVolume);
      onVolumeChange(newVolume ** 2);
    } else {
      // W pozostałych przypadkach aktualizuj głośność normalnie
      setVolume(newVolume);
      onVolumeChange(newVolume ** 2);
    }
  };

  const handleToggleMute = () => {
    setMuted((prevMuted) => !prevMuted);

    if (muted) {
      // Jeżeli był wyciszony przywróć ostatnią wartość
      onVolumeChange(lastVolume ** 2);
      setVolume(lastVolume);
    } else {
      // Jeżeli nie był wyciszony zapisz obecną wartość
      setLastVolume(volume);
      onVolumeChange(0);
      setVolume(0);
    }
  };

  return (
    <div>
      <div className="piano-settings">
        <label className="volume-slider"></label>
        <div className={`icon-container ${muted ? 'volume mute' : 'volume unmute'}`} onClick={handleToggleMute}>
          <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeUp} className={`icon setup`} />
        </div>
        <input
          id="volumeSlider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
        {showCheckbox && (
          <React.Fragment>
            <label className="showKeysLabel">Nazwy Dźwięków</label>
            <div className="switch">
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={showKeyNames}
                  onChange={() => {
                    onToggleKeyNames(!showKeyNames);
                  }}
                />
                <span className="slider"></span>
              </label>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default PianoSettings;
