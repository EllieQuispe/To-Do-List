const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


app.use(express.static('public')); //to run my css, and javaScript files
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.post('/geocode', async (req, res) => {
    const addressInput = req.body.addressInput;
    const geocodingEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressInput)}.json?proximity=ip&access_token=${process.env.MAPBOX_ACCESS_TOKEN}&autocomplete=false`;

    try{
        const response = await fetch(geocodingEndpoint);
        const data = await response.json();

        if (data.features.length > 0){
            const location = data.features[0].center;
            res.json({success: true, location});
        } else {
            res.json({success:false, error: 'Location not found'});
        }
    } catch(error){
        console.log('Error:', error);
        res.json({success: false, error: 'Internal server error'});
    }
      
});

app.get('/getMapboxToken', (req, res) => {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN
    //send the token as JSON response
    res.json({success: true, token: mapboxToken})
})




//Start the server
const PORT = process.env.PORT  || 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
} )