import SearchBar from "./SearchBar";
import { useState } from 'react';
import Pagination from "./Pagination";


export default function Players() {
    const [data, setData] = useState([]); // Pusta tablica na początku
    const [searched, setSearched] = useState(0);

    const [page, setPage] = useState(0);
    const [actualPage, setActualPage] = useState(1);

    function changePageLeft(){
        if(page!==0){
            setPage(prevPage => prevPage-6); // liczby przy prevPage i w data.slice oznaczaja ile ma byc wyswietlanych elementow na stronie
            setActualPage(prevActualPage => prevActualPage-1);
        }
        
    }

    function changePageRight(){
        if(data.length > page+6){
            setPage(prevPage => prevPage+6);
            setActualPage(prevActualPage => prevActualPage+1);
        }
    }

    

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
        <div className='container my-3 marg'>
            <h1 className="head-text text-center">Zawodnicy</h1>
            <SearchBar setData={setData} page={'players'} setSearched={setSearched} />
            <div className='row'>
                {data.length !== 0 ? (
                    data.slice(page, page+6).map((player) => (
                        <div className="col-md-4 mb-4" key={player.id}>
                            <div className="card custom-card mt-3 results">
                                <div className="card-body">
                                    <h5 className="card-title league-title">{player.username}</h5>
                                    <p className="card-text league-details">
                                        <strong>Imię:</strong> {player.name || "Brak imienia"}<br />
                                        <strong>Nazwisko:</strong> {player.surname || "Brak nazwiska"}<br />
                                        <strong>Pozycja:</strong> {convertPosition(player.position)}<br />
                                        <strong>Zespół:</strong> {player.team ? player.team.name : "Brak zespołu"}
                                    </p>
                                    <a href={`/players/${player.id}`} className="btn custom-btn">Zobacz szczegóły</a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : searched === 0 ? (
                    <p className="text-center">Wyszukaj zawodnika</p>
                ) : (
                    <p className="text-center">Brak zawodników do wyświetlenia</p>
                )}
            </div>
            <Pagination page={actualPage} handleClickLeft={changePageLeft} handleClickRight={changePageRight}/>
        </div>
    );
}
