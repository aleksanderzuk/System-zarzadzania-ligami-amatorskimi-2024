import { useState, useEffect, useRef } from 'react';
import { getContent } from '../../http';
import { debounce } from 'lodash'; 

import { assign } from '../../http';


export default function AssignTeam({ openModal, closeModal, leagueId }) {
    const ref = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [teams, setTeams] = useState([]); 
    const [selectedTeams, setSelectedTeams] = useState([]); 
    

    useEffect(()=>{
        if(openModal){
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [openModal]);

  
    const handleSearch = debounce(async (query) => {
        if (!query) return; 
        
        try {
        const results = await getContent('teams', query, '&not_assigned=true');
        const filteredResults = results.filter(
            (team) => !selectedTeams.some((selected) => selected.id === team.id)
        )
        setTeams(filteredResults); 
        } catch (error) {
        console.error('Błąd przy ściąganiu drużyn:', error);
        } finally {
        
        }
    }, 0); 

   
    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        handleSearch(query); 
    };

    
    const handleAddTeam = (team) => {
        if (!selectedTeams.includes(team)) {
        setSelectedTeams([...selectedTeams, team]);
        }
    };

    const handleSave = async () => {
        try {
            
            await assign(leagueId, selectedTeams.map(team => team.id), 'leagues', 'teams');
            console.log('Drużyny zostały przypisane do ligi');
            alert('Dodano drużyny do ligi');
            closeModal(); 
            window.location.reload(); 
            

        } catch (error) {
            console.error('Błąd przy przypisywaniu drużyn:', error.message);
            alert('Nie udało się przypisać drużyn do ligi.');
        }
    };

    
    const handleRemoveTeam = (teamId) => {
        setSelectedTeams(selectedTeams.filter((team) => team.id !== teamId));
    };

    return (
        <dialog ref={ref} className="result-modal">
        <h1 className="text-center mb-4">Dodaj drużynę do ligi</h1>
        <form>
            <div>
            <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Szukaj drużyny"
            />
            <button type="submit" disabled className="d-none"></button>
            </div>
        </form>

        
        {teams.length===0 ? (
            <>
            </>
        ) : (
            <ul >
            {teams.slice(0,4).map((team) => (
                <li className='d-flex justify-content-between align-items-center' key={team.id}>
                    <h5 className='mt-4'>{team.name}</h5>
                    <button type="button" onClick={() => handleAddTeam(team)}>
                        Dodaj
                    </button>
                </li>
            ))}
            </ul>
        )}

        
        <h3 className='mt-4'>Wybrane drużyny:</h3>
        <ul>
            {selectedTeams.map((team) => (
            <li className='d-flex justify-content-between align-items-center' key={team.id}>
                <h5 className='mt-4'>{team.name}</h5>
                <button type="button" onClick={() => handleRemoveTeam(team.id)}>
                    Usuń
                </button>
            </li>
            ))}
        </ul>

        
        <footer className="d-flex justify-content-between mt-4">
            <button type="button" onClick={closeModal}>
            Zamknij
            </button>
            <button onClick={handleSave} type="button" >
            Zapisz
            </button>
        </footer>
        </dialog>
    );
    }
