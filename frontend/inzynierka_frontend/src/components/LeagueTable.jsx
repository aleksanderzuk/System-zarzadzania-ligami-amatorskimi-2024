import React, { useState, useEffect } from 'react';

function LeagueTable({ leagueId }) {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        // Fetch drużyn posortowanych po punktach z danej ligi
        fetch(`http://127.0.0.1:8000/api/sorted_table/${leagueId}/`)
            .then(response => response.json())
            .then(data => setTeams(data))
            .catch(error => console.error('Błąd przy pobieraniu danych:', error));
    }, [leagueId]);
    console.log(teams);
    
    return (
        <div>
            <h2>Tabela Ligowa</h2>
            <table>
                <thead>
                    <tr>
                        <th>Pozycja</th>
                        <th>Zespół</th>
                        <th>Punkty</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.length > 0 ? (
                        teams.map((team, index) => (
                            <tr key={team.id}>
                                <td>{index + 1}</td>
                                <td>{team.name}</td>
                                <td>{team.points}</td>
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
