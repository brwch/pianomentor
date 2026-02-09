import React from 'react';

const PianoScale = ({ showKeyNames, children }) => {
  return (
    <div className={`piano__scale ${showKeyNames ? 'show-keys' : 'hide-keys'}`}>
      {children}
    </div>
  );
};

export default PianoScale;
