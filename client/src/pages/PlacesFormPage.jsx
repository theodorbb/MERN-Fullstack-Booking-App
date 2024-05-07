import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function PlacesFormPage(){
    const{id} = useParams();

    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [price,setPrice] = useState(100);
    const [redirect,setRedirect] = useState(false);


    useEffect(() => {
        if (!id) {
          return;
        }
        axios.get('/places/'+id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
         });
    }, [id]);

    async function savePlace(ev){
        ev.preventDefault();
        if(id) {
            //update
            await axios.put('/places', { //put modifica
                id,
                title, address, addedPhotos,
                description, perks, price,
                checkIn, checkOut, maxGuests
            });
            setRedirect(true);
        } else {
            // locatie noua, care se adauga
            await axios.post('/places', {
                title, address, addedPhotos,
                description, perks, price,
                checkIn, checkOut, maxGuests
            });
            setRedirect(true);
        }

    }

    if(redirect) {
        return <Navigate to={'/account/places'} />
    }

    return (
        <div>

        <AccountNav></AccountNav>

        <form onSubmit={savePlace}>
            <h2 className="text-left text-2xl mt-4"> Nume </h2>
            <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Numele cazării"/>
            <h2 className="text-left text-2xl mt-4">  Adresă </h2>
            <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Adresa cazării"/>

            <h2 className="text-left text-2xl mt-4" > Poze </h2>
            <p className=" text-left text-gray-500 text-sm"> Sfat: Cazările cu mai multe poze atrag mai mulți clienți.</p>

           <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>

            <h2 className="text-left text-2xl mt-4" > Descriere </h2>
            <p className=" text-left text-gray-500 text-sm"> Sfat: Descrierile scrise corect inspiră încredere clienților.</p>
            <textarea value={description} onChange={ev => setDescription(ev.target.value)} />

            <h2 className="text-left text-2xl mt-4 mb-2" > Facilități </h2>

            <div className="grid mt-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  
                    <Perks selected={perks} onChange={setPerks}></Perks>
            </div>

                <div>
                    <h2 className="text-left text-2xl mt-4 mb-2"> Capacitate </h2>
                    <input type="number" 
                    value={maxGuests}
                    onChange={ev => setMaxGuests(ev.target.value)}
                    ></input>
                </div>

                <div>
                    <h2 className="text-left text-2xl mt-4 mb-2"> Preț pe noapte </h2>
                    <input type="number" 
                    value={price}
                    onChange={ev => setPrice(ev.target.value)}
                    ></input>
                </div>

                <div className="grid sm:grid-cols-2">
                    <div>
                        <h3 className="text-left text-2xl mt-4 mb-2"> Oră Check-in </h3>
                        <input type="text" value={checkIn}
       onChange={ev => setCheckIn(ev.target.value)} placeholder="ex: 14:00"></input>
                    </div>
                    <div>
                        <h3 className="text-left text-2xl mt-4 mb-2"> Oră Check-out </h3>
                        <input type="text"value={checkOut}
       onChange={ev => setCheckOut(ev.target.value)} placeholder="ex: 12:00"></input>
                    </div>
                </div>

                <button className="primary my-6 font-bold"> Adaugă cazare</button>
            
        </form>
    </div>
    );
}