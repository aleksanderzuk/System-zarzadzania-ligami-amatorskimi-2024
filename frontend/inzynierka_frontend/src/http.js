export async function reqPost(username, password){
    const requestBody ={
        username: username,
        password: password
    }
    const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers:{
            'Content-type': 'application/json'
        }
    });
    const resData =  await response.text();  // await response.text()
    if(!response.ok){
        throw new Error('Failed to log in');
    }
    return resData;
}

export async function register(username, password, name, surname, position){
    const requestBody={
        username: username,
        password: password,
        name: name,
        surname: surname,
        position: position,
    }
    const response = await fetch('http://localhost:8000/api/register/',{
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers:{
            'Content-type' : 'application/json'
        }
    });
    const resData = await response.text();
    if(!response.ok){
        throw new Error('Failed to register');
    }
    return resData;
}


// funkcja do ściągania całkowitego kontentu, do np. wszystkich lig
export async function getContent(page, query, additional=''){
    console.log(additional);
    const url = `http://127.0.0.1:8000/api/${page}/?name=${query}${additional}`;
    console.log(url);
    const response = await fetch(url);
    const resData = await response.json();

    if(!response.ok){
        throw new Error('Failed to fetch data');
    }
    return resData;
}

// funkcja do ściągania pojedynczej zawartości np. ligi po id
export async function getExactContent(page, id){
    const url = `http://127.0.0.1:8000/api/${page}/${id}`;
    
    const response = await fetch(url);
    const resData = await response.json();

    if(!response.ok){
        throw new Error('Failed to fetch data');
    }
    return resData;
}

export async function createContent(name, type, token){
    const url = `http://127.0.0.1:8000/api/${type}/`
    
    const requestBody ={
        name: name
    }

    const response = await fetch(url, {
        method:'POST',
        body: JSON.stringify(requestBody),
        headers:{
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}` 
        }
    });
    const resData = await response.json();
    

    if(!response.ok){
        throw new Error('Nie udało się dodać kontentu');
        
    }
    if(response.ok){
        alert('Pomyślnie dodano');
    }
    return resData;
}

import Cookies from 'js-cookie';

//leagueId, teamIds

export async function assign(id, ids, page, assigning) {
    const token = Cookies.get('session');  // Pobranie tokenu sesji z ciasteczek
    
    if (!token) {
        throw new Error('Brak tokenu użytkownika. Upewnij się, że jesteś zalogowany.');
    }

    const sessionData = JSON.parse(token);
    const accessToken = sessionData.access;  // Wyciągnięcie tokenu dostępu z sesji

    const url = `http://127.0.0.1:8000/api/${page}/${id}/assign_${assigning}/`;  // URL dla akcji przypisywania drużyn

    const requestBody = {
        [assigning]: ids,  // Lista ID zespołów, które mają zostać przypisane do ligi
    };

    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,  // Przekazanie tokenu dostępu w nagłówku
        },
        body: JSON.stringify(requestBody),  // Ciało zapytania z listą zespołów
        });

        const result = await response.json();  // Parsowanie odpowiedzi z backendu

        if (!response.ok) {
        throw new Error(result.detail || 'Nie udało się przypisać drużyn do ligi');
        }

        return result;  // Zwracamy odpowiedź z backendu (np. komunikat o sukcesie)
    } catch (error) {
        console.error('Błąd podczas przypisywania drużyn:', error.message);
        throw error;  // Rzucamy wyjątek, jeśli wystąpił błąd
    }
}

export async function patchMatchScore(matchId, scores) {
    const token = Cookies.get('session');
    if (!token) {
        throw new Error('Brak tokenu użytkownika. Upewnij się, że jesteś zalogowany.');
    }

    const sessionData = JSON.parse(token);
    const accessToken = sessionData.access;  // Wyciągnięcie tokenu dostępu z sesji

    const response = await fetch(`http://127.0.0.1:8000/api/update_score/${matchId}/`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(scores),
    });
    if (!response.ok) {
        throw new Error('Błąd przy edytowaniu wyniku meczu');
    }
    return response.json();
}
