import SearchBar from "./SearchBar";
import { useState } from 'react';
import AddLeague from "./AddLeague";
import { IoIosAddCircle } from "react-icons/io";
import Pagination from "./Pagination";

export default function Leagues() {
    const [data, setData] = useState([]); 
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
            <h1 className="head-text text-center">Ligi</h1>
            <SearchBar setData={setData} page={'leagues'} setSearched={setSearched} />

            <div className='row'>
                {data.length !== 0 ? (
                    data.slice(page, page+6).map((league) => (
                        <div className="col-md-4 mb-4 " key={league.id}>  
                            <div className="card custom-card mt-3 results">
                                <div className="card-body">
                                    <h5 className="card-title league-title">{league.name}</h5>
                                    <p className="card-text league-details">
                                        <strong>Data utworzenia:</strong> {new Date(league.created_at).toLocaleDateString()}<br />
                                        <strong>Założona przez:</strong> {league.created_by.username || "Nieznany"}<br />
                                        <strong>Liczba drużyn:</strong> {league.teams.length}
                                    </p>
                                    <a href={`/leagues/${league.id}`} className="btn custom-btn">Zobacz szczegóły</a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : searched === 0 ? (
                    <p className="text-center">Wyszukaj ligi</p>
                ) : (
                    <p className="text-center">Brak lig do wyświetlenia</p>
                )}
            </div>
            <Pagination page={actualPage} handleClickLeft={changePageLeft} handleClickRight={changePageRight}/>
            <h1 className="text-center" onClick={handleClick}><IoIosAddCircle /></h1>
            <AddLeague openModal={modal} closeModal={() => setModal(false)} />
        </div>
    );
}
