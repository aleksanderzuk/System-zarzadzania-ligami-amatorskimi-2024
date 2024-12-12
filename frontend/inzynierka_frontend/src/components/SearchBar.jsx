import { useRef, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { getContent } from '../http';

export default function SearchBar( {page, setData, setSearched} ){
   
    const toSubmit = useRef();
    const typed = useRef();
    const submitButton = useRef();

    async function handleSubmit(event, page ){
        
        event.preventDefault();
        let query = typed.current.value;
        event.target.reset();

        try{
            let results = await getContent(page, query);
            setData(results);
            setSearched(prev => prev +1);
        } catch (error) {
            console.error('Error przy ściąganiu danych', error);
        }
    }
    
    useEffect(() => {
        submitButton.current?.click(); 
    }, []); 



    return(
        <>
            <nav className='mt-3 pos-fix'>
                <form onSubmit={(event) => handleSubmit(event, page)} ref={toSubmit} className="border-0 rounded d-flex custom-container-search">
                    <input ref = {typed} className="search form-control holder results" type="search" placeholder="Szukaj" aria-label="Search"/>
                    <button ref = {submitButton} type="submit" className="search btn btn-outline-success ml-2 scale-height" style={{ marginLeft: '5px' }}><FaSearch /></button>
                </form>
            </nav>
        </>
    )
}