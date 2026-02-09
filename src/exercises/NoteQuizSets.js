// Zestaw 1 dla Klucza Wiolinowego: Nuty od A3 do C6 bez znaków chromatycznych
const notesSet1 = [
  'A/3', 'B/3', 'C/4', 'D/4', 'E/4', 'F/4', 'G/4',
  'A/4', 'B/4', 'C/5', 'D/5', 'E/5', 'F/5', 'G/5',
  'A/5', 'B/5', 'C/6'];

const smallNotesSet1 = [
  'C/4', 'D/4', 'E/4', 'F/4', 'G/4',
  'A/4', 'B/4', 'C/5'];

// Zestaw 2 dla klucza Wiolinowego: Nuty od A3 do C6
const notesSet2 = [
  'Ab/3', 'A/3', 'A#/3', 'Bb/3', 'B/3', 'B#/3', 'Cb/4', 'C/4', 'C#/4', 'Db/4', 'D/4', 'D#/4',
  'Eb/4', 'E/4', 'E#/4', 'Fb/4', 'F/4', 'F#/4', 'Gb/4', 'G/4', 'G#/4', 'Ab/4', 'A/4', 'A#/4',
  'Bb/4', 'B/4', 'B#/4', 'Cb/5', 'C/5', 'C#/5', 'Db/5', 'D/5', 'D#/5', 'Eb/5', 'E/5', 'E#/5',
  'Fb/5', 'F/5', 'F#/5', 'Gb/5', 'G/5', 'G#/5', 'Ab/5', 'A/5', 'A#/5', 'Bb/5', 'B/5', 'B#/5',
  'Cb/6', 'C/6', 'C#/6'];

const smallNotesSet2 = [
  'Cb/4', 'C/4', 'C#/4', 'Db/4', 'D/4', 'D#/4',
  'Eb/4', 'E/4', 'E#/4', 'Fb/4', 'F/4', 'F#/4', 'Gb/4', 'G/4', 'G#/4', 'Ab/4', 'A/4', 'A#/4',
  'Bb/4', 'B/4', 'B#/4', 'Cb/5', 'C/5', 'C#/5', 'Db/5', 'D/5', 'D#/5', 'Eb/5', 'E/5', 'E#/5',
  'Fb/5', 'F/5', 'F#/5', 'Gb/5', 'G/5', 'G#/5'];

// Zestaw 3 dla klucza Basowego: Nuty od C2 do E4
const notesSet3 = [
  'C/2', 'D/2', 'E/2', 'F/2', 'G/2', 'A/2',
  'B/2', 'C/3', 'D/3', 'E/3', 'F/3', 'G/3',
  'A/3', 'B/3', 'C/4', 'D/4', 'E/4'];

// Zestaw 4 dla klucza Basowego: Nuty od C2 do E4
const notesSet4 = [
  'C/2', 'D/2', 'E/2', 'F/2', 'G/2', 'A/2',
  'B/2', 'C/3', 'D/3', 'E/3', 'F/3', 'G/3',
  'A/3', 'B/3', 'C/4', 'D/4', 'E/4',
  'C#/2', 'Cb/2', 'D#/2', 'Db/2', 'E#/2', 'Eb/2', 'F#/2', 'Fb/2', 'G#/2', 'Gb/2', 'A#/2', 'Ab/2',
  'B#/2', 'Bb/2', 'C#/3', 'Cb/3', 'D#/3', 'Db/3', 'E#/3', 'Eb/3', 'F#/3', 'Fb/3', 'G#/3', 'Gb/3',
  'A#/3', 'Ab/3', 'B#/3', 'Bb/3', 'C#/4', 'Cb/4', 'D#/4', 'Db/4', 'E#/4', 'Eb/4'];

const noteMapping = {
  'Cb/3': 'B/2',
  'C#/3': 'Db/3',
  'D#/3': 'Eb/3',
  'E#/3': 'F/3',
  'Fb/3': 'E/3',
  'F#/3': 'Gb/3',
  'G#/3': 'Ab/3',
  'A#/3': 'Bb/3',
  'B#/3': 'C/4',

  'Cb/4': 'B/3',
  'C#/4': 'Db/4',
  'D#/4': 'Eb/4',
  'E#/4': 'F/4',
  'Fb/4': 'E/4',
  'F#/4': 'Gb/4',
  'G#/4': 'Ab/4',
  'A#/4': 'Bb/4',
  'B#/4': 'C/5',

  'Cb/5': 'B/4',
  'C#/5': 'Db/5',
  'D#/5': 'Eb/5',
  'E#/5': 'F/5',
  'Fb/5': 'E/5',
  'F#/5': 'Gb/5',
  'G#/5': 'Ab/5',
  'A#/5': 'Bb/5',
  'B#/5': 'C/6',

  'Cb/6': 'B/5',
  'C#/6': 'Db/6',
  'D#/6': 'Eb/6',
  'E#/6': 'F/6',
  'Fb/6': 'E/6',
  'F#/6': 'Gb/6',
  'G#/6': 'Ab/6',
  'A#/6': 'Bb/6',
  'B#/6': 'C/7',
};

const minorTonalities = {
  'C': 'Am',
  'G': 'Em',
  'D': 'Bm',
  'A': 'F#m',
  'E': 'C#m',
  'B': 'G#m',
  'Gb': 'Ebm',
  'Db': 'Bbm',
  'Ab': 'Fm',
  'Eb': 'Cm',
  'Bb': 'Gm',
  'F': 'Dm'
};

const tonalities1 = [
  'C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'
];

const tonalities2 = [
  'C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F',
  'Am', 'Em', 'Bm', 'F#m', 'C#m', 'Ebm', 'G#m', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'
];

const chordMap = {
  'C': ['C', 'E', 'G'],
  'G': ['G', 'B', 'D'],
  'D': ['D', 'Gb', 'A'],
  'E': ['E', 'Ab', 'B'],
  'A': ['A', 'Db', 'E'],
  'B': ['B', 'Eb', 'Gb'],
  'Gb': ['Gb', 'Bb', 'Db'],
  'Db': ['Db', 'F', 'Ab'],
  'Ab': ['Ab', 'C', 'Eb'],
  'Eb': ['Eb', 'G', 'Bb'],
  'Bb': ['Bb', 'D', 'F'],
  'F': ['F', 'A', 'C'],
  'Am': ['A', 'C', 'E'],
  'Em': ['E', 'G', 'B'],
  'Bm': ['B', 'D', 'Gb'],
  'F#m': ['Gb', 'A', 'Db'],
  'C#m': ['Db', 'E', 'Ab'],
  'Ebm': ['Eb', 'Gb', 'Bb'],
  'G#m': ['Ab', 'B', 'Eb'],
  'Bbm': ['Bb', 'Db', 'F'],
  'Fm': ['F', 'Ab', 'C'],
  'Cm': ['C', 'Eb', 'G'],
  'Gm': ['G', 'Bb', 'D'],
  'Dm': ['D', 'F', 'A'],
};

let previousNote = null;

// Funkcja do losowania jednej nuty z danego zestawu
const getRandomNote = (notesArray) => {
  let randomNote;

  do {
    const randomIndex = Math.floor(Math.random() * notesArray.length);
    randomNote = notesArray[randomIndex];
  } while (randomNote === previousNote);

  previousNote = randomNote;

  return randomNote;
};

const getIncorrectNotes = (correctNote, difficulty, clef, count) => {
  const noteSet = clef === "treble" ? (difficulty === 'Easy' ? notesSet1 : notesSet2) : (difficulty === 'Easy' ? notesSet3 : notesSet4);
  const tonalitiesArray = clef === "tonality" ? (difficulty === 'Easy' ? tonalities1 : tonalities2) : [];

  const incorrectNotes = [];

  while (incorrectNotes.length < count) {
    let randomNote;

    if (clef === "tonality") {
      const randomIndex = Math.floor(Math.random() * tonalitiesArray.length);
      randomNote = tonalitiesArray[randomIndex];
    } else {
      const randomIndex = Math.floor(Math.random() * noteSet.length);
      randomNote = noteSet[randomIndex];
    }

    if (
      randomNote !== correctNote &&
      !incorrectNotes.includes(randomNote) &&
      // Sprawdzenie czy nie jest to tonacja odpowiadająca poprawnie wylosowanej
      (minorTonalities[correctNote] !== randomNote || minorTonalities[randomNote] !== correctNote)
    ) {
      incorrectNotes.push(randomNote);
    }
  }

  return incorrectNotes;
};

const getRandomNoteByDifficulty = (difficulty, clef) => {
  if (clef === "tonality") {
    const tonalitiesArray = difficulty === 'Easy' ? tonalities1 : tonalities2;
    return getRandomNote(tonalitiesArray);
  } else {
    const notesArray = clef === "treble" ? (difficulty === 'Easy' ? smallNotesSet1 : smallNotesSet2) : (difficulty === 'Easy' ? notesSet3 : notesSet4);
    return getRandomNote(notesArray);
  }
};

// Funkcja do losowania jednego poprawnego zestawu
const getRandomNoteSet = (difficulty, clef, notesNumber) => {
  const noteSet = [];

  for (let i = 0; i < notesNumber; i++) {
    const correctNote = getRandomNoteByDifficulty(difficulty, clef);
    noteSet.push(correctNote);
  }
  return noteSet;
};

const areNoteSetsEqual = (set1, set2) => {
  if (!Array.isArray(set1) || !Array.isArray(set2) || set1.length !== set2.length) {
    return false;
  }

  return set1.every((note, index) => note === set2[index]);
};

const getIncorrectNoteSets = (correctNoteSet, difficulty, clef, notesNumber) => {
  const noteSet = clef === "treble" ? (difficulty === 'Easy' ? notesSet1 : notesSet2) : (difficulty === 'Easy' ? notesSet3 : notesSet4);

  const incorrectNoteSets = [];

  for (let i = 0; i < 3; i++) {
    let incorrectNotes;

    do {
      incorrectNotes = [correctNoteSet[0]]; // Pierwsza nuta jest taka sama jak w poprawnym zestawie

      for (let j = 1; j < notesNumber; j++) {
        const correctIndex = noteSet.indexOf(correctNoteSet[j]);

        // Określ zakłócenie w indeksie
        const disturbance = Math.floor(Math.random() * (difficulty === 'Easy' ? 2.1 : 5)) + 1;

        // Zastosuj zakłócenie w indeksie, zachowując kierunek
        const disturbedIndex = j % 2 === 0 ? correctIndex + disturbance : correctIndex - disturbance;

        // Ustal indeks, upewniając się, że pozostaje w granicach tablicy
        const newIndex = (disturbedIndex + noteSet.length) % noteSet.length;

        incorrectNotes.push(noteSet[newIndex]);
      } // eslint-disable-next-line no-loop-func
    } while (incorrectNoteSets.some(existingSet => areNoteSetsEqual(existingSet, incorrectNotes)));

    incorrectNoteSets.push(incorrectNotes);
  }

  return incorrectNoteSets;
};

export { notesSet1, notesSet2, tonalities1, tonalities2, minorTonalities, getRandomNote, getRandomNoteByDifficulty, getIncorrectNotes, getRandomNoteSet, getIncorrectNoteSets, noteMapping, chordMap };