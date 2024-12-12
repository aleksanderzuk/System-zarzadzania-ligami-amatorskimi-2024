import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExactContent } from '../../http';
import Cookies from 'js-cookie';
import AssignPlayers from '../Assigning/AssignPlayers';
import TeamSchedule from '../TeamSchedule';

export default function TeamDetails(){
    const { id } = useParams(); // Odczytujemy parametr id z URL
    const [team, setTeam] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [modal, setModal] = useState(false);
  
    useEffect(() => {
        // Funkcja, która będzie wywołana po zamontowaniu komponentu
        async function fetchTeamDetails() {
          try {
            let results = await getExactContent('teams', id);
            setTeam(results);
    
            // Sprawdzamy, czy użytkownik jest właścicielem zespołu
            const token = Cookies.get('session'); // Pobieramy token z ciasteczek
            if (token) {
              const decodedToken = JSON.parse(atob(token.split('.')[1])); // Dekodujemy token JWT
              const userId = decodedToken.user_id; // Z tokenu bierzemy user_id
    
              if (results.created_by.id === userId) {
                setIsOwner(true); // Jeśli id użytkownika i właściciela drużyny się zgadzają, ustawiamy stan isOwner na true
              }
            }
          } catch (error) {
            console.error('Błąd przy ściąganiu danych', error);
          }
        }
    
  
      fetchTeamDetails() // Wywołanie funkcji
      
    }, [id]);
  
    console.log(team);

    function handleClick() {
      setModal(true);
    }
    
    return (
    <div className="container mt-4">
        {team.length ===0 ? (
            <h1>Loading...</h1>
        ):(
        <>
            <h1>{team.name}</h1>
            <p><strong>Data utworzenia:</strong> {new Date(team.created_at).toLocaleDateString()}</p>
            {team.league !==null ? (
                <p><strong>Liga:</strong> <Link to={`/leagues/${team.league.id}`}>{team.league.name}</Link></p>
            ) : (
                <p>Liga nieznana</p> // W przypadku, gdy nie ma ID ligi
            )}
            <p><strong>Liczba zawodników:</strong> {team.players.length}</p>
            <h3>Zawodnicy w drużynie:</h3>
            <ul>
            {team.players.map((player) => (
                <li key={player.id}>
                    <Link to = {`/players/${player.id}`}>{player.username} - {player.name} {player.surname} ({player.position ? player.position : 'Brak pozycji'}) </Link>
                </li>
            ))}
            </ul>
            {isOwner && (
              <>
                <button onClick={handleClick} className="btn btn-success">Dodaj zawodnika</button> 
                <AssignPlayers openModal={modal} closeModal={() => setModal(false)} teamId={id} />
              </>
          )}
        </>
        )
      }
      <TeamSchedule teamId={id}/>
    </div>
          
    );
  }