import SearchBar from "./SearchBar";
import { useState } from 'react';

export default function Teams() {
    const [data, setData] = useState([]);  // Zmieniamy na pustą tablicę
    const [searched, setSearched] = useState(0); 
    console.log(data);
    return (
        <div className='marg'>
            <h1 className="text-center my-4">Zespoły</h1>
            <SearchBar setData={setData} page={'teams'} setSearched={setSearched} />

            <div className='mt-4 container'>
                {data.length !== 0 ? (
                    data.map((team) => (
                        <div className="card mb-4" key={team.id}>
                            <div className="card-body">
                                <h5 className="card-title">{team.name}</h5>
                                <p className="card-text">
                                    <strong>Data utworzenia:</strong> {new Date(team.created_at).toLocaleDateString()}<br />
                                    <strong>Liga:</strong> {team.league ? team.league.name : "Nieznana liga"}<br />
                                    <strong>Liczba zawodników:</strong> {team.players ? team.players.length : 0}
                                </p>
                                <a href={`/teams/${team.id}`} className="btn btn-primary">Zobacz szczegóły</a>
                            </div>
                        </div>
                    ))
                ) : searched === 0 ? (
                    <p className="text-center">Wyszukaj drużynę</p>
                ) : (
                    <p className="text-center">Brak drużyn do wyświetlenia</p>
                )}
            </div>


        </div>
    );
}
