import { useState, useRef, useEffect } from 'react';
import { patchMatchScore } from '../http';
import Cookies from 'js-cookie';

export default function EditScore({ matchId, open, handleClose, currentHomeScore, currentAwayScore, updateMatches, homeTeam, awayTeam }) {
    const ref = useRef();
    const [homeScore, setHomeScore] = useState(currentHomeScore || '');
    const [awayScore, setAwayScore] = useState(currentAwayScore || '');

    useEffect(() => {
        if (open) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Wywołujemy funkcję patchującą wynik meczu
        try {
            const data = await patchMatchScore(matchId, { home_score: homeScore, away_score: awayScore });
            updateMatches(data);  // Aktualizowanie listy meczów na stronie
            handleClose();  // Zamykamy modal
            window.location.reload(); // To powoduje odświeżenie całej strony
        } catch (error) {
            console.error('Błąd przy edytowaniu wyniku:', error);
        }
    };

    return (
        <dialog ref={ref} className='result-modal'>
            <h1 className='text-center mb-4'>Edytuj wynik meczu</h1>
            <form onSubmit={handleSubmit}>
                <div >
                    <h1 className='text-center'>{homeTeam}</h1>
                    <input
                        type="number"
                        min='0'
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        className="form-control"
                        placeholder="Wprowadź wynik gospodarza"
                        required
                    />
                </div>
                <div>
                    <h1 className='text-center'>{awayTeam}</h1>
                    <input
                        type="number"
                        min='0'
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        className="form-control"
                        placeholder="Wprowadź wynik gościa"
                        required
                    />
                </div>
                <footer className='d-flex justify-content-between'>
                    <button type='button' onClick={handleClose}> Zamknij </button>
                    <button type='submit'>Zatwierdź </button>
                </footer>
            </form>
        </dialog>
    );
}
