import SearchBar from "./SearchBar"
import { useState } from 'react';

export default function Leagues() {
    const [data, setData] = useState([]); 
    const [searched, setSearched] = useState(0); 

    console.log(data); 

    return (
        <div className='marg'>
            <h1 className="text-center my-4">Ligi</h1>
            <SearchBar setData={setData} page={'leagues'} setSearched={setSearched} />

            <div className='mt-4 container'>
                {/* Sprawdzamy warunek searched */}
                {data.length!== 0 ?(
                    data.map((league) => (
                        <div className="card mb-4" key={league.id}>  
                            <div className="card-body">
                                <h5 className="card-title">{league.name}</h5>
                                <p className="card-text">
                                    <strong>Data utworzenia:</strong> {new Date(league.created_at).toLocaleDateString()}<br />
                                    <strong>Założona przez:</strong> {league.created_by.username || "Nieznany"}<br />
                                    <strong>Liczba drużyn:</strong> {league.teams.length}
                                </p>
                                <a href={`/leagues/${league.id}`} className="btn btn-primary">Zobacz szczegóły</a>
                            </div>
                        </div>
                    ))
                ): searched===0 ? (
                    <p className="text-center">Wyszukaj ligi</p>
                ):(
                    <p className="text-center">Brak lig do wyświetlenia</p>
                )}
            </div>
        </div>
    );
}
