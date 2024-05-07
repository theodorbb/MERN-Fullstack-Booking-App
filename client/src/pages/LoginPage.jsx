import {Link, Navigate} from 'react-router-dom';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');

    const [redirect, setRedirect] = useState(false);

    const {setUser} = useContext(UserContext);

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
            console.log("Sending login request:", { email, password });
            const {data} = await axios.post('/login', { email, password });
            setUser(data);
            alert('Te-ai autentificat cu succes.');
            setRedirect(true);
        } catch (error) {
            console.error("Login failed:", error);
            alert('Autentificare eșuată.');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }
    
    return (
        <div className="mt-20 flex flex-col items-center justify-around">
            <h1 className="text-4xl text-center font-bold mb-8">Autentificare</h1>
            
            <form className="md:w-1/2 mx-auto flex flex-col gap-4" onSubmit={handleLoginSubmit}>
                <input type="email" 
                placeholder="emailul_tau@email.com"
                value={email} onChange={ev => setEmail(ev.target.value)}>
                </input>

                <input type="password" 
                placeholder="Parola ta"
                value={password} onChange={ev => setPassword(ev.target.value)}>
                </input>

                <button className="primary"> Autentificare </button>

                <div className="text-center py-2">
                    Nu ai un cont?  <br></br>
                    <Link to={'/register'} className='text-green-500 font-bold underline'>Creează cont.</Link>
                </div>
                
            </form>
        </div>
    );
}