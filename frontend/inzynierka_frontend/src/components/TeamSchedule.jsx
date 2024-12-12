import React, { useState, useEffect } from 'react';


function TeamSchedule({ teamId }) {
    const [matches, setMatches] = useState([]);

    

    useEffect(() => {
        // Wykonaj zapytanie do API, aby pobrać mecze dla danej ligi
        fetch(`http://127.0.0.1:8000/api/team_schedule/${teamId}`)
            .then(response => response.json())
            .then(data => setMatches(data))
            .catch(error => console.error('Błąd przy pobieraniu terminarza:', error));
    }, [teamId]);
    
    
    return (
        <div>
            <h2>Terminarz Meczów</h2>
            
            <table>
                
                <thead>
                    <tr>
                        <th>Kolejka</th>
                        <th>Data</th>
                        <th>Gospodarz</th>
                        <th>Wynik</th>
                        <th>Gość</th>
                        
                    </tr>
                </thead>
                <tbody>
                    
                    {matches.map((match, index) => (
                        <tr key={match.id}>
                            <td>{index+1}</td> 
                            <td>{new Date(match.match_date).toLocaleDateString()}</td>
                            <td>{match.home_team.name}</td>
                            <td>{match.home_score} - {match.away_score}</td>
                            <td>{match.away_team.name}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TeamSchedule;
