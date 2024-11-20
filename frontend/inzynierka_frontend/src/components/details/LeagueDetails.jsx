import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExactContent } from '../../http';


export default function LeagueDetails() {
  const { id } = useParams(); // Odczytujemy parametr id z URL
  const [league, setLeague] = useState([]);
  

  useEffect(() => {
    // Funkcja, która będzie wywołana po zamontowaniu komponentu
    async function fetchLeagueDetails() {
        
        try {
            let results = await getExactContent('leagues', id);
            setLeague(results);
        } catch (error) {
            console.error('Błąd przy ściąganiu danych', error);
        }
    }

    fetchLeagueDetails() // Wywołanie funkcji
    
  }, []);

  console.log(league);
  
  return (
    <div className="container mt-4">
      {league.length === 0 ? (
        <h1>Loading</h1>
      ) : (
        <>
          <h1>{league.name}</h1>
          <p><strong>Data utworzenia:</strong> {new Date(league.created_at).toLocaleDateString()}</p>
          <p><strong>Założona przez: </strong> 
            {league.created_by ? (
              <Link to={`/players/${league.created_by.id}`}>{league.created_by.username}</Link>
            ) : (
              'Nieznany'
            )}
          </p>
          <p><strong>Liczba drużyn:</strong> {league.teams.length}</p>
          <h3>Drużyny w lidze:</h3>
          <ul>
            {league.teams.map((team) => (
              <li key={team.id}><Link to={`/teams/${team.id}`}>{team.name}</Link></li>
            ))}
          </ul>
        </>
      )
      }
    </div>
  );
}
