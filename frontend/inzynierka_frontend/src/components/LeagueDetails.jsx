import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function LeagueDetails() {
  const { id } = useParams(); // Odczytujemy parametr id z URL
  const [league, setLeague] = useState(null);

  useEffect(() => {
    // Zakładamy, że masz funkcję, która pobiera szczegóły ligi na podstawie ID
    async function fetchLeagueDetails() {
      try {
        const response = await fetch(`/api/leagues/${id}`); // Przykład zapytania do backendu
        const data = await response.json();
        setLeague(data); // Ustawiamy dane ligi w stanie
      } catch (error) {
        console.error('Błąd podczas pobierania danych ligi:', error);
      }
    }

    fetchLeagueDetails(); // Wywołujemy funkcję po załadowaniu komponentu
  }, [id]); // Ponowne pobranie danych, gdy zmieni się ID

  if (!league) {
    return <p>Ładowanie szczegółów ligi...</p>; // Wyświetlamy komunikat podczas ładowania
  }

  return (
    <div className="container mt-4">
      <h1>{league.name}</h1>
      <p><strong>Data utworzenia:</strong> {new Date(league.created_at).toLocaleDateString()}</p>
      <p><strong>Założona przez:</strong> {league.created_by.username || 'Nieznany'}</p>
      <p><strong>Liczba drużyn:</strong> {league.teams.length}</p>
      <h3>Drużyny w lidze:</h3>
      <ul>
        {league.teams.map((team) => (
          <li key={team.id}>{team.name}</li>
        ))}
      </ul>
    </div>
  );
}
