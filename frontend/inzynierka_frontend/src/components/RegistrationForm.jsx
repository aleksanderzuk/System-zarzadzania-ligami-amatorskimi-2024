import { useRef, useState } from 'react';
import { register } from '../http';
export default function RegistrationForm( { checkReg }){
    
    const login = useRef();
    const first_name = useRef();
    const last_name = useRef();
    
    const password = useRef();
    const position = useRef();
    const [wasWrong, setWasWrong] = useState(false);
    const position_list = [
        'Niezdefiniowana',
        'Bramkarz',
        'Obrońca',
        'Pomocnik',
        'Napastnik'
    ]

    function handleClick(){
        checkReg(true);
    }

    async function handleSubmit(event){
        event.preventDefault();
        console.log(password.current.value);
        try{
            const responseMessage = await register(
                login.current.value,
                password.current.value,
                first_name.current.value,
                last_name.current.value,
                position.current.value
            );
            console.log('Register succesful:', responseMessage);
            checkReg(true);
        } catch(error){
            console.error('Register error:', error.message);
        }
    }
    
    return(
        <section className="container marg responsive-width">
            <form className='op border-0 rounded' onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input id="username" ref={login} name="username" className={`${wasWrong ? 'invalid' : 'results'} form-control narrow mt-3`} placeholder='Nazwa użytkownika' />
                </div>

                <div className="mb-4">
                    <input id="password" ref={password} type="password" name="password" className={`${wasWrong ? 'invalid' : 'results'} form-control narrow mt-3`} placeholder='Hasło' />
                </div>

                <div className="mb-4">
                    <input id="first_name" ref={first_name} name="first_name" className={`${wasWrong ? 'invalid' : 'results'} form-control narrow mt-3`} placeholder='Imię' />
                </div>

                <div className="mb-4">
                    <input id="last_name" ref={last_name} name="last_name" className={`${wasWrong ? 'invalid' : 'results'} form-control narrow mt-3`} placeholder='Nazwisko' />
                </div>


                <div className="mb-4">
                    <select id="position" ref={position} className="form-control narrow mt-3 results">
                    <option value="" disabled defaultValue hidden>Pozycja</option>
                        {position_list.map((pos, index) => (
                            <option key={index} value={pos}>{pos}</option>
                        ))}
                    </select>
                </div>

                

                <div className="d-flex justify-content-center narrow">
                    <button type="submit" className="log btn custom-btn">Zarejestruj</button>
                </div>

                <div className=" mt-2 d-flex justify-content-center narrow">
                    <button type='button' onClick={handleClick} className="log btn custom-btn">Masz już konto?</button>
                </div>

            </form>
            
        </section>
    )
}