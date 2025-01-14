import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExactContent } from '../../http';
import Cookies from 'js-cookie';
import AssignPlayers from '../Assigning/AssignPlayers';
import TeamSchedule from '../TeamSchedule';

export default function TeamDetails(){
    const { id } = useParams(); 
    const [team, setTeam] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [modal, setModal] = useState(false);
    const [choice, setChoice] = useState('Terminarz');
  
    useEffect(() => {
        async function fetchTeamDetails() {
          try {
            let results = await getExactContent('teams', id);
            setTeam(results);
    
            const token = Cookies.get('session'); 
            if (token) {
              const decodedToken = JSON.parse(atob(token.split('.')[1])); 
              const userId = decodedToken.user_id;
              if(results.created_by !== null){
                if (results.created_by.id === userId) {
                  setIsOwner(true); 
                }
              }
            }
          } catch (error) {
            console.error('Błąd przy ściąganiu danych', error);
          }
        }
  
      fetchTeamDetails() 
      
    }, [id]);
  
    function handleClick() {
      setModal(true);
    }

    function handleSelect(selectedButton){
      setChoice(selectedButton);
    }
    
    return (
    <div className="container mt-4">
        {team.length === 0 ? (
            <h1>Loading...</h1>
        ) : (
          <>
            <h1 className='text-center head-text'>{team.name}</h1>
            <section id="choices">
              <menu className="d-flex justify-content-center">
                <button className={choice === 'Terminarz' ? 'active' : ''} onClick={() => handleSelect('Terminarz')}>Terminarz</button>
                <button className={choice === 'Info' ? 'active' : ''} onClick={() => handleSelect('Info')}>Info</button>
                <button className={`${choice === 'Dodaj' ? 'active' : ''} ${!isOwner ? 'd-none' : ''}`} onClick={() => handleSelect('Dodaj')}>Zarządzaj zespołem</button>
              </menu>
            </section>
            {choice === 'Terminarz' ? (
              <TeamSchedule teamId={id}/>
            ) : choice === 'Info' ? (
              <div className='text-center'>
                <h5><strong>Data utworzenia:</strong> {new Date(team.created_at).toLocaleDateString()}</h5>
                {team.league !== null ? (
                    <h5><strong>Liga:</strong> <Link className='league-link' to={`/leagues/${team.league.id}`}>{team.league.name}</Link></h5>
                ) : (
                    <h5>Liga nieznana</h5>
                )}
                
                <h3>Zawodnicy w drużynie:</h3>
                <ul>
                {team.players.map((player) => (
                    <li key={player.id}>
                        <Link className='league-link' to={`/players/${player.id}`}>{player.username} - {player.name} {player.surname} ({player.position ? player.position : 'Brak pozycji'}) </Link>
                    </li>
                ))}
                </ul>
              </div>
            ) : isOwner && choice === 'Dodaj' ? (
              <div className='d-flex justify-content-around'>
                <button onClick={handleClick} className="btn btn-success">Dodaj zawodnika</button> 
                <button onClick={handleClick} className="btn btn-danger">Usun zawodnika</button> 
                <AssignPlayers openModal={modal} closeModal={() => setModal(false)} teamId={id} />
              </div>
            ) : null}
          </>
        )}
    </div>
    );
}
