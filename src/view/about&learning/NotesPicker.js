import React, { useRef, useEffect } from 'react';
import Vex from 'vexflow';

const NotesPicker = ({ selectedKey, selectedTonality, selectedSounds }) => {
  const vfRef = useRef(null);

  useEffect(() => {
    if (!selectedKey || !selectedTonality || !selectedSounds || !vfRef.current) {
      return;
    }

    const vfElement = vfRef.current;
    vfElement.innerHTML = '';

    const VF = Vex.Flow;
    const renderer = new VF.Renderer(vfElement, VF.Renderer.Backends.SVG);
    const { Factory } = Vex;
    const vfac = new Factory({
      renderer: {},
    });

    const context = renderer.getContext();
    context.setFont('Arial', 10, '').setBackgroundFillStyle('#fff');

    let staveWidth = selectedSounds.length === 0 ? 130 : selectedSounds.length > 130 ? 130 : 60 + selectedSounds.length * 27;

    const stavePosition = ((300 - staveWidth) / 2);

    const stave = new VF.Stave(stavePosition, 10, staveWidth);

    if (selectedTonality !== 'C' && selectedTonality !== 'Am') {
      staveWidth -= 20;
    }

    stave.addClef(selectedKey).addKeySignature(selectedTonality).setContext(context).draw();

    context.setFont('Arial', 12, '').setBackgroundFillStyle('#fff');

    if (selectedSounds.length > 0) {
      const staveNotes = selectedSounds.map((note) => {
        const staveNote = new VF.StaveNote({ keys: [note], clef: selectedKey, duration: 'q' });

        // Dodanie akcydentalu, jeśli nuta nie jest naturalna
        if (note.includes('b') || note.includes('#')) {
          const accidentalType = note.includes('#') ? '#' : 'b';
          staveNote.addModifier(vfac.Accidental({ type: accidentalType }));
        }

        return staveNote;
      });

      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 }).setStrict(false);
      voice.addTickables(staveNotes);

      new VF.Formatter()
      .joinVoices([voice])
      .format([voice], staveWidth - 50, { spacing_between_keys: 10 });

      voice.draw(context, stave);
    }
  }, [selectedKey, selectedTonality, selectedSounds]);

  return <div ref={vfRef}></div>;
};

export default NotesPicker;
