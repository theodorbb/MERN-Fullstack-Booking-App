import { Link, useParams } from "react-router-dom";
import AccountNav from "./AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacesPage() {
    const [places,setPlaces] = useState([]);

    useEffect(() => {
    axios.get('/user-places').then(({data}) => {
        setPlaces(data);
    });

   }, []);
 
    return (
        <div>
            <AccountNav></AccountNav>
            
            <div className="text-center font-bold">
                Ești proprietarul unei cazări?
                            <br></br>
                            <br></br>
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}> 
                                
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        
                        Înregistrează o cazare
                </Link>
            </div>

            <div className="mt-4">
                <br></br>
                <br></br>
                <b className="mt-4"> Cazările înregistrate de tine:</b>
                <br></br>
                <br></br>

                {places.length > 0 && places.map(place => (
                    <Link key={place._id} to={'/account/places/'+place._id} className="flex items-center cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mb-4">
                        <div className="flex w-32 h-32 bg-gray-300 shrink-0">
                            {place.photos.length > 0 && (
                                <img className="object-cover" src={'http://localhost:4000/' + place.photos[0]} alt=""></img>
                            )}
                        </div>
                        <div className=" grow-0 shrink">
                            <h2 className="text-xl text-left">{place.title}</h2>
                            <p className="text-sm mt-2 text-justify">{place.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
            
            
        </div>
    )
}