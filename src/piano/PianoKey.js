import React, { useState, useEffect, useCallback, useRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import PianoText from './PianoText';

const PianoKey = ({
  note,
  onStart,
  onStop,
  isFlat,
  isHalfStep,
  octave,
  volume,
  keyName,
  onNoteSelect,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const noteValue = `${note}${octave}`;
  const file = `/sounds/${noteValue}.mp3`;

  const audioRef = useRef(null);

  const play = useCallback(() => {
    if (!isPlaying) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsActive(true);
        onNoteSelect(noteValue);
      });
    }
  }, [isPlaying, volume, onNoteSelect, noteValue]);

  const stop = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsActive(false);
    }
  }, [isPlaying]);

  const handleKeyDown = useCallback((event) => {
    if (event.key.toLowerCase() === keyName.toLowerCase()) {
      play();
    }
  }, [play, keyName]);

  const handleKeyUp = useCallback((event) => {
    if (event.key.toLowerCase() === keyName.toLowerCase()) {
      stop();
      onNoteSelect(noteValue);
    }
  }, [stop, onNoteSelect, noteValue, keyName]);

  useEffect(() => {
    document.addEventListener('mouseup', stop);
    document.addEventListener('touchend', stop);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mouseup', stop);
      document.removeEventListener('touchend', stop);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [stop, handleKeyDown, handleKeyUp]);

  return (
    <li
      onMouseDown={play}
      onMouseUp={stop}
      onTouchStart={play}
      onTouchEnd={stop}
      className={cx({
        flat: isFlat,
        half: isHalfStep,
        active: isActive && isPlaying,
      })}
    >
      <PianoText note={noteValue} isFlat={isFlat} />
      <audio ref={audioRef} src={file} />
    </li>
  );
};

PianoKey.propTypes = {
  note: PropTypes.string,
  onStart: PropTypes.func,
  onStop: PropTypes.func,
  isFlat: PropTypes.bool,
  isHalfStep: PropTypes.bool,
  octave: PropTypes.any,
  volume: PropTypes.number,
  keyName: PropTypes.string,
  onNoteSelect: PropTypes.func,
};

PianoKey.defaultProps = {
  note: 'C',
  onStart: () => { },
  onStop: () => { },
  isFlat: false,
  isHalfStep: false,
  octave: 4,
  volume: 1,
  keyName: '',
  onNoteSelect: () => { },
};

export default PianoKey;
