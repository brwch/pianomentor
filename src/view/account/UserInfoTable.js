import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSortAlphaAsc,
    faSortAlphaDesc,
    faSearch,
    faAngleDoubleLeft,
    faAngleLeft,
    faAngleRight,
    faAngleDoubleRight,
    faCheck,
    faTimes,
    faEdit,
    faCircleNotch,
    faFaceSadTear
} from '@fortawesome/free-solid-svg-icons';
import { UserAuth } from '../../authentication/AuthContext';

const UserInfoTable = ({ users, onSort, forceUpdate }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5);
    const [editedUserId, setEditedUserId] = useState(null);
    const [editedUsername, setEditedUsername] = useState('');
    const { saveEditedUserName } = UserAuth();
    const [inputError, setInputError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Sortowanie danych
        if (sortConfig.key) {
            const sortedUsers = [...filteredUsers].sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });

            setFilteredUsers(sortedUsers);
        }
    }, [sortConfig, filteredUsers, forceUpdate]);

    useEffect(() => {
        // Filtracja danych na podstawie wprowadzonej frazy
        const filteredUsers = users.filter((user) =>
            Object.values(user).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredUsers(filteredUsers);
    }, [searchTerm, users, forceUpdate]);

    const handleSort = (key) => {
        const direction =
            key === sortConfig.key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
        onSort(key, direction);
    };

    const getSortIcon = (column) => {
        if (sortConfig.key === column) {
            return sortConfig.direction === 'asc' ? faSortAlphaAsc : faSortAlphaDesc;
        }
        return null;
    };

    const handleUsersPerPageChange = (event) => {
        const selectedValue = Number(event.target.value);
        setUsersPerPage(selectedValue);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage((prevPage) => {
            const newPageNumber = Math.min(Math.max(pageNumber, 1), totalPages);
            if (prevPage !== newPageNumber) {
                return newPageNumber;
            }
            return prevPage;
        });
    };

    // Logika paginacji
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3; // Maksymalna liczba widocznych stron

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage <= Math.floor(maxVisiblePages / 2)) {
            endPage = maxVisiblePages;
        } else if (currentPage + Math.floor(maxVisiblePages / 2) >= totalPages) {
            startPage = totalPages - maxVisiblePages + 1;
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i}
                </li>
            );
        }

        return pageNumbers;
    };

    const handleEdit = (userId, username, email) => {
        setEditedUserId(userId);
        setEditedUsername(username);
    };

    const handleCancelEdit = () => {
        setEditedUserId(null);
        setEditedUsername('');
    };
    const handleSaveEdit = async () => {
        try {
            if (editedUsername.trim() === '') {
                setInputError(true);
                return; 
            }

            if (editedUserId) {
                setIsLoading(true);

                await saveEditedUserName(editedUserId, editedUsername);
                setEditedUserId(null);
            } else {
                setInputError(true);
            }
            forceUpdate((prev) => prev + 1);
        } catch (error) {
            console.error('Error saving edit in UserInfoTable:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div>
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                    className="search-field"
                    type="text"
                    placeholder="Wyszukaj użytkownika"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label className='choice'>
                    Wyświetlane wiersze:{' '}
                    <select className='select-number' value={usersPerPage} onChange={handleUsersPerPageChange}>
                        <option value={filteredUsers.length}>All</option>
                        <option value={15}>15</option>
                        <option value={10}>10</option>
                        <option value={5}>5</option>
                        <option value={1}>1</option>
                    </select>
                </label>
            </div>

            {filteredUsers.length === 0 && searchTerm !== '' && (
                <p>Nie znaleziono użytkownika.
                    <FontAwesomeIcon className='edit-icon' icon={faFaceSadTear} />
                </p>
            )}

            {filteredUsers.length > 0 && (
                <div>
                    <table className="UserInfoTable">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('uid')}>
                                    UID <FontAwesomeIcon icon={getSortIcon('uid')} />
                                </th>
                                <th onClick={() => handleSort('username')}>
                                    Nazwa <FontAwesomeIcon icon={getSortIcon('username')} />
                                </th>
                                <th onClick={() => handleSort('email')}>
                                    Email <FontAwesomeIcon icon={getSortIcon('email')} />
                                </th>
                                <th onClick={() => handleSort('timeStamp')}>
                                    Data <FontAwesomeIcon icon={getSortIcon('timeStamp')} />
                                </th>
                                <th>Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.uid}>
                                    <td>{user.uid}</td>
                                    <td>
                                        {editedUserId === user.uid ? (
                                            <input
                                                className='change-input'
                                                type="text"
                                                value={editedUsername}
                                                onChange={(e) => setEditedUsername(e.target.value)}
                                            />
                                        ) : (
                                            user.username
                                        )}
                                    </td>
                                    <td>{(user.email)}
                                    </td>
                                    <td>{new Date(user.timeStamp.toDate()).toLocaleDateString()}</td>
                                    <td>
                                        {editedUserId === user.uid ? (
                                            <>
                                                <div className='action-container'>
                                                    <button className='confirm-btn' onClick={handleSaveEdit} disabled={inputError || isLoading}>
                                                        {isLoading ? (
                                                            <FontAwesomeIcon className='edit-icon' icon={faCircleNotch} spin />
                                                        ) : (
                                                            <FontAwesomeIcon className='edit-icon' icon={faCheck} />
                                                        )}
                                                    </button>
                                                    <button className='cancel-btn' onClick={handleCancelEdit}>
                                                        <FontAwesomeIcon className='edit-icon' icon={faTimes} />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <button className='edit-btn' onClick={() => handleEdit(user.uid, user.username, user.email)}>
                                                <FontAwesomeIcon className='edit-icon' icon={faEdit} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ul className="pagination">
                        <li onClick={() => handlePageChange(1)}>
                            <FontAwesomeIcon icon={faAngleDoubleLeft} className='pagination-icon double' />
                        </li>
                        <li onClick={() => handlePageChange(currentPage - 1)}>
                            <FontAwesomeIcon icon={faAngleLeft} className='pagination-icon single' />
                        </li>
                        {renderPageNumbers()}
                        <li onClick={() => handlePageChange(currentPage + 1)}>
                            <FontAwesomeIcon icon={faAngleRight} className='pagination-icon single' />
                        </li>
                        <li onClick={() => handlePageChange(totalPages)}>
                            <FontAwesomeIcon icon={faAngleDoubleRight} className='pagination-icon double' />
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserInfoTable;