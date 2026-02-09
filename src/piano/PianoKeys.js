import React from 'react';
import PianoKey from './PianoKey';

export default class PianoKeys extends React.Component {
  pianoKeyData = [
    { note: 'C', octave: 3, keyName: 'q', isHalfStep: true },
    { note: 'Db', octave: 3, keyName: '2', isFlat: true },
    { note: 'D', octave: 3, keyName: 'w' },
    { note: 'Eb', octave: 3, keyName: '3', isFlat: true },
    { note: 'E', octave: 3, keyName: 'e' },
    { note: 'F', octave: 3, keyName: 'r', isHalfStep: true },
    { note: 'Gb', octave: 3, keyName: '5', isFlat: true },
    { note: 'G', octave: 3, keyName: 't' },
    { note: 'Ab', octave: 3, keyName: '6', isFlat: true },
    { note: 'A', octave: 3, keyName: 'y' },
    { note: 'Bb', octave: 3, keyName: '7', isFlat: true },
    { note: 'B', octave: 3, keyName: 'u' },

    { note: 'C', octave: 4, keyName: 'i', isHalfStep: true },
    { note: 'Db', octave: 4, keyName: '9', isFlat: true },
    { note: 'D', octave: 4, keyName: 'o' },
    { note: 'Eb', octave: 4, keyName: '0', isFlat: true },
    { note: 'E', octave: 4, keyName: 'p' },
    { note: 'F', octave: 4, keyName: '[', isHalfStep: true },
    { note: 'Gb', octave: 4, keyName: '=', isFlat: true },
    { note: 'G', octave: 4, keyName: ']' },
    { note: 'Ab', octave: 4, keyName: 'a', isFlat: true },
    { note: 'A', octave: 4, keyName: 'z' },
    { note: 'Bb', octave: 4, keyName: 's', isFlat: true },
    { note: 'B', octave: 4, keyName: 'x' },

    { note: 'C', octave: 5, keyName: 'c', isHalfStep: true },
    { note: 'Db', octave: 5, keyName: 'f', isFlat: true },
    { note: 'D', octave: 5, keyName: 'v' },
    { note: 'Eb', octave: 5, keyName: 'g', isFlat: true },
    { note: 'E', octave: 5, keyName: 'b' },
    { note: 'F', octave: 5, keyName: 'n', isHalfStep: true },
    { note: 'Gb', octave: 5, keyName: 'j', isFlat: true },
    { note: 'G', octave: 5, keyName: 'm' },
    { note: 'Ab', octave: 5, keyName: 'k', isFlat: true },
    { note: 'A', octave: 5, keyName: ',' },
    { note: 'Bb', octave: 5, keyName: 'l', isFlat: true },
    { note: 'B', octave: 5, keyName: '.' },

    { note: 'C', octave: 6, keyName: '/', isHalfStep: true },
  ];

  handleNoteSelect = (selectedNote) => {
    const { onNoteSelect } = this.props;
    if (onNoteSelect) {
      onNoteSelect(selectedNote);
    }
  };

  render() {
    const { onStart, onStop, volume } = this.props;

    return (
      <React.Fragment>
        {this.pianoKeyData.map((keyData, index) => (
          <PianoKey
            key={index}
            onStart={onStart}
            onStop={onStop}
            volume={volume}
            onNoteSelect={this.handleNoteSelect}
            {...keyData}
          />
        ))}
      </React.Fragment>
    );
  }
}
