import { useContext, useEffect, useState } from "react";
import {differenceInCalendarDays} from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numPersons, setNumPersons] = useState(1);
    const [name,setName] = useState('');
    const [phone,setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const {user} = useContext(UserContext);
  
    useEffect(() => {
      if (user) {
        setName(user.name);
      }
    }, [user]);

    let numberOfNights = 0;
    if (checkIn && checkOut) {
      numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookThisPlace() {
        const response = await axios.post('/bookings', {
          checkIn,checkOut, name, phone,
          numberOfGuests: numPersons,
          place: place._id,
          price: numberOfNights * place.price * numPersons,
        });

        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
      }
    
      if (redirect) {
        return <Navigate to={redirect} />
      }

    const handleNumPersonsChange = (event) => {
        const newValue = parseInt(event.target.value);
        if (isNaN(newValue) || newValue <= 0) {
          setNumPersons(NaN);
        } else if (newValue <= place.maxGuests) {
          setNumPersons(newValue);
        } else {
          setNumPersons(place.maxGuests);
          alert(`Numărul de persoane nu poate fi mai mare decât ${place.maxGuests}`);
        }
      };
      
    return (
      <div className="items-center bg-white shadow p-4 rounded-2xl ml-12">
        <div className="text-center font-semibold text-2xl mt-8 mb-6">
          Preț de persoană: <br></br>
          {place.price} RON / noapte
        </div>
        <div className="border rounded-2xl">
          <div className="flex border-b">
            <div className="py-3 px-4">
              <label className="font-bold"> Check in: </label>
              <input type="date"
              value={checkIn}
              onChange={ev => setCheckIn(ev.target.value)}></input>
            </div>
            <div className="py-3 px-4 border-l">
              <label className="font-bold">Check out: </label>
              <input type="date"
              value={checkOut}
              onChange={ev => setCheckOut(ev.target.value)}>
              </input>
            </div>
          </div>
          <div className="py-3 px-4">
            <label className="font-bold ">Număr persoane: </label>
            <input
              type="number"
              value={numPersons}
              onChange={handleNumPersonsChange}
              max={place.maxGuests}
            ></input>
          </div>

          {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label className="font-bold ">Nume complet:</label>
            <input type="text"
                   value={name}
                   onChange={ev => setName(ev.target.value)}/>
            <label className="font-bold ">Număr de telefon:</label>
            <input type="text"
                   value={phone}
                   maxLength={10}
                   onChange={ev => setPhone(ev.target.value)}/>
          </div>
        )}


        </div>
        <button  onClick={bookThisPlace} className="primary mt-4 text-white text-2xl font-bold">
          Rezervă
          {numberOfNights > 0 && !isNaN(numPersons) && (
            <span> la {numberOfNights * place.price * numPersons} RON</span>
          )}
        </button>
      </div>
    );
  }
  