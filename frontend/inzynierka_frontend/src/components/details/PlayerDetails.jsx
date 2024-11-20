import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExactContent } from '../../http';

export default function PlayerDetails(){
    const { id } = useParams(); // Odczytujemy parametr id z URL
    const [player, setPlayer] = useState([]);
    
  
    useEffect(() => {
      // Funkcja, która będzie wywołana po zamontowaniu komponentu
      async function fetchPlayerDetails() {
          
          try {
              let results = await getExactContent('players', id);
              setPlayer(results);
          } catch (error) {
              console.error('Błąd przy ściąganiu danych', error);
          }
      }
  
      fetchPlayerDetails() // Wywołanie funkcji
      
    }, []);
  
    function positionConverter(position) {
        const positionMap = {
          'br': 'Bramkarz',
          'ob': 'Obrońca',
          'po': 'Pomocnik',
          'na': 'Napastnik',
        };
        return positionMap[position] || 'Nieznana pozycja';
      }


    console.log(player);
    
    return (
    <div className="container mt-4">
        <h1>{player.name} {player.surname}</h1>
        <p><strong>Pozycja:</strong> {player.position ? positionConverter(player.position) : 'Nieokreślona'}</p>
        <p><strong>Username:</strong> {player.username}</p>
        <p><strong>Drużyna:</strong> {player.team ? <Link to={`/teams/${player.team.id}`}>{player.team.name} </Link> : 'Brak drużyny'}</p>
        <p><strong>Rola:</strong> {player.is_admin ? 'Administrator' : 'Zawodnik'}</p>
      </div>
    );
  }