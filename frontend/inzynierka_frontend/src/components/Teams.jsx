import SearchBar from "./SearchBar";
import { useState } from 'react';
import AddTeam from "./AddTeam";
import { IoIosAddCircle } from "react-icons/io";
import Pagination from './Pagination.jsx'

export default function Teams() {
    const [data, setData] = useState([]);  // Zmieniamy na pustą tablicę
    const [searched, setSearched] = useState(0); 

    const [modal, setModal] = useState(false);
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

    function handleClick() {
        setModal(true);
    }


    console.log(data);
    return (
        <div className='container my-3 marg'>
            <h1 className=" head-text text-center">Zespoły</h1>
            <SearchBar setData={setData} page={'teams'} setSearched={setSearched} />

            <div className='row'>
                {data.length !== 0 ? (
                    data.slice(page, page+6).map((team) => (
                        <div className="col-md-4 mb-4" key={team.id}>
                            <div className="card custom-card mt-3 results">
                                <div className="card-body">
                                    <h5 className="card-title league-title">{team.name}</h5>
                                    <p className="card-text league-details">
                                        <strong>Data utworzenia:</strong> {new Date(team.created_at).toLocaleDateString()}<br />
                                        <strong>Liga:</strong> {team.league ? team.league.name : "Nieznana liga"}<br />
                                        <strong>Liczba zawodników:</strong> {team.players ? team.players.length : 0}
                                    </p>
                                </div>
                                <a href={`/teams/${team.id}`} className="btn custom-btn">Zobacz szczegóły</a>
                            </div>
                        </div>
                    ))
                ) : searched === 0 ? (
                    <p className="text-center">Wyszukaj drużynę</p>
                ) : (
                    <p className="text-center">Brak drużyn do wyświetlenia</p>
                )}
            </div>
            <Pagination page={actualPage} handleClickLeft={changePageLeft} handleClickRight={changePageRight}/>
            <h1 className="text-center" onClick={handleClick}><IoIosAddCircle /></h1>
            <AddTeam openModal={modal} closeModal={() => setModal(false)} />   

        </div>
    );
}
