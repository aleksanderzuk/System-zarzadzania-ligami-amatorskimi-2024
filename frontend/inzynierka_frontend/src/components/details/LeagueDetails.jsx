import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExactContent } from '../../http';
import Cookies from 'js-cookie';
import AssignTeam from '../Assigning/AssignTeams';
import LeagueTable from '../LeagueTable';
import MatchSchedule from '../MatchSchedule';

export default function LeagueDetails() {
  const { id } = useParams(); // Odczytujemy parametr id z URL
  const [league, setLeague] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [modal, setModal] = useState(false);
  const [choice, setChoice] = useState('Tabela');

  useEffect(() => {
    // Funkcja, która będzie wywołana po zamontowaniu komponentu
    async function fetchLeagueDetails() {
        
        try {
            let results = await getExactContent('leagues', id);
            setLeague(results);
            
            const token = Cookies.get('session');
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

    fetchLeagueDetails() // Wywołanie funkcji
    
  }, [id]);


  function handleClick() {
    setModal(true);
  }

  function handleSelect(selectedButton){
    setChoice(selectedButton);

  }

  
  
  return (
    <div className="container mt-4">
      {league.length === 0 ? (
        <h1>Loading</h1>
      ) : (
        <>
          <h1 className='text-center head-text'>{league.name}</h1>
          <section id="choices">
            <menu className='d-flex justify-content-center'>
              <button className={choice==='Tabela' ? 'active' : ''} onClick={()=> handleSelect('Tabela')}>Tabela</button>
              <button className={choice==='Terminarz' ? 'active' : ''} onClick={()=> handleSelect('Terminarz')}>Terminarz</button>
              <button className={choice==='Info' ? 'active' : ''} onClick={()=> handleSelect('Info')}>Info</button>
              <button className={`${choice === 'Dodaj' ? 'active' : ''} ${!isOwner ? 'd-none' : ''}`} onClick={()=> handleSelect('Dodaj')}>Zarządzaj ligą</button>
            </menu>
          </section>
          {choice==='Tabela' ? (
            <LeagueTable leagueId={id}/>
          ) : choice==='Terminarz' ? (
            league && league.teams ? (
              <MatchSchedule leagueId={id} teamsNumber={league.teams.length}/>
            ) : (
              <p>Brak drużyn do wyświetlenia.</p>
            )
          ) : choice==='Info' ? (
            <>
              <p><strong>Data utworzenia:</strong> {new Date(league.created_at).toLocaleDateString()}</p>
              <p><strong>Założona przez: </strong> 
                {league.created_by ? (
                  <Link className='league-link' to={`/players/${league.created_by.id}`}>{league.created_by.username}</Link>
                ) : (
                  'Nieznany'
                )}
              </p>
            </>
          ) : isOwner && choice==='Dodaj'   ? (
            <>
              <button onClick={handleClick} className="btn btn-success">Dodaj drużyny</button> 
              <AssignTeam openModal={modal} closeModal={() => setModal(false)} leagueId={id} />
            </>
          ) : (
            <></>
          )}

            
        </>
      )
      }

      
    </div>
  );
}
