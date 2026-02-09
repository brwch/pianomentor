import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../../Firebase';
import { useAdminContext } from '../../authentication/AdminContext';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
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

function About() {
    const [isEditing, setIsEditing] = useState(false);
    const [editedHeader, setEditedHeader] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [pageData, setPageData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAdmin } = useAdminContext();

    const fetchData = async () => {
        setIsLoading(true);
        const docRef = doc(db, 'pageContext', 'About');

        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setPageData(data);

                if (data.art1) {
                    setEditedHeader(data.art1[0]);
                    setEditedDescription(data.art1[1]);
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

    const handleEdit = (key) => {
        setIsEditing(true);
        setEditingKey(key);
        setEditedHeader(pageData[key][0]);
        setEditedDescription(pageData[key][1]);
    };

    const handleSave = async () => {
        setIsEditing(false);

        const updatedData = {
            ...pageData,
            [editingKey]: [editedHeader, editedDescription],
        };
        const docRef = doc(db, 'pageContext', 'About');
        await updateDoc(docRef, updatedData);

        setEditingKey(null);
        fetchData();
    };

    const handleCancel = () => {
        setEditedHeader(pageData[editingKey][0]);
        setEditedDescription(pageData[editingKey][1]);
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

        const docRef = doc(db, 'pageContext', 'About');
        await updateDoc(docRef, {
            [key]: deleteField(),
        });

        fetchData();
    };

    const handleAddNew = async () => {
        const newKey = `art${Object.keys(pageData).length + 1}`;
        const updatedData = {
            ...pageData,
            [newKey]: ['Nowy Nagłówek', 'Nowy Opis'],
        };

        const docRef = doc(db, 'pageContext', 'About');
        await updateDoc(docRef, updatedData);

        setPageData(updatedData);
        setIsEditing(true);
        setEditingKey(newKey);
        setEditedHeader('Nowy Nagłówek');
        setEditedDescription('Nowy Opis');
    };

    return (
        <div className="about-container">
            {isLoading ? (
                <div>
                    <FontAwesomeIcon icon={faCircleNotch} spin style={{ fontSize: "3em" }} />
                </div>
            ) : (
                <>
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
                                    </div>
                                ) : (
                                    <>
                                        <h3>{pageData[key][0]}</h3>
                                        <p className='default-left' dangerouslySetInnerHTML={{ __html: pageData[key][1] }} />
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
                </>
            )}
        </div>
    );
}

export default About;
