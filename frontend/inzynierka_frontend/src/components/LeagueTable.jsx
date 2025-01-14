import React, { useState, useEffect } from 'react';

function LeagueTable({ leagueId }) {
    const [teams, setTeams] = useState([]);
    console.log(teams);
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/sorted_table/${leagueId}/`)
            .then(response => response.json())
            .then(data => setTeams(data))
            .catch(error => console.error('Błąd przy pobieraniu danych:', error));
    }, [leagueId]);

    return (
        <div className="league-table-container">
            <h2 className="head-text">Tabela Ligowa</h2>
            <table className="league-table">
                <thead>
                    <tr>
                        <th>Pozycja</th>
                        <th>Zespół</th>
                        <th>Punkty</th>
                        <th>Bilans bramek</th>
                        <th>Zagrane mecze</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.length > 0 ? (
                        teams.map((team, index) => (
                            <tr key={team.id}>
                                <td>{index + 1}</td>
                                <td>{team.name}</td>
                                <td>{team.points}</td>
                                <td>{team.goals_scored}:{team.goals_conceded}</td>
                                <td>{team.played}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">Brak danych</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default LeagueTable;
