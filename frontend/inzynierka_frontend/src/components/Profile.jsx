import React from 'react';
import { getContent } from '../http';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
export default function Profile() {
    // Przykład dynamicznego wyświetlania informacji o użytkowniku
    const userName = "Jan Kowalski"; // To można uzyskać z tokena lub z backendu po zalogowaniu
    const [data, setData] = useState([]);

    useEffect(() => {
        // Funkcja, która będzie wywołana po zamontowaniu komponentu
        async function getInfo() {
            let username = Cookies.get('username'); // Pobierz nazwę użytkownika z cookies

            try {
                let results = await getContent('users', username);
                setData(results); // Ustaw dane użytkownika
            } catch (error) {
                console.error('Błąd przy ściąganiu danych', error);
            }
        }

        getInfo(); // Wywołanie funkcji
        
    }, []);
    
    
    console.log(data[0].username);
    console.log('shit');
    
    return (
        <>
            <h1 className="text-center my-4">Profil</h1>
            <p className="text-center">Witaj, {data[0].username}!</p>
            {/* Tutaj możesz dodać więcej informacji o użytkowniku */}
        </>
    );
}
