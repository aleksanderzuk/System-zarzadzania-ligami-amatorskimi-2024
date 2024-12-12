import React from 'react';
import { getExactContent } from '../http';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

export default function Profile() {
    const [data, setData] = useState([]);
    const [choice, setChoice] = useState('leagues');

    function getUserId() {
        const token = Cookies.get('session');
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); 
            return payload.user_id; 
        } catch (error) {
            console.error('Błąd podczas dekodowania tokenu:', error);
            return null; 
        }
    }

    async function fetchData() {
        const id = getUserId();
        if (id) {
            const results = await getExactContent('players', id);
            setData(results);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    function handleLogout() {
        Cookies.remove('session');
        location.reload();
    }

    function handleLeagues() {
        setChoice('leagues');
    }

    function handleTeams() {
        setChoice('teams');
    }

    return (
        <div className="marg">
            <h1 className="head-text text-center mb-4">Profil</h1>
            <p className="text-center welcome-text">Witaj, {data.username || 'Gościu'}! Twój zespół to: {data.team ? (
                        <Link to={`/teams/${data.team.id}`} className="team-link mx-1">
                            {data.team.name}
                        </Link>
                    ) : (
                        <p className="results">Brak zespołu</p>
                    )} </p>

            <div className="leagues-section my-4 results">
                <h2 className="section-title">Twoje ligi</h2>
                {data.leagues_created?.length > 0 ? (
                    <div className="leagues-list-container">
                        <ul className="leagues-list">
                            {data.leagues_created.map((league) => (
                                <li key={league.id} className="league-item">
                                    <Link to={`/leagues/${league.id}`} className="league-link">
                                        {league.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="no-leagues-message">Nie masz jeszcze stworzonych lig.</p>
                )}
            </div>

            <div className="footer">
                <button onClick={handleLogout} className="btn btn-danger">
                    Wyloguj
                </button>
            </div>
            
        </div>
    );
}
