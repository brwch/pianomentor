import React, { useEffect } from 'react';
import Vex from 'vexflow';

const NoteQuiz = ({ correctNote, onNoteGenerated, clef }) => {
  useEffect(() => {
    if (correctNote) {
      // Usunięcie poprzedniej nuty
      const output = document.getElementById('output');
      output.innerHTML = '';

      const VF = Vex.Flow;
      const { Factory } = Vex;
      const vfac = new Factory({
        renderer: { elementId: 'output', width: 1, height: 10 },
      });
      const div = document.getElementById('output');
      const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

      renderer.resize(110, 100);
      const context = renderer.getContext();

      context.setFont('Arial', 1, '').setBackgroundFillStyle('#eed');

      const stave = new VF.Stave(0, -5, 110);

      // Ustawienie klucza tylko jeśli jest zdefiniowany
      if (clef && clef !== 'tonality') {
        stave.addClef(clef);
      }

      if (clef === 'tonality') {
        stave.addClef('treble').addKeySignature(correctNote);
      }
      stave.setContext(context).draw();

      // Przekazanie wygenerowanej nuty do komponentu nadrzędnego
      onNoteGenerated(correctNote);

      if (clef && clef !== 'tonality') {
        const note = vfac.StaveNote({
          keys: [correctNote],
          duration: 'q',
          align_center: true,
          clef: clef
        });

        if (correctNote.includes('b') || correctNote.includes('#')) {
          const accidentalType = correctNote.includes('#') ? '#' : 'b';
          note.addModifier(vfac.Accidental({ type: accidentalType }));
        }

        let stemDirection;

        if (clef === 'treble') {
          stemDirection = correctNote[correctNote.length - 1] > '4' || ['B/4', 'Bb/4', 'B#/4'].includes(correctNote) ? -1 : 1;
        }

        if (clef === 'bass') {
          const notePitch = parseInt(correctNote.split('/')[1], 10); 
          stemDirection = notePitch < 3 || (notePitch === 3 && ['C', 'Cb', 'C#'].includes(correctNote.split('/')[0])) ? 1 : -1;
        }
        note.setStemDirection(stemDirection);
        
        // Rysowanie nuty
        const voice = new VF.Voice({ num_beats: 1, beat_value: 1 }).setStrict(false);
        voice.addTickables([note]);
        new VF.Formatter().joinVoices([voice]).format([voice], 45);
        voice.draw(context, stave);
      }
    }
  }, [correctNote, onNoteGenerated, clef]);

  return (
    <div>
      <div id="output"></div>
    </div>
  );
};

export default NoteQuiz;
