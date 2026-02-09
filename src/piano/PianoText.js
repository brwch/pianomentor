import React from 'react';

const PianoText = ({ note, isFlat }) => {

  const textColor = isFlat ? '#fff' : '#000';
  const fontWeight = isFlat ? 'normal' : 'bold';

  const textStyles = {
    position: 'absolute',
    bottom: '12px', 
    left: '50%',
    transform: 'translateX(-50%)',
    color: textColor,
    fontWeight: fontWeight,
    userSelect: 'none', 
  };

  return <div style={textStyles}>{note}</div>;
};

export default PianoText;
