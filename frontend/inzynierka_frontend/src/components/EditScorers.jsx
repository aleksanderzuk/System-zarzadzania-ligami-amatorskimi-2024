import { useState, useRef, useEffect } from 'react';
import { updatePlayerGoals } from '../http';
import Cookies from 'js-cookie';

export default function EditScorers({ open, handleClose, homeScore, awayScore, homeTeamPlayers, awayTeamPlayers }) {
    const ref = useRef();
    const [homeScorers, setHomeScorers] = useState(Array(homeScore).fill(''));
    const [awayScorers, setAwayScorers] = useState(Array(awayScore).fill(''));

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
            // Update goals for home team players
            for (const playerId of homeScorers) {
                if (playerId) {
                    await updatePlayerGoals(playerId);
                }
            }

            // Update goals for away team players
            for (const playerId of awayScorers) {
                if (playerId) {
                    await updatePlayerGoals(playerId);
                }
            }

            handleClose();
            window.location.reload();
        } catch (error) {
            console.error('Błąd przy przypisywaniu strzelców:', error);
        }
    };

    return (
        <dialog ref={ref} className='result-modal'>
            <h2 className='head-text text-center'>Przypisz Strzelców Bramki</h2>
            <form onSubmit={handleSubmit} className="score-form">
                <div className="team-score-section">
                    <h3>{homeTeamPlayers[0]?.teamName || 'Gospodarze'}</h3>
                    {homeScorers.map((_, index) => (
                        <select
                            key={index}
                            value={homeScorers[index]}
                            onChange={(e) => {
                                const updatedScorers = [...homeScorers];
                                updatedScorers[index] = e.target.value;
                                setHomeScorers(updatedScorers);
                            }}
                            className="form-control scorer-select"
                            required
                        >
                            <option value="">Wybierz strzelca</option>
                            {homeTeamPlayers.map((player) => (
                                <option key={player.id} value={player.id}>{player.name}</option>
                            ))}
                        </select>
                    ))}
                </div>
                <div className="team-score-section">
                    <h3>{awayTeamPlayers[0]?.teamName || 'Goście'}</h3>
                    {awayScorers.map((_, index) => (
                        <select
                            key={index}
                            value={awayScorers[index]}
                            onChange={(e) => {
                                const updatedScorers = [...awayScorers];
                                updatedScorers[index] = e.target.value;
                                setAwayScorers(updatedScorers);
                            }}
                            className="form-control scorer-select"
                            required
                        >
                            <option value="">Wybierz strzelca</option>
                            {awayTeamPlayers.map((player) => (
                                <option key={player.id} value={player.id}>{player.name}</option>
                            ))}
                        </select>
                    ))}
                </div>
                <footer className='d-flex justify-content-between mt-3'>
                    <button type='button' onClick={handleClose} className="btn custom-btn" style={{ backgroundColor: '#12352f' }}>Zamknij</button>
                    <button type='submit' className="btn custom-btn">Zatwierdź</button>
                </footer>
            </form>
        </dialog>
    );
}
