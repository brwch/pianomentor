import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../../Firebase';
import { tonalities2 } from '../../exercises/NoteQuizSets';
import { useAdminContext } from '../../authentication/AdminContext';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import CircleOfFifths from '../../wheel/CircleOfFifths'
import NotesPicker from './NotesPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave,
    faEdit,
    faPlusCircle,
    faTrashAlt,
    faCancel,
    faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import QuillConfig from './QuillConfig';
import './Learning&About.css';

function Learning() {
    const [isEditing, setIsEditing] = useState(false);
    const [editedHeader, setEditedHeader] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [pageData, setPageData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAdmin } = useAdminContext();
    const [selectedComponent, setSelectedComponent] = useState('None');
    const [selectedKey, setSelectedKey] = useState('treble');
    const [selectedTonality, setSelectedTonality] = useState('C');
    const [selectedSounds, setSelectedSounds] = useState('');
    const [convertedSounds, setConvertedSounds] = useState('');

    const convertNotes = (inputNotes) => {
        if (typeof inputNotes !== 'string') {
            return inputNotes;
        }
        const isValidNote = (note) => /^[A-Ga-g](#|b)?(?:\/(\d))?(\d)?$/.test(note);

        const notesArray = inputNotes.split(/[\s,]+/);
        const convertedNotes = notesArray.map((note) => {
            if (isValidNote(note)) {
                const match = note.match(/([A-Ga-g#b]+)(?:\/(\d))?(\d)?/);
                let noteName = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
                const slashOctave = match[2] ? `/${match[2]}` : (match[3] ? '' : '/4');
                const digitOctave = match[3] ? `/${match[3]}` : '';
                return `${noteName}${slashOctave}${digitOctave}`;
            }
            return null;
        });
    
        return convertedNotes.filter((note) => note !== null);
    };

    const handleComponentTypeChange = (componentType) => {
        setSelectedComponent(componentType);
    };

    const handleKeyChange = (key) => {
        setSelectedKey(key);
    };

    const handleTonalityChange = (tonality) => {
        setSelectedTonality(tonality);
    };

    const handleSoundsChange = (input) => {
        setSelectedSounds(input);
    };

    const fetchData = async () => {
        setIsLoading(true);
        const docRef = doc(db, 'pageContext', 'Learning');

        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setPageData(data);

                if (data.art1) {
                    setEditedHeader(data.art1.header);
                    setEditedDescription(data.art1.description);
                } else {
                    setEditedHeader('Nowy Nagłówek');
                    setEditedDescription('Nowy Opis');
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const converted = convertNotes(selectedSounds);
        setConvertedSounds(converted);
    }, [selectedSounds]);

    const handleEdit = (key) => {
        setIsEditing(true);
        setEditingKey(key);
        setEditedHeader(pageData[key].header);
        setEditedDescription(pageData[key].description);
        setSelectedComponent(pageData[key].component);
        setSelectedKey(pageData[key].key);
        setSelectedTonality(pageData[key].tonality);
        setSelectedSounds(pageData[key].sounds);
    };

    const handleSave = async () => {
        setIsEditing(false);

        const updatedData = {
            ...pageData,
            [editingKey]: {
                header: editedHeader,
                description: editedDescription,
                component: selectedComponent,
                key: selectedKey,
                tonality: selectedTonality,
                sounds: convertedSounds,
            },
        };

        const docRef = doc(db, 'pageContext', 'Learning');
        await updateDoc(docRef, updatedData);

        setEditingKey(null);
        fetchData();
    };

    const handleCancel = () => {
        setEditedHeader(pageData[editingKey].header);
        setEditedDescription(pageData[editingKey].description);
        setIsEditing(false);
        setEditingKey(null);
    };

    const handleDelete = async (key) => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć ten wpis?");
    
        if (!confirmDelete) {
            return;
        }

        const updatedData = { ...pageData };
        delete updatedData[key];
    
        const docRef = doc(db, 'pageContext', 'Learning');
        await updateDoc(docRef, {
            [key]: deleteField(),
        });
    
        fetchData();
    };

    const handleAddNew = async () => {
        const newKey = `art${Object.keys(pageData).length + 1}`;
        const initialKey = 'treble'; // Domyślny klucz
        const initialTonality = 'C'; // Domyślna tonacja
        const initialSounds = ''; // Domyślne dźwięki

        const updatedData = {
            ...pageData,
            [newKey]: {
                header: 'Nowy Nagłówek',
                description: 'Nowy Opis',
                component: 'None',
                key: initialKey,
                tonality: initialTonality,
                sounds: initialSounds,
            },
        };

        const docRef = doc(db, 'pageContext', 'Learning');
        await updateDoc(docRef, updatedData);

        setPageData(updatedData);
        setIsEditing(true);
        setEditingKey(newKey);
        setEditedHeader('Nowy Nagłówek');
        setEditedDescription('Nowy Opis');
        setSelectedComponent('CircleOfFifths');
        setSelectedKey(initialKey);
        setSelectedTonality(initialTonality);
        setSelectedSounds(initialSounds);
    };

    return (
        <div className="about-container">
            {isLoading ? (
                <div>
                    <FontAwesomeIcon icon={faCircleNotch} spin style={{ fontSize: "3em" }} />
                </div>
            ) : (
                <div>
                    {Object.keys(pageData)
                        .filter((key) => key.startsWith('art'))
                        .sort((a, b) => parseInt(a.substring(3)) - parseInt(b.substring(3)))
                        .map((key) => (
                            <section key={key} className="project-section">
                                {isAdmin && isEditing && editingKey === key ? (
                                    <div>
                                        <label className='text-display'>Nagłówek:</label>
                                        <input
                                            className='change-title'
                                            type="text"
                                            id="editedHeader"
                                            value={editedHeader}
                                            onChange={(e) => setEditedHeader(e.target.value)}
                                        />
                                        <label className='text-display'>Opis:</label>
                                        <ReactQuill
                                            value={editedDescription}
                                            onChange={(value) => setEditedDescription(value)}
                                            placeholder={'Twój artykuł . . .'}
                                            modules={QuillConfig}
                                        />
                                        <div className="component-type-selector">
                                            <label className='text-display'>Wybierz komponent:</label>
                                            <select
                                                className='select-option'
                                                value={selectedComponent}
                                                onChange={(e) => handleComponentTypeChange(e.target.value)}
                                            >
                                                <option value="None">Brak</option>
                                                <option value="CircleOfFifths">Koło kwintowe</option>
                                                <option value="NotesPicker">Nuty</option>
                                            </select>
                                            {selectedComponent === 'NotesPicker' && (
                                                <div>
                                                    <label className='text-display'>Wybierz klucz oraz tonację:</label>
                                                    <select
                                                        className='select-option'
                                                        value={selectedKey}
                                                        onChange={(e) => handleKeyChange(e.target.value)}
                                                    >
                                                        <option value="treble">Wiolinowy</option>
                                                        <option value="bass">Basowy</option>
                                                    </select>
                                                    <select
                                                        className='select-option'
                                                        value={selectedTonality}
                                                        onChange={(e) => handleTonalityChange(e.target.value)}
                                                    >
                                                        {tonalities2.map((tonality) => (
                                                            <option key={tonality} value={tonality}>{tonality}</option>
                                                        ))}
                                                    </select>
                                                    <label className='text-display'>Wprowadź dźwięki:</label>
                                                    <p className='desccription'>(oddziel je przecinkiem lub spacją)</p>
                                                    <input
                                                        className='change-title'
                                                        type="text"
                                                        value={selectedSounds}
                                                        onChange={(e) => handleSoundsChange(e.target.value)}
                                                    />
                                                    <label className='text-display'>Przekonwertowane dźwięki:</label>
                                                    <input
                                                        className='change-title'
                                                        type="text"
                                                        readOnly
                                                        value={convertedSounds.join(', ')}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                ) : (
                                    <>
                                        <h3>{pageData[key].header}</h3>
                                        <p className='default-left' dangerouslySetInnerHTML={{ __html: pageData[key].description }} />
                                        {pageData[key].component === 'CircleOfFifths' && pageData[key].component !== 'None' && (
                                            <CircleOfFifths />
                                        )}
                                        {pageData[key].component === 'NotesPicker' && pageData[key].component !== 'None' && (
                                            <NotesPicker
                                                selectedKey={pageData[key].key}
                                                selectedTonality={pageData[key].tonality}
                                                selectedSounds={pageData[key].sounds}
                                            />
                                        )}
                                    </>
                                )}
                                {isAdmin && (
                                    <div className="edit-buttons">
                                        {isEditing && editingKey === key ? (
                                            <>
                                                <button className='edit-buttons accept' onClick={handleSave}>Zapisz Zmiany
                                                    <FontAwesomeIcon icon={faSave} className="icon-setup" />
                                                </button>
                                                <button className='edit-buttons decline' onClick={handleCancel}>Odrzuć Zmiany
                                                    <FontAwesomeIcon icon={faCancel} className="icon-setup" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className='edit-buttons normal' onClick={() => handleEdit(key)}>Edytuj
                                                    <FontAwesomeIcon icon={faEdit} className="icon-setup" />
                                                </button>
                                                <button className='edit-buttons decline' onClick={() => handleDelete(key)}>Usuń
                                                    <FontAwesomeIcon icon={faTrashAlt} className="icon-setup" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </section>
                        ))}
                    {isAdmin && (
                        <div className="add-new-button">
                            <button onClick={handleAddNew}>Dodaj nowy wpis
                                <FontAwesomeIcon icon={faPlusCircle} className="icon-setup" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Learning;
