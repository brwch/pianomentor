import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock, faPencil } from '@fortawesome/free-solid-svg-icons';
import NoteQuiz from '../exercises/NoteQuiz';
import { getRandomNoteByDifficulty, getIncorrectNotes } from '../exercises/NoteQuizSets';
import { UserAuth } from '../authentication/AuthContext';
import './NoteQuiz.css';

const NoteRecognition = () => {
  const [initialTimerValue] = useState(5000);
  const [remainingTime, setRemainingTime] = useState(initialTimerValue);
  const { id } = useParams();
  const [correctNote, setCorrectNote] = useState(null);
  const [incorrectNotes, setIncorrectNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(-1);
  const { updateExerciseProgress } = UserAuth();

  const totalQuestions = {
    Easy: 10,
    Medium: 15,
    Hard: 20,
  };

  const getExerciseDetailsById = (exerciseId) => {
    if (['1', '2', '3', '4', '5', '6', '13', '14', '15'].includes(exerciseId)) {
      switch (exerciseId) {
        case '1':
          return { header: "Czytanie nut I", difficulty: "Easy", clef: "treble" };
        case '2':
          return { header: "Czytanie nut II", difficulty: "Medium", clef: "treble" };
        case '3':
          return { header: "Czytanie nut III", difficulty: "Hard", clef: "treble" };
        case '4':
          return { header: "Czytanie nut IV", difficulty: "Easy", clef: "bass" };
        case '5':
          return { header: "Czytanie nut V", difficulty: "Medium", clef: "bass" };
        case '6':
          return { header: "Czytanie nut VI", difficulty: "Hard", clef: "bass" };
        case '13':
          return { header: "Rozpoznanie tonacji I", difficulty: "Easy", clef: "tonality" };
        case '14':
          return { header: "Rozpoznanie tonacji II", difficulty: "Medium", clef: "tonality" };
        case '15':
          return { header: "Rozpoznanie tonacji III", difficulty: "Hard", clef: "tonality" };
        default:
          return { header: "", difficulty: "" };
      }
    }
  };

  const { header, difficulty, clef } = getExerciseDetailsById(id);

  const generateNewQuestion = useCallback(() => {
    setQuestionNumber((prev) => prev + 1);
    setRemainingTime(initialTimerValue);

    const newCorrectNote = getRandomNoteByDifficulty(difficulty, clef);
    setCorrectNote(newCorrectNote);

    const newIncorrectNotes = getIncorrectNotes(newCorrectNote, difficulty, clef, 5);
    setIncorrectNotes(newIncorrectNotes);

    const allNotes = [...newIncorrectNotes, newCorrectNote];
    shuffleArray(allNotes);

    setIncorrectNotes(allNotes);
    setSelectedNote(null);
    setShowNextButton(false);
  }, [clef, difficulty, initialTimerValue]);

  useEffect(() => {
    generateNewQuestion();
  }, [difficulty, generateNewQuestion]);

  useEffect(() => {
    if (remainingTime === 0 && selectedNote === null) {
      handleIncorrectAnswer();
    }
  }, [remainingTime, selectedNote]);

  useEffect(() => {
    let timerInterval;

    if (remainingTime > 0 && selectedNote === null && difficulty === 'Hard') {
      timerInterval = setInterval(() => {
        setRemainingTime((prev) => prev - 10);
      }, 10);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [remainingTime, selectedNote, difficulty]);

  useEffect(() => {
    if (selectedNote !== null) {
      setShowNextButton(true);
      setRemainingTime(0);
    }
  }, [selectedNote, correctNote]);

  const handleNoteSelection = (selected) => {
    if (!selectedNote && remainingTime > 0) {
      setSelectedNote(selected);
      if (selected === correctNote) {
        handleCorrectAnswer();
      } else {
        handleIncorrectAnswer();
      }
    }
  };

  const handleCorrectAnswer = () => {
    setCorrectAnswersCount((prev) => prev + 1);
    setShowNextButton(true);
    setRemainingTime(0);
  };

  const handleIncorrectAnswer = () => {
    setIncorrectAnswersCount((prev) => prev + 1);
    setShowNextButton(true);
    setRemainingTime(0);
  };

  const handleNextQuestion = () => {
    if (questionNumber === totalQuestions[difficulty]) {
      // Jeśli to ostatnie pytanie, zaktualizuj postęp w bazie danych
      updateExerciseProgress(parseInt(id, 10), calculateOverallProgress());
      setQuizCompleted(true);
    } else {
      generateNewQuestion();
    }
  };

  const calculateOverallProgress = () => {
    const totalQuestionsAnswered = correctAnswersCount + incorrectAnswersCount;
    return Math.floor((correctAnswersCount / totalQuestionsAnswered) * 100);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const remainingTimeInSeconds = Math.ceil(remainingTime / 1000);

  return (
    <div className="quiz-tile">
      <div className="quiz-container">
        <div className="header-bar">
          <Link to="/practise" className="back-link">
            <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
          </Link>
          <h2 className="quiz-title">{header}</h2>
        </div>
        {difficulty === 'Hard' && (
          <div className="timer-bar" style={{ width: `${(remainingTime / initialTimerValue) * 100}%` }}></div>
        )}
        {quizCompleted ? (
          <div className="summary-screen">
            <FontAwesomeIcon icon={faPencil} className="summary-icon" />
            <p>Udało Ci się ukończyć ćwiczenie!</p>
            <p className='summary-text'>Twój wynik to <strong>{correctAnswersCount}</strong>/<strong>{totalQuestions[difficulty]}</strong></p>
            <div className="info-bar"></div>
            <button onClick={() => { setQuizCompleted(false); setQuestionNumber(0); setCorrectAnswersCount(0); setIncorrectAnswersCount(0); generateNewQuestion(); }} className="restart-btn">Restart Quiz</button>
          </div>
        ) : (
          <div className="quiz-content">
            <h3 className="question-title">
              {clef === 'tonality' ? 'Zidentyfikuj poprawną tonację:' : 'Zidentyfikuj poprawną nutę:'}
            </h3>
            <NoteQuiz difficulty={difficulty} correctNote={correctNote} clef={clef} onNoteGenerated={() => { }} />
            <div className="options-container six-elements">
              {incorrectNotes.map((note, index) => (
                <div
                  key={index}
                  className={`note-option padding-20 ${selectedNote !== null
                    ? note === correctNote
                      ? 'correct'
                      : note === selectedNote
                        ? 'incorrect'
                        : ''
                    : remainingTime === 0
                      ? note === correctNote
                        ? 'correct'
                        : 'incorrect'
                      : ''
                    }`}
                  onClick={() => handleNoteSelection(note)}
                >
                  {note}
                </div>
              ))}
            </div>
            <div className="info-bar">
              <p className='question-number'>
                <strong>{questionNumber}</strong> z <strong>{totalQuestions[difficulty]}</strong> pytań
              </p>
              <div className="clock-container">
                {difficulty === 'Hard' && remainingTime > 0 && (
                  <div className="clock">
                    <FontAwesomeIcon icon={faClock} className="clock-icon" />:
                    <span className="remaining-time">{remainingTimeInSeconds}s</span>
                  </div>
                )}
              </div>
              {showNextButton && <button onClick={handleNextQuestion} className="next-btn">Next</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteRecognition;
