import Cookies from 'js-cookie';

export async function reqPost(username, password) {
    const requestBody = {
        username: username,
        password: password,
    };
    const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-type': 'application/json',
        },
    });
    const resData = await response.text();
    if (!response.ok) {
        throw new Error('Failed to log in');
    }
    return resData;
}

export async function register(username, password, name, surname, position) {
    const requestBody = {
        username: username,
        password: password,
        name: name,
        surname: surname,
        position: position,
    };
    const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-type': 'application/json',
        },
    });
    const resData = await response.text();
    if (!response.ok) {
        throw new Error('Failed to register');
    }
    return resData;
}

export async function getContent(page, query, additional = '') {
    const url = `http://127.0.0.1:8000/api/${page}/?name=${query}${additional}`;
    const response = await fetch(url);
    const resData = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return resData;
}

export async function getExactContent(page, id) {
    const url = `http://127.0.0.1:8000/api/${page}/${id}`;
    const response = await fetch(url);
    const resData = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return resData;
}

export async function createContent(name, type, token) {
    const url = `http://127.0.0.1:8000/api/${type}/`;

    const requestBody = {
        name: name,
    };

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const resData = await response.json();

    if (!response.ok) {
        let errorMessage = '';

        if (Array.isArray(resData.name)) {
            errorMessage = resData.name[0];
        } else if (resData.name && typeof resData.name === 'string') {
            errorMessage = resData.name;
        } else {
            errorMessage = resData;
        }

        throw new Error(errorMessage);
    }
    if (response.ok) {
        alert('Pomyślnie dodano');
    }
    return resData;
}

export async function assign(id, ids, page, assigning) {
    const token = Cookies.get('session');
    if (!token) {
        throw new Error('Brak tokenu użytkownika. Upewnij się, że jesteś zalogowany.');
    }

    const sessionData = JSON.parse(token);
    const accessToken = sessionData.access;

    const url = `http://127.0.0.1:8000/api/${page}/${id}/assign_${assigning}/`;

    const requestBody = {
        [assigning]: ids,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || 'Nie udało się przypisać drużyn do ligi');
        }

        return result;
    } catch (error) {
        console.error('Błąd podczas przypisywania drużyn:', error.message);
        throw error;
    }
}

export async function patchMatchScore(matchId, scores) {
    const token = Cookies.get('session');
    if (!token) {
        throw new Error('Brak tokenu użytkownika. Upewnij się, że jesteś zalogowany.');
    }

    const sessionData = JSON.parse(token);
    const accessToken = sessionData.access;

    const response = await fetch(`http://127.0.0.1:8000/api/update_score/${matchId}/`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(scores),
    });
    if (!response.ok) {
        throw new Error('Błąd przy edytowaniu wyniku meczu');
    }
    return response.json();
}

export async function generateSchedule(leagueId) {
    const token = Cookies.get('session');
    if (!token) {
        throw new Error('Brak tokenu użytkownika. Upewnij się, że jesteś zalogowany.');
    }

    const sessionData = JSON.parse(token);
    const accessToken = sessionData.access;

    const response = await fetch(`http://127.0.0.1:8000/api/generate_schedule/${leagueId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Błąd przy generowaniu terminarza');
    }
    return response.json();
}

export async function deleteLeague(leagueId) {
    const token = Cookies.get('session');

    const sessionData = JSON.parse(token);
    const accessToken = sessionData.access;

    const response = await fetch(`http://127.0.0.1:8000/api/leagues/${leagueId}/delete/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Błąd przy usuwaniu ligi');
    }
    return response;
}

export async function deleteLeagueMatches(leagueId) {
    const token = Cookies.get('session');
    const sessionData = JSON.parse(token);
    const accessToken = sessionData.access;

    const response = await fetch(`http://127.0.0.1:8000/api/delete_matches/${leagueId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Błąd przy usuwaniu meczów');
    }
    return response;
}

export async function updatePlayerGoals(playerId) {
    const token = Cookies.get('session');
    if (!token) {
        throw new Error('Brak tokenu użytkownika. Upewnij się, że jesteś zalogowany.');
    }

    const sessionData = JSON.parse(token);
    const accessToken = sessionData.access;

    const response = await fetch(`http://127.0.0.1:8000/api/update_goals/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ user_id: playerId, goals: 1 }), // Zakładamy, że inkrementujemy o 1
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Błąd przy aktualizacji liczby bramek.');
    }

    return response.json();
}
