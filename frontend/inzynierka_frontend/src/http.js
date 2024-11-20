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
export async function getContent(page, query){
    const url = `http://127.0.0.1:8000/api/${page}/?name=${query}`;
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