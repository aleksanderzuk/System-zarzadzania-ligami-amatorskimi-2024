import { useRef, useState, useEffect } from 'react';
import { createContent } from '../http';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'

export default function AddLeague({ openModal, closeModal,  }){
    
    const ref = useRef();
    const leagueNameRef = useRef();
    const navigate = useNavigate();
    useEffect(()=>{
        if(openModal){
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [openModal]);
    
    async function handleSubmit(event){
        const token = Cookies.get('session');
        event.preventDefault();
        if(token){
            try{
                const sessionData = JSON.parse(token);
                const accessToken = sessionData.access;
                console.log(accessToken);
                const responseMessage = await createContent(leagueNameRef.current.value, 'leagues', accessToken);
                console.log('Pomyślnie', responseMessage);
                const leagueId = responseMessage.id;
                navigate(`/leagues/${leagueId}`)

                leagueNameRef.current.value='';
                closeModal();
                
                
            } catch(error){
                console.error('Error', error.message);
                alert('Liga o podanej nazwie już istnieje, albo nazwa jest zbyt długa')
            } finally {
                event.target.reset;
            }
        }
    }

    return(
        <dialog ref={ref} className='result-modal'>
            <h1 className='text-center mb-4'>Dodaj ligę</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        id="leagueName"
                        name='leagueName'
                        type="text"
                        ref={leagueNameRef} 
                        className="form-control"
                        placeholder="Wprowadź nazwę ligi"
                        required
                    />
                </div>
                
                <footer className='d-flex justify-content-between'>
                    <button type='button' onClick={closeModal}> Zamknij </button>
                    <button type='submit'>Dodaj</button>
            </footer>
            </form>
            
        </dialog>
    );

}