import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import EditScore from './EditScore'; // Zaimportuj nowy komponent modalny

function MatchSchedule({ leagueId, teamsNumber }) {
    const [matches, setMatches] = useState([]);
    const [page, setPage] = useState(0);
    const [actualPage, setActualPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    useEffect(() => {
        // Wykonaj zapytanie do API, aby pobrać mecze dla danej ligi
        fetch(`http://127.0.0.1:8000/api/league_schedule/${leagueId}`)
            .then(response => response.json())
            .then(data => setMatches(data))
            .catch(error => console.error('Błąd przy pobieraniu terminarza:', error));
    }, [leagueId]);

    function changePageLeft() {
        if (page !== 0) {
            setPage(prevPage => prevPage - (teamsNumber / 2)); // liczby przy prevPage i w data.slice oznaczają ile ma być wyświetlanych elementów na stronie
            setActualPage(prevActualPage => prevActualPage - 1);
        }
    }

    function changePageRight() {
        if (matches && matches.length > page + (teamsNumber / 2)) {
            setPage(prevPage => prevPage + (teamsNumber / 2));
            setActualPage(prevActualPage => prevActualPage + 1);
        }
    }

    const handleEditClick = (match) => {
        setSelectedMatch(match);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedMatch(null);
    };

    const updateMatches = (updatedMatch) => {
        setMatches(matches.map(match => match.id === updatedMatch.id ? updatedMatch : match));
    };
    
    return (
        <div>
            <h2>Terminarz Meczów</h2>
            <h1>Kolejka: {actualPage}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Gospodarz</th>
                        <th>Wynik</th>
                        <th>Gość</th>
                        <th>Akcja</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.slice(page, page + (teamsNumber / 2)).map((match) => (
                        <tr key={match.id}>
                            <td>{new Date(match.match_date).toLocaleDateString()}</td>
                            <td>{match.home_team.name}</td>
                            <td>{match.home_score} - {match.away_score}</td>
                            <td>{match.away_team.name}</td>
                            <td>
                                <button onClick={() => handleEditClick(match)} className="btn btn-warning">Edytuj wynik</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination page={actualPage} handleClickLeft={changePageLeft} handleClickRight={changePageRight} />
            {selectedMatch && (
                <EditScore
                    matchId={selectedMatch.id}
                    open={modalOpen}
                    handleClose={handleModalClose}
                    currentHomeScore={selectedMatch.home_score}
                    currentAwayScore={selectedMatch.away_score}
                    updateMatches={updateMatches}
                    homeTeam={selectedMatch.home_team.name}
                    awayTeam={selectedMatch.away_team.name}
                />
            )}
        </div>
    );
}

export default MatchSchedule;
