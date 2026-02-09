import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPencil, faArrowLeft, faPlayCircle, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { getRandomNoteSet, getIncorrectNoteSets, noteMapping } from '../exercises/NoteQuizSets';
import { UserAuth } from '../authentication/AuthContext';
import MelodyNotes from '../exercises/MelodyNotes';
import './NoteQuiz.css';

const MelodyRecognition = () => {
    const { id } = useParams();
    const [initialTimerValue] = useState(10000);
    const [remainingTime, setRemainingTime] = useState(initialTimerValue);
    const [startTime, setStartTime] = useState(null);
    const [correctNoteSet, setCorrectNoteSet] = useState([]);
    const [incorrectNoteSets, setIncorrectNoteSets] = useState([]);
    const [selectedNoteSet, setSelectedNoteSet] = useState(null);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(-1);
    const { updateExerciseProgress } = UserAuth();
    const [isPlaying, setIsPlaying] = useState(false);

    const [playOnLoad, setPlayOnLoad] = useState(false);

    const totalQuestions = {
        Easy: 8,
        Medium: 10,
        Hard: 15,
    };

    const audioRef = useRef(null);

    const getExerciseDetailsById = (exerciseId) => {
        if (['7', '8', '9', '10', '11', '12'].includes(exerciseId)) {
            switch (exerciseId) {
                case '7':
                    return { header: "Interwały I", difficulty: "Easy", clef: "treble", notesNumber: 2 };
                case '8':
                    return { header: "Interwały II", difficulty: "Medium", clef: "treble", notesNumber: 2 };
                case '9':
                    return { header: "Interwały III", difficulty: "Hard", clef: "treble", notesNumber: 2 };
                case '10':
                    return { header: "Rozpoznanie melodii I", difficulty: "Easy", clef: "treble", notesNumber: 4 };
                case '11':
                    return { header: "Rozpoznanie melodii II", difficulty: "Medium", clef: "treble", notesNumber: 4 };
                case '12':
                    return { header: "Rozpoznanie melodii III", difficulty: "Hard", clef: "treble", notesNumber: 4 };
                default:
                    return { header: "", difficulty: "" };
            }
        }
    };

    const { header, difficulty, clef, notesNumber } = getExerciseDetailsById(id);

    const generateNewQuestion = useCallback(() => {
        setQuestionNumber((prev) => prev + 1);
        setRemainingTime(initialTimerValue);
        setStartTime(null);

        const newCorrectNoteSet = getRandomNoteSet(difficulty, clef, notesNumber);
        setCorrectNoteSet(newCorrectNoteSet);

        const newIncorrectNoteSets = getIncorrectNoteSets(newCorrectNoteSet, difficulty, clef, notesNumber);
        setIncorrectNoteSets(newIncorrectNoteSets);

        const allNoteSets = [...newIncorrectNoteSets, newCorrectNoteSet];
        shuffleArray(allNoteSets);

        setIncorrectNoteSets(allNoteSets);
        setSelectedNoteSet(null);
        setShowNextButton(false);
    }, [clef, difficulty, initialTimerValue, notesNumber]);

    useEffect(() => {
        generateNewQuestion();
    }, [difficulty, generateNewQuestion]);

    useEffect(() => {
        if (remainingTime === 0 && selectedNoteSet === null) {
            handleIncorrectAnswer();
        }
    }, [remainingTime, selectedNoteSet]);

    useEffect(() => {
        let timerInterval;

        if (startTime !== null && remainingTime > 0 && selectedNoteSet === null && difficulty === 'Hard') {
            timerInterval = setInterval(() => {
                setRemainingTime((prev) => prev - 10);
            }, 10);
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [remainingTime, selectedNoteSet, difficulty, startTime]);

    useEffect(() => {
        if (selectedNoteSet !== null) {
            setShowNextButton(true);
            setRemainingTime(0);
        }
    }, [selectedNoteSet, correctNoteSet]);

    useEffect(() => {
        return () => {
            stopPlaying(); // Zatrzymaj odtwarzanie po opuszczeniu komponentu
        };
    }, []);

    useEffect(() => {
        stopPlaying(); // Zatrzymaj odtwarzanie po przejściu do następnego pytania
    }, [questionNumber]);

    const playCorrectNoteSet = useCallback(() => {
        stopPlaying(); // Zatrzymaj odtwarzanie, jeśli już trwa

        setIsPlaying(true);

        const playNote = (index) => {
            if (index < correctNoteSet.length) {
                const note = correctNoteSet[index];
                const mappedNote = noteMapping[note] || note;

                const audio = new Audio(`/sounds/${mappedNote.replace('/', '')}.mp3`);
                audioRef.current = audio;
                audio.play();

                audio.addEventListener('ended', () => {
                    playNote(index + 1);
                });
            } else {
                setIsPlaying(false);
            }
        };

        playNote(0);
    }, [correctNoteSet]);
    
    useEffect(() => {
        if (playOnLoad) {
            setPlayOnLoad(false);
            playCorrectNoteSet();
        }
    }, [playOnLoad, playCorrectNoteSet]);

    const handleNoteSetSelection = (selected) => {
        if (!selectedNoteSet && remainingTime > 0) {
            setSelectedNoteSet(selected);
            if (areNoteSetsEqual(selected, correctNoteSet)) {
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
        stopPlaying();
        if (questionNumber === totalQuestions[difficulty]) {
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

    const areNoteSetsEqual = (set1, set2) => {
        if (!Array.isArray(set1) || !Array.isArray(set2) || set1.length !== set2.length) {
            return false;
        }

        return set1.every((note, index) => note === set2[index]);
    };

    const stopPlaying = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handlePlayButtonClick = () => {
        if (!isPlaying) {
            playCorrectNoteSet();
            if (difficulty === 'Hard' && startTime === null) {
                setStartTime(Date.now());
            }
        } else {
            stopPlaying();
        }
    };

    console.log("correctNoteSet:", correctNoteSet);
    console.log("incorrectNoteSets:", incorrectNoteSets);

    return (
        <div className="melody-recognition-container">
            <div className="quiz-container">
                <div className="header-bar">
                    <Link to="/practise" className="back-link">
                        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
                    </Link>
                    <h2 className="quiz-title">{header}</h2>
                </div>
                {difficulty === 'Hard' && (
                    <div className={`timer-bar ${startTime === null ? 'gray' : ''}`} style={{ width: `${(remainingTime / initialTimerValue) * 100}%` }}></div>
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
                        <h3 className="question-title">Posłuchaj nagrania i oznacz odpowiadające mu nuty.</h3>
                        <div className="options-container">
                            <button
                                className={`play-btn ${isPlaying ? 'playing' : ''}`}
                                onClick={handlePlayButtonClick}
                            >
                                <FontAwesomeIcon icon={isPlaying ? faStopCircle : faPlayCircle} className='play-icon' />
                            </button>
                        </div>
                        <div className="options-container four-elements">
                            {incorrectNoteSets.map((noteSet, index) => (
                                <div
                                    key={index}
                                    className={`note-option padding-0 ${selectedNoteSet !== null
                                        ? areNoteSetsEqual(noteSet, correctNoteSet)
                                            ? 'correct'
                                            : areNoteSetsEqual(noteSet, selectedNoteSet)
                                                ? 'incorrect'
                                                : ''
                                        : remainingTime === 0
                                            ? areNoteSetsEqual(noteSet, correctNoteSet)
                                                ? 'correct'
                                                : 'incorrect'
                                            : ''
                                        }`}
                                    onClick={() => handleNoteSetSelection(noteSet)}
                                >
                                    <MelodyNotes noteSet={noteSet} containerId={`melody-${index}`} />
                                </div>
                            ))}
                        </div>
                        <div className="info-bar">
                            <p className='question-number'>
                                <strong>{questionNumber}</strong> z <strong>{totalQuestions[difficulty]}</strong> pytań
                            </p>
                            <div className="clock-container">
                                {difficulty === 'Hard' && remainingTime > 0 && (
                                    <div className={`clock ${startTime === null ? 'gray' : ''}`}>
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

export default MelodyRecognition;
