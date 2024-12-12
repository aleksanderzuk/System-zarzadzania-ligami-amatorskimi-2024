import { useState, useEffect, useRef } from 'react';
import { getContent } from '../../http';
import { debounce } from 'lodash'; // Importujemy debouncing z lodash
import { FaSearch } from 'react-icons/fa';
import { assign } from '../../http';


export default function AssignTeam({ openModal, closeModal, leagueId }) {
    const ref = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [teams, setTeams] = useState([]); // Wyniki wyszukiwania drużyn
    const [selectedTeams, setSelectedTeams] = useState([]); // Drużyny dodane do ligi
    

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
        const results = await getContent('teams', query, '&not_assigned=true');
        setTeams(results); // Ustawienie wyników wyszukiwania
        } catch (error) {
        console.error('Błąd przy ściąganiu drużyn:', error);
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
    const handleAddTeam = (team) => {
        if (!selectedTeams.includes(team)) {
        setSelectedTeams([...selectedTeams, team]);
        }
    };

    const handleSave = async () => {
        try {
            // Wywołanie funkcji do przypisania drużyn do ligi
            await assign(leagueId, selectedTeams.map(team => team.id), 'leagues', 'teams');
            console.log('Drużyny zostały przypisane do ligi');
            alert('Dodano drużyny do ligi');
            closeModal(); // Zamknięcie modalu po zapisaniu
            window.location.reload(); 
            

        } catch (error) {
            console.error('Błąd przy przypisywaniu drużyn:', error.message);
            alert('Nie udało się przypisać drużyn do ligi.');
        }
    };

    // Funkcja usuwania drużyny z listy wybranych
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

        {/* Pokazujemy wyniki wyszukiwania */}
        {teams.length===0 ? (
            <>
            </>
        ) : (
            <ul>
            {teams.slice(0,4).map((team) => (
                <li key={team.id}>
                <span>{team.name}</span>
                <button type="button" onClick={() => handleAddTeam(team)}>
                    Dodaj
                </button>
                </li>
            ))}
            </ul>
        )}

        {/* Lista wybranych drużyn */}
        <h3>Wybrane drużyny:</h3>
        <ul>
            {selectedTeams.map((team) => (
            <li key={team.id}>
                <span>{team.name}</span>
                <button type="button" onClick={() => handleRemoveTeam(team.id)}>
                Usuń
                </button>
            </li>
            ))}
        </ul>

        {/* Przycisk "Zapisz" */}
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
