import { useState, useEffect, useRef } from 'react';
import { getContent } from '../../http';
import { debounce } from 'lodash'; // Importujemy debouncing z lodash
import { FaSearch } from 'react-icons/fa';
import { assign } from '../../http';

export default function AssignPlayer({ openModal, closeModal, teamId }) {
    const ref = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [players, setPlayers] = useState([]); // Wyniki wyszukiwania drużyn
    const [selectedPlayers, setSelectedPlayers] = useState([]); // Drużyny dodane do ligi
    

    useEffect(()=>{
        if(openModal){
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [openModal]);

  // Funkcja do obsługi wyszukiwania drużyn
    const handleSearch = debounce(async (query) => {
        if (!query) return; // Jeśli puste zapytanie, nie wysyłaj zapytania do backendu
        
        try {
            const results = await getContent('players', query, '&not_assigned=true');
            setPlayers(results); // Ustawienie wyników wyszukiwania
        } catch (error) {
            console.error('Błąd przy ściąganiu zawodników:', error);
        } finally {
        
        }
    }, 0); // Debounce ustawiony na 500ms

    // Funkcja obsługująca zmianę w polu wyszukiwania
    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        handleSearch(query); // Wywołanie debounced search function
    };

    // Funkcja dodawania drużyny do listy wybranych
    const handleAddPlayer = (player) => {
        if (!selectedPlayers.includes(player)) {
        setSelectedPlayers([...selectedPlayers, player]);
        }
    };

    const handleSave = async () => {
        try {
            // Wywołanie funkcji do przypisania drużyn do ligi
            await assign(teamId, selectedPlayers.map(team => team.id), 'teams', 'players');
            console.log('Zawodnicy zostali przypisani do drużyny');
            alert('Dodano zawodników do zespołu')
            closeModal(); // Zamknięcie modalu po zapisaniu
            window.location.reload();
        } catch (error) {
            console.error('Błąd przy przypisywaniu zawodników:', error.message);
            alert('Nie udało się przypisać zawodników do drużyny.');
        }
    };

    // Funkcja usuwania drużyny z listy wybranych
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
                    <li key={player.id}>
                    <span>{player.username}</span>
                    <button type="button" onClick={() => handleAddPlayer(player)}>
                        Dodaj
                    </button>
                    </li>
                ))}
                </ul>
            )}

            
            <h3>Wybrani zawodnicy:</h3>
            <ul>
                {selectedPlayers.map((player) => (
                <li key={player.id}>
                    <span>{player.name}</span>
                    <button type="button" onClick={() => handleRemovePlayer(player.id)}>
                    Usuń
                    </button>
                </li>
                ))}
            </ul>

            
            <footer className="d-flex justify-content-between">
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
