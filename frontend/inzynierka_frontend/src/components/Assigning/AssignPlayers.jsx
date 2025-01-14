import { useState, useEffect, useRef } from 'react';
import { getContent } from '../../http';
import { debounce } from 'lodash'; 

import { assign } from '../../http';

export default function AssignPlayer({ openModal, closeModal, teamId }) {
    const ref = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [players, setPlayers] = useState([]); 
    const [selectedPlayers, setSelectedPlayers] = useState([]); 
    

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
            const results = await getContent('players', query, '&not_assigned=true');
            setPlayers(results); 
        } catch (error) {
            console.error('Błąd przy ściąganiu zawodników:', error);
        } finally {
        
        }
    }, 0); 

    
    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        handleSearch(query); 
    };

   
    const handleAddPlayer = (player) => {
        if (!selectedPlayers.includes(player)) {
        setSelectedPlayers([...selectedPlayers, player]);
        }
    };

    const handleSave = async () => {
        try {
            
            await assign(teamId, selectedPlayers.map(team => team.id), 'teams', 'players');
            console.log('Zawodnicy zostali przypisani do drużyny');
            alert('Dodano zawodników do zespołu')
            closeModal(); 
            window.location.reload();
        } catch (error) {
            console.error('Błąd przy przypisywaniu zawodników:', error.message);
            alert('Nie udało się przypisać zawodników do drużyny.');
        }
    };

    
    const handleRemovePlayer = (playerId) => {
        setSelectedPlayers(selectedPlayers.filter((player) => player.id !== playerId));
    };

    return (
        <dialog ref={ref} className="result-modal">
            <h1 className="text-center mb-4">Dodaj zawodnika do drużyny</h1>
            <form>
                <div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Szukaj zawodnika"
                />
                <button type="submit" disabled className="d-none"></button>
                </div>
            </form>

            
            {players.length===0 ? (
                <>
                </>
            ) : (
                <ul>
                {players.slice(0,4).map((player) => (
                    <li className='d-flex justify-content-between align-items-center' key={player.id}>
                    <span>{player.username}</span>
                    <button type="button" onClick={() => handleAddPlayer(player)}>
                        Dodaj
                    </button>
                    </li>
                ))}
                </ul>
            )}

            
            <h3 className='mt-4'>Wybrani zawodnicy:</h3>
            <ul>
                {selectedPlayers.map((player) => (
                <li className='d-flex justify-content-between align-items-center' key={player.id}>
                    <span>{player.name}</span>
                    <button type="button" onClick={() => handleRemovePlayer(player.id)}>
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
