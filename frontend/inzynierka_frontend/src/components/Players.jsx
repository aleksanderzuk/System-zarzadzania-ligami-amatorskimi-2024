import SearchBar from "./SearchBar";
import { useState } from 'react';



export default function Players() {
    const [data, setData] = useState([]); // Pusta tablica na początku
    const [searched, setSearched] = useState(0);
    console.log(data);

    function convertPosition(position) {
        const positionMap = {
            'br': 'Bramkarz',
            'ob': 'Obrońca',
            'pom': 'Pomocnik',
            'nap': 'Napastnik'
        };
        return positionMap[position] || 'Nieznana pozycja';  // Jeśli nie znajdziesz skrótu, zwróci 'Nieznana pozycja'
    }
    
    

    return (
        <div className='marg'>
            <h1 className="text-center">Zawodnicy</h1>
            <SearchBar setData={setData} page={'players'} setSearched={setSearched} />
            <div className='mt-4 container'>
                {data.length !== 0 ? (
                    data.map((player) => (
                        <div className="card mb-4" key={player.id}>
                            <div className="card-body">
                                <h5 className="card-title">{player.username}</h5>
                                <p className="card-text">
                                    <strong>Imię:</strong> {player.name || "Brak imienia"}<br />
                                    <strong>Nazwisko:</strong> {player.surname || "Brak nazwiska"}<br />
                                    <strong>Pozycja:</strong> {convertPosition(player.position)}<br />
                                    <strong>Zespół:</strong> {player.team ? player.team.name : "Brak zespołu"}
                                </p>
                                <a href={`/players/${player.id}`} className="btn btn-primary">Zobacz szczegóły</a>
                            </div>
                        </div>
                    ))
                ) : searched === 0 ? (
                    <p className="text-center">Wyszukaj zawodnika</p>
                ) : (
                    <p className="text-center">Brak zawodników do wyświetlenia</p>
                )}
            </div>

        </div>
    );
}
