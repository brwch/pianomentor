import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock, faPencil } from '@fortawesome/free-solid-svg-icons';
import { getRandomNoteByDifficulty, chordMap } from '../exercises/NoteQuizSets';
import { UserAuth } from '../authentication/AuthContext';
import Piano from '../piano/Piano';
import './NoteQuiz.css';

const ChordRecognition = () => {
    const [initialTimerValue] = useState(8000);
    const [remainingTime, setRemainingTime] = useState(initialTimerValue);
    const [timeIsUp, setTimeIsUp] = useState(false);
    const { id } = useParams();
    const [correctNote, setCorrectNote] = useState(null);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(-1);
    const { updateExerciseProgress } = UserAuth();
    const [selectedNotes, setSelectedNotes] = useState({
        note1: null,
        note2: null,
        note3: null,
    });
    const totalQuestions = {
        Easy: 5,
        Medium: 10,
        Hard: 15,
    };

    const getExerciseDetailsById = (exerciseId) => {
        if (['16', '17', '18'].includes(exerciseId)) {
            switch (exerciseId) {
                case '16':
                    return { header: "Akordy I", difficulty: "Easy", clef: "tonality" };
                case '17':
                    return { header: "Akordy II", difficulty: "Medium", clef: "tonality" };
                case '18':
                    return { header: "Akordy III", difficulty: "Hard", clef: "tonality" };
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

        setSelectedNotes({
            note1: null,
            note2: null,
            note3: null,
        });

        setShowNextButton(false);
        setTimeIsUp(false);
    }, [difficulty, clef, initialTimerValue]);
    
    useEffect(() => {
        generateNewQuestion();
    }, [difficulty, generateNewQuestion]);

    useEffect(() => {
        if (remainingTime === 0 && selectedNotes.note3 === null) {
            setTimeIsUp(true);
            handleIncorrectAnswer();
        }
    }, [remainingTime, selectedNotes.note3]);

    useEffect(() => {
        let timerInterval;

        if (remainingTime > 0 && selectedNotes.note3 === null && difficulty === 'Hard') {
            timerInterval = setInterval(() => {
                setRemainingTime((prev) => prev - 10);
            }, 10);
        }
        return () => {
            clearInterval(timerInterval);
        };
    }, [remainingTime, selectedNotes.note3, difficulty]);

    useEffect(() => {
        if (selectedNotes.note3 !== null) {
            setShowNextButton(true);
            setRemainingTime(0);
        }
    }, [selectedNotes, correctNote]);

    const handleNoteSelection = (selectedNote) => {
        if (remainingTime <= 0 || quizCompleted) {
            return;
        }

        const cleanedNote = selectedNote.replace(/\d/g, '');
        const newSelectedNotes = { ...selectedNotes };
        console.log('selected', newSelectedNotes);
        const selectedNotesCount = Object.values(newSelectedNotes).filter(note => note !== null).length;
        console.log('count', selectedNotesCount);

        if (selectedNotesCount < 3) {
            if (!Object.values(newSelectedNotes).includes(cleanedNote)) {
                newSelectedNotes[`note${selectedNotesCount + 1}`] = cleanedNote;
                console.log('new', newSelectedNotes);
                setSelectedNotes(newSelectedNotes);

                if (selectedNotesCount === 2) {
                    // Sprawdź, czy każda zagrana nuta jest różna
                    const areAllDifferent = new Set(Object.values(newSelectedNotes)).size === 3;
                    console.log('different', areAllDifferent);

                    if (areAllDifferent) {
                        // Sprawdź, czy każda zagrana nuta jest poprawna
                        console.log(chordMap[correctNote]);
                        const areAllCorrect = Object.values(newSelectedNotes).every(note => (
                            correctNote !== undefined && (note === correctNote || chordMap[correctNote]?.includes(note))
                        ));
                        console.log('correct', areAllCorrect);

                        if (areAllCorrect) {
                            handleCorrectAnswer();
                        } else {
                            handleIncorrectAnswer();
                        }
                    } else {
                        // Zresetuj wybór nut, jeśli nie są różne
                        setSelectedNotes({});
                    }
                }
            }
        }
    };

    const handleCorrectAnswer = () => {
        setCorrectAnswersCount((prev) => prev + 1);
        setRemainingTime(0);
        setShowNextButton(true);
    };

    const handleIncorrectAnswer = () => {
        setIncorrectAnswersCount((prev) => prev + 1);
        setRemainingTime(0);
        setShowNextButton(true);
    };

    const handleNextQuestion = () => {
        if (questionNumber === totalQuestions[difficulty]) {
            updateExerciseProgress(parseInt(id, 10), calculateOverallProgress());
            setQuizCompleted(true);
        } else {
            generateNewQuestion();
        }
    };

    const SelectedKeys = ({ selectedNotes }) => {
        return (
            <div className="selected-keys-container">
                {Object.values(selectedNotes).map((note, index) => (
                    <div key={index} className={`selected-key ${note !== null ? (chordMap[correctNote]?.includes(note) ? 'correct' : 'incorrect') : ''}`}>
                        <div className='selected-text-align'>
                            {note}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const calculateOverallProgress = () => {
        const totalQuestionsAnswered = correctAnswersCount + incorrectAnswersCount;
        return Math.floor((correctAnswersCount / totalQuestionsAnswered) * 100);
    };

    const remainingTimeInSeconds = Math.ceil(remainingTime / 1000);

    return (
        <div className="chord-recognition-container">
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
                            Zagraj prz pomocy klawiatury fortepianowej wskazany akord:
                        </h3>
                        <div className='selected-chord'>
                            <h2 style={{ marginTop: '14px' }}>{correctNote}</h2>
                        </div>
                        {timeIsUp ? (
                            <div className="selected-keys-container">
                                {chordMap[correctNote].map((note, index) => (
                                    <div key={index} className="selected-key">
                                        <div className='selected-text-align'>
                                            {note}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <SelectedKeys selectedNotes={selectedNotes} />
                        )}
                        <div>
                            <Piano onNoteSelect={handleNoteSelection} showCheckbox={false} />
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

export default ChordRecognition;
