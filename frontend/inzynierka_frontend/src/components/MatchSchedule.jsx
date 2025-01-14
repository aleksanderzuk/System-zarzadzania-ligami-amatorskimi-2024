import React, { useState } from 'react';
import Pagination from './Pagination';
import EditScore from './EditScore';
import EditScorers from './EditScorers';

function MatchSchedule({ matches, teamsNumber, isOwner, setMatches }) {
    const [page, setPage] = useState(0);
    const [actualPage, setActualPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [scorerModalOpen, setScorerModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [selectedMatchData, setSelectedMatchData] = useState({
        homeScore: 0,
        awayScore: 0,
        homeTeamPlayers: [],
        awayTeamPlayers: []
    });

    const matchesPerPage = Math.floor(teamsNumber / 2);

    function changePageLeft() {
        if (page !== 0) {
            setPage(prevPage => prevPage - matchesPerPage);
            setActualPage(prevActualPage => prevActualPage - 1);
        }
    }

    function changePageRight() {
        if (matches && matches.length > page + matchesPerPage) {
            setPage(prevPage => prevPage + matchesPerPage);
            setActualPage(prevActualPage => prevActualPage + 1);
        }
    }

    const handleEditClick = (match) => {
        setSelectedMatch(match);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedMatch(null);
    };

    const handleScoreSubmit = (updatedMatch) => {
        setModalOpen(false);
        updateMatches(updatedMatch);

        // Po zatwierdzeniu wyniku otwieramy modal do przypisywania strzelców
        setSelectedMatchData({
            homeScore: updatedMatch.home_score,
            awayScore: updatedMatch.away_score,
            homeTeamPlayers: updatedMatch.home_team.players,
            awayTeamPlayers: updatedMatch.away_team.players
        });
        setScorerModalOpen(true);
    };

    const handleCloseScorerModal = () => {
        setScorerModalOpen(false);
    };

    const updateMatches = (updatedMatch) => {
        setMatches(matches.map(match => match.id === updatedMatch.id ? updatedMatch : match));
    };

    return (
        <div className="match-schedule-container">
            <h2 className="head-text">Terminarz Meczów</h2>
            {matches.length > 0 ? (
                <>
                    <h1 className="section-title">Kolejka: {actualPage}</h1>
                    <table className="schedule-table">
                        <colgroup>
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "30%" }} />
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "30%" }} />
                            {isOwner && <col style={{ width: "20%" }} />}
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Gospodarz</th>
                                <th>Wynik</th>
                                <th>Gość</th>
                                {isOwner ? <th>Akcja</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {matches.slice(page, page + matchesPerPage).map((match) => (
                                <tr key={match.id}>
                                    <td>{new Date(match.match_date).toLocaleDateString()}</td>
                                    <td>{match.home_team.name}</td>
                                    <td>{match.home_score} - {match.away_score}</td>
                                    <td>{match.away_team.name}</td>
                                    {isOwner ? (
                                        <td>
                                            <button onClick={() => handleEditClick(match)} className="btn custom-button">Edytuj wynik</button>
                                        </td>
                                    ) : null}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination page={actualPage} handleClickLeft={changePageLeft} handleClickRight={changePageRight} />

                    {selectedMatch && (
                        <EditScore
                            matchId={selectedMatch.id}
                            open={modalOpen}
                            handleClose={handleModalClose}
                            currentHomeScore={selectedMatch.home_score}
                            currentAwayScore={selectedMatch.away_score}
                            updateMatches={handleScoreSubmit}
                            homeTeam={selectedMatch.home_team.name}
                            awayTeam={selectedMatch.away_team.name}
                        />
                    )}

                    {scorerModalOpen && (
                        <EditScorers
                            open={scorerModalOpen}
                            handleClose={handleCloseScorerModal}
                            homeScore={selectedMatchData.homeScore}
                            awayScore={selectedMatchData.awayScore}
                            homeTeamPlayers={selectedMatchData.homeTeamPlayers}
                            awayTeamPlayers={selectedMatchData.awayTeamPlayers}
                        />
                    )}
                </>
            ) : (
                <p className='welcome-text'>Brak meczów w terminarzu</p>
            )}
        </div>
    );
}

export default MatchSchedule;
