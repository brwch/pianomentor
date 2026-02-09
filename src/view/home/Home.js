import React from "react";
import { Link } from 'react-router-dom';
import { UserAuth } from "../../authentication/AuthContext";
import Piano from "../../piano/Piano";
import "./Home.css";

function Home() {
    const { user } = UserAuth();

    return (
        <div className="home-container">
            <div className="home-image-container">
                <div className="image-overlay">
                    {!user && (
                        <div className="welcome-overlay">
                            <div className="welcome-text">
                                <h2>Witaj na PianoMentor!</h2>
                                <p className="home-paragraph">
                                    <Link to="/login" className="home-link">Zaloguj się</Link> lub <Link to="/register" className="home-link">zarejestruj</Link>, aby skorzystać z pełnej funkcjonalności.
                                </p>
                            </div>
                        </div>
                    )}
                    {user && (
                        <div className="welcome-overlay">
                            <div className="welcome-text">
                                <h2>{`Witaj ${user.displayName || ''}!`}</h2>
                                <p className="home-paragraph">
                                    Fajnie, że jesteś z nami! Baw się dobrze ❤️
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <div className="piano-position"><Piano /></div>
                <div>
                    <ul className="home-list">
                        <h3>Instrukcje użytkowania Pianina:</h3>
                        <li className="home-list-item"><strong><font color='#6678db'>1.</font></strong> Możesz zmieniać głośność, korzystając z suwaka po lewej stronie.</li>
                        <li className="home-list-item"><strong><font color='#6678db'>2.</font></strong> Aby wyświetlić nazwy dźwięków, użyj przycisku <span style={{ fontStyle: 'italic' }}>Nazwy Dźwięków</span>.</li>
                        <li className="home-list-item"><strong><font color='#6678db'>3.</font></strong> Klawisze pianina są również przypisane do klawiszy klawiatury, </li>
                        <li className="home-list-item"> więc możesz przestać już klikać!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;
