import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import Perks from "../Perks";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [selectedPerks, setSelectedPerks] = useState([]);

  
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]); //de fiecare data cand se schimba id-ul vrem sa rerulam functia use Effect

  if (!place) return "";

  if (showAllPhotos){
    return (
        <div className="absolute inset-0 bg-black text-white min-w-full min-h-full">
            <div className="bg-black p-8 grid gap-4">
                <h2 className="text-3xl text-left mr-36"> Poze cu {place.title} </h2>
                <button onClick={() => {setShowAllPhotos(false)}} className="fixed right-12 top-8 flex text-black shadow shadow-black gap-2 py-2 px-2 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                </svg>
                    Închide
                </button>
                {place?.photos?.length > 0 && place.photos.map(photo => (
                <div >
                <img src={'http://localhost:4000/' + photo} alt=""/>
                </div>
                ))}
            </div>
        </div>
        
    );
  }

  return (
    <div>
        <div className="mt-4 rounded-2xl bg-gray-100 -mx-8 pb-6 px-6 pt-8">
            <h1 className="flex text-3xl">{place.title}</h1>
            <a className="flex text-xl gap-1 my-3 block font-semibold items-center" target="_blank" href={'https://maps.google.com/?q='+ place.title + ' ' + place.address}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className=" w-6 h-6">
                <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z" clipRule="evenodd" />
            </svg>

                <span className="underline"> {place.address} </span> <span> - Vezi pe hartă </span> 

                </a>
            <div className="relative">
                <div className="mt-8 grid rounded-3xl overflow-hidden grid-cols-1 md:grid-cols-[2fr_1fr]">
                    <div>
                        {place.photos?.[0]&&(
                            <img onClick={() => {setShowAllPhotos(true)}} className="aspect-square object-cover" src={'http://localhost:4000/'+place.photos[0]}></img>
                        )}
                    </div>
                    <div className="grid">
                            {place.photos?.[1]&&(
                                <img onClick={() => {setShowAllPhotos(true)}} className="aspect-square object-cover" src={'http://localhost:4000/'+place.photos[1]}></img>
                            )}

                                <div className="overflow-hidden">
                                    {place.photos?.[2]&&(
                                        <img onClick={() => {setShowAllPhotos(true)}} className="aspect-square object-cover" src={'http://localhost:4000/'+place.photos[2]}></img>
                                    )}
                                </div>
                    </div>
                    <button onClick={() => setShowAllPhotos(true)} className="flex gap-2  absolute bottom-2 right-2 py-2 px-4 rounded-2xl bg-white shadow shadow-md shadow-gray-500"> 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>

                     Vezi mai multe poze 
                     </button>
                    </div>
            
                </div>


                        
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] mt-8">
                        <div>
                            <div className="">
                                <div className="my-4 text-justify">
                                    <h2 className="font-semibold text-2xl mb-2">Descrierea cazării</h2>
                                    {place.description}
                                </div>

                                <div className="text-xl text-justify">
                                    <b> Check-in: </b> {place.checkIn}:00 
                                    <br />
                                    <b> Check-out: </b> {place.checkOut}:00 
                                    <br />
                                    <b> Capacitatea cazării: </b> {place.maxGuests} 
                                </div>
                            </div>
                        </div>

                    <BookingWidget className="mt-4" place={place}/>
                       
                </div>

                <div>
                <h2 className="font-semibold text-2xl mb-2 flex mt-8">Facilități:</h2>

                    <div className="grid gap-2 grid-cols-1 md:grid-cols-3 mt-2">

                        <Perks
                            selected={place.perks}
                            onChange={setSelectedPerks}
                        />
                    </div>
                </div>

            </div>

    </div>
  );
}
