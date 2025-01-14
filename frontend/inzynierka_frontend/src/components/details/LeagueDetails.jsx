import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExactContent, generateSchedule, deleteLeague, deleteLeagueMatches } from '../../http';
import Cookies from 'js-cookie';
import AssignTeam from '../Assigning/AssignTeams';
import LeagueTable from '../LeagueTable';
import MatchSchedule from '../MatchSchedule';

export default function LeagueDetails() {
  const [matches, setMatches] = useState([]);
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
            console.log(league);
            
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

  useEffect(() => {
          fetch(`http://127.0.0.1:8000/api/league_schedule/${id}`)
              .then(response => response.json())
              .then(data => setMatches(data))
              .catch(error => console.error('Błąd przy pobieraniu terminarza:', error));
      }, [id]);

  function handleClick() {
    setModal(true);
  }

  function handleSelect(selectedButton){
    setChoice(selectedButton);

  }
  async function handleGenerate(){
    try{
        const responseMessage = await generateSchedule(id);
        alert('Wygenerowano terminarz ligowy');
        window.location.reload();

    } catch(error){
        console.error('Error during generating schedule', error.message);
    }
  }
  
  async function handleDelete(){
    try{
      const responseMessage = await deleteLeague(id);
      alert('Usunięto ligę');

    } catch(error){
      console.error('Error during deleting league', error.message);
    }
  }

  async function handleDeleteMatches(){
    try{
      const responseMessage = await deleteLeagueMatches(id);
      alert('Usunięto terminarz meczów')
      window.location.reload();
    }catch(error){
      console.error('Error during deleting matches', error.message);
    }
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
              <MatchSchedule matches={matches} setMatches={setMatches} leagueId={id} teamsNumber={league.teams.length} isOwner={isOwner}/>
            ) : (
              <p>Brak drużyn do wyświetlenia.</p>
            )
          ) : choice==='Info' ? (
            <div className='text-center'>
              <h5><strong>Data utworzenia:</strong> {new Date(league.created_at).toLocaleDateString()}</h5>
              <h5><strong>Założona przez: </strong> 
                {league.created_by ? (
                  <Link className='league-link' to={`/players/${league.created_by.id}`}>{league.created_by.username}</Link>
                ) : (
                  'Nieznany'
                )}
              </h5>
            </div>
          ) : isOwner && choice==='Dodaj'   ? (
            <div className='d-flex justify-content-around'>
              {matches.length<1 ? (
                <>
                <button onClick={handleClick} className="btn custom-button">Dodaj drużyny</button> 
                <button onClick={handleGenerate} className="btn custom-button">Wygeneruj terminarz</button> 
                </>
              ): (
                <button onClick={handleDeleteMatches} className="btn custom-button">Usuń terminarz</button>
              )}
                
              <Link to={'/'}><button onClick={handleDelete} className="btn custom-button">Usun ligę</button> </Link>
              <AssignTeam openModal={modal} closeModal={() => setModal(false)} leagueId={id} />
                {/* dodaj druzyny, usun lige, wyzeruj, ble ble ble. */}
            </div>
          ) : (
            <></>
          )}

            
        </>
      )
      }

      
    </div>
  );
}
