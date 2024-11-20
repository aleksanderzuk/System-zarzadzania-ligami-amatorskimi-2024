import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExactContent } from '../../http';

export default function TeamDetails(){
    const { id } = useParams(); // Odczytujemy parametr id z URL
    const [team, setTeam] = useState([]);
    
  
    useEffect(() => {
      // Funkcja, która będzie wywołana po zamontowaniu komponentu
      async function fetchTeamDetails() {
          
          try {
              let results = await getExactContent('teams', id);
              setTeam(results);
          } catch (error) {
              console.error('Błąd przy ściąganiu danych', error);
          }
      }
  
      fetchTeamDetails() // Wywołanie funkcji
      
    }, []);
  
    console.log(team);
    
    return (
    <div className="container mt-4">
        {team.length ===0 ? (
            <h1>Loading...</h1>
        ):(
        <>
            <h1>{team.name}</h1>
            <p><strong>Data utworzenia:</strong> {new Date(team.created_at).toLocaleDateString()}</p>
            <p><strong>Liga:</strong> <Link to = {`/leagues/${team.league.id}`}>{team.league.name}</Link></p>
            <p><strong>Liczba zawodników:</strong> {team.players.length}</p>
            <h3>Zawodnicy w drużynie:</h3>
            <ul>
            {team.players.map((player) => (
                <li key={player.id}>
                    <Link to = {`/players/${player.id}`}>{player.username} - {player.name} {player.surname} ({player.position ? player.position : 'Brak pozycji'}) </Link>
                </li>
            ))}
            </ul>
        </>
        )
    }
      </div>
          
    );
  }