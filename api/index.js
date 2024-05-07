const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bcryptSalt = bcrypt.genSaltSync(10);

const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const jwtSecret='jdfnvkja';
const User = require('./models/User');
const Place = require('./models/Place');
const Booking = require('./models/Booking');

const app = express(); 
require('dotenv').config();

app.use(express.json());

app.use(cookieParser());
app.use('/uploads', express.static(__dirname +'/uploads')); //folderul static in aplicatiei

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromToken(req) {
    return new Promise((resolve,reject)=> {
        jwt.verify(req.cookies.token, jwtSecret, {}, async(err,userData)=> {
            if (err) throw err;
            resolve( userData);
        });
    })

  }

app.get('/test', (req,res) =>{
    res.json('test ok');
});

app.post('/register', async (req,res) => {
    const {name, email, password} = req.body;
    try{
    const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({userDoc});
} catch(e) {
    res.status(422).json(e);
}
    
});

app.post('/login', async (req,res)=>{
    const {email, password} = req.body;
    try{
    const userDoc = await User.findOne({email});
    if(userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({email:userDoc.email, id:userDoc._id}, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, { 
                    httpOnly: true, // Recommended to help prevent XSS attacks
                    secure: true, // Required when 'SameSite=None'
                    sameSite: 'None' // Needed for cross-site cookie
                }).json(userDoc);
            });
        }
        else{
            res.status(422).json('pass not ok');
        }
    } else {
        res.status(422).json('not found');
    }
 } catch(e) {
        res.status(422).json(e);
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    console.log('Token:', token); // Debugging statement

    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) {
                console.error('JWT Verification Error:', err); // Debugging statement
                res.status(401).json({ error: 'Unauthorized' });
            } else {
                try {
                    const user = await User.findById(userData.id);
                    if (user) {
                        const { name, email, _id } = user;
                        res.json({ name, email, _id });
                    } else {
                        console.error('User not found'); // Debugging statement
                        res.status(404).json({ error: 'User not found' });
                    }
                } catch (error) {
                    console.error('User retrieval error:', error); // Debugging statement
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
        });
    } else {
        console.log('No token found'); // Debugging statement
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req,res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName, //__dirname e o variabila care te duce la calea catre folderul de back-end
    })
    res.json(newName);
})

const photosMiddleware = multer({dest: 'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => {
    const uploadedFiles = [];
    for(let i=0; i<req.files.length; i++){
        const {path,originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        const newPath = path + '.' + ext;
        
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/','')); 
       
    }
    res.json(uploadedFiles);
})

app.post('/places', (req,res) => {
        const {token} = req.cookies;
        const {
        title,address,addedPhotos,description,price,
        perks,extraInfo,checkIn,checkOut,maxGuests,
        } = req.body;

        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        
        if (err) throw err;

        const placeDoc = await Place.create({
            owner:userData.id, price,
            title,address, photos: addedPhotos,description,
            perks,extraInfo,checkIn,checkOut,maxGuests,
        });

        res.json(placeDoc);
    });
});

app.get('/user-places', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData;
        res.json(await Place.find({owner:id}));
    });
})

app.get('/places', async (req,res) => {
    res.json(await Place.find() );
});

app.get('/places/:id', async (req,res) => {
    const {id} = req.params;
    res.json(await Place.findById(id));
});


app.put('/places', async (req,res) => {
    const {token} = req.cookies;

    const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
    
    jwt.verify(token, jwtSecret, {}, async (err, userData) => { //luam din cookie datele utilizatorului
    if (err) throw err;

    const placeDoc = await Place.findById(id); //luam informatiile despre locatie dupa id

    if (userData.id === placeDoc.owner.toString()) { //owner ar fi ObjectId si celalalt e string simplu
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
})

app.post('/bookings', async (req, res) => {
    const userData = await getUserDataFromToken(req);
    const {
      place,checkIn,checkOut,numberOfGuests,name,phone,price,
    } = req.body;
    
    Booking.create({
      place,checkIn,checkOut,numberOfGuests,name,phone,price,
      user:userData.id,
    }).then((doc) => {
      res.json(doc);
    }).catch((err) => {
      throw err;
    });
  });


  app.get('/bookings', async (req,res)=> {

    const userData = await getUserDataFromToken(req);
    res.json( await Booking.find({user:userData.id}).populate('place')) ;
  })

app.listen(4000);