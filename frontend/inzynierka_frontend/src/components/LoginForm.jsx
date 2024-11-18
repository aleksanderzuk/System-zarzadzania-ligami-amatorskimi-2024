import { useState, useRef } from 'react';

import { reqPost } from '../http';

import Cookies from 'js-cookie';


export default function LoginForm ({ checkLogin, checkReg }){

    const login = useRef();
    const password = useRef();
    const [wasWrong, setWasWrong] = useState(false); // w zaleznosci od wartosci wasWrong w odpowiedni sposob stylizowane sa inputy i labele, jezeli byl blad to sa na czerwono.




    function handleClick(){
        checkReg(false)
    }

    async function handleSubmit(event){
        
        event.preventDefault();
        try {
            const responseMessage = await reqPost(login.current.value, password.current.value);
            console.log('Login successful:', responseMessage);
            checkLogin(true);
            Cookies.set('session', responseMessage);
            Cookies.set('username', login.current.value);

        } catch (error) {
            console.error('Login error:', error.message);
            setWasWrong(true);
            
            
        } finally {
            event.target.reset(); 
        }
    }

    return(
        <section className="container marg responsive-width">
            <form className='op border-0 rounded' onSubmit={handleSubmit}>
                {wasWrong && <strong><p className='text-center text-danger'>Złe hasło/login</p></strong>}
                <div className="mb-4">
                    <input id="username" ref={login} name="username" className={`${wasWrong ? 'invalid' : undefined} form-control narrow mt-3`} placeholder='Login' />
                </div>

                <div className="mb-4">
                    <input id="password" ref={password} type="password" name="password" className={`${wasWrong ? 'invalid' : undefined} form-control narrow mt-3`} placeholder='Hasło' />
                </div>
                <div className="d-flex justify-content-center narrow">
                    <button type="submit" className="log">Zaloguj</button>
                </div>
                
                <div className=" mt-2 d-flex justify-content-center narrow">
                    <button type='button' onClick={handleClick} className="log">Nie masz konta?</button>
                </div>
            </form>
            
            
        </section>
    );
}