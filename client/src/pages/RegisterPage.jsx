import { Link } from 'react-router-dom';
import {useState} from 'react';
import axios from 'axios';

export default function RegisterPage() {

    const [name,setName] = useState('');
    const [email,setMail] = useState('');
    const [password,setPassword] = useState('');
    async function registerUser(ev) {
        ev.preventDefault(); //so it does not rerun the page
        try {
            await axios.post('/register', {
              name,
              email,
              password,
            });
            alert('Registration successful. Now you can log in');
          } catch (e) {
            alert('Registration failed. Please try again later');
          }
    }

  return (
    <div className="mt-20 flex flex-col items-center justify-around">
      <h1 className="text-4xl text-center font-bold mb-8">Înregistrare</h1>

      <form className="md:w-1/2 font-bold mx-auto flex flex-col gap-4" 
      onSubmit={registerUser}>
        <p className='text-left'> Nume </p>
        <input type="text"
          value={name} onChange={ev => setName(ev.target.value)}
        placeholder="Popescu Ion" />

        <p className='text-left'> Email </p>
        <input type="email" 
            value={email} onChange={ev => setMail(ev.target.value)}
            placeholder="emailul_tau@email.com" />

        <p className='text-left'> Parola </p>
        <input type="password" 
          value={password} onChange={ev => setPassword(ev.target.value)}
        placeholder="Parola ta" />

        <button className="primary">Înregistrare</button>

        <div className="text-center py-2">
          Ai deja un cont? <Link to={'/login'} className='text-green-500 underline'>Autentificare.</Link>
        </div>
      </form>
    </div>
  );
}
