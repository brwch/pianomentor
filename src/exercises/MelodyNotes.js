import React, { useEffect } from 'react';
import Vex from 'vexflow';

const MelodyNotes = ({ noteSet, containerId }) => {
  useEffect(() => {
    if (!noteSet || !noteSet.length || !containerId) {
      return;
    }

    const melodyContainer = document.getElementById(containerId);
    melodyContainer.innerHTML = '';

    const VF = Vex.Flow;
    const { Factory } = Vex;
    const vfac = new Factory({
      renderer: { elementId: containerId, width: 1, height: 10 },
    });
    const div = document.getElementById(containerId);
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    renderer.resize(260, 120);
    const context = renderer.getContext();

    context.setViewBox(0, -20, 240, 130);
    context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');

    const stave = new VF.Stave(noteSet.length >= 4 ? 30 : 60, -10, noteSet.length >= 4 ? 185 : 130);


    stave.addClef('treble').setContext(context).draw();

    const staveNotes = noteSet.map((note) => {
      const staveNote = new Vex.Flow.StaveNote({ keys: [note], duration: 'w' });

      // Dodanie akcydentalu, jeśli nuta nie jest naturalna
      if (note.includes('b') || note.includes('#')) {
        const accidentalType = note.includes('#') ? '#' : 'b';
        staveNote.addModifier(vfac.Accidental({ type: accidentalType }));
      }

      return staveNote;
    });

    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 }).setStrict(false);
    voice.addTickables(staveNotes);

    new VF.Formatter().joinVoices([voice]).format([voice], noteSet.length >= 4 ? 130 : 80);

    voice.draw(context, stave);
  }, [noteSet, containerId]);

  return (
    <div>
      <div id={containerId}></div>
    </div>
  );
};

export default MelodyNotes;
