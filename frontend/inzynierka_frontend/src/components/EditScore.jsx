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

        try {
            const data = await patchMatchScore(matchId, { home_score: homeScore, away_score: awayScore });
            updateMatches(data);
            handleClose();
            
        } catch (error) {
            console.error('Błąd przy edytowaniu wyniku:', error);
        }
    };

    return (
        <dialog ref={ref} className='result-modal'>
            <h2 className='head-text text-center'>Edytuj wynik meczu</h2>
            <form onSubmit={handleSubmit} className="score-form">
                <div className="team-score-section">
                    <label className='score-label' htmlFor="homeScore">{homeTeam}</label>
                    <input
                        type="number"
                        min='0'
                        id="homeScore"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        className="form-control score-input"
                        placeholder="Wynik gospodarza"
                        required
                    />
                </div>
                <div className="team-score-section">
                    <label className='score-label' htmlFor="awayScore">{awayTeam}</label>
                    <input
                        type="number"
                        min='0'
                        id="awayScore"
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        className="form-control score-input"
                        placeholder="Wynik gościa"
                        required
                    />
                </div>
                <footer className='d-flex justify-content-between mt-3'>
                    <button type='button' onClick={handleClose} className="btn custom-btn" style={{ backgroundColor: '#12352f' }}>Zamknij</button>
                    <button type='submit' className="btn custom-btn">Zatwierdź</button>
                </footer>
            </form>
        </dialog>
    );
}
