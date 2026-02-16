const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

app.get('/login', (req, res) => {
  const scope = 'user-top-read';

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope,
        redirect_uri: REDIRECT_URI,
      })
  );
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  


  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
      }
    );

    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;

    res.redirect(`http://localhost:5173/?token=${access_token}&refresh_token=${refresh_token}`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send('Error getting token');
  }
  console.log('Received code:', code);
  console.log('response:', res, response.data);
});

app.get('/refresh_token', async(req, res) =>{
    const refresh_token = req.query.refresh_token;

    if (!refresh_token){
        return res.status(400).send('Missing refresh token!');
    }
    
    try{
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
        querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token,
            
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET,
            },
        })
        res.json({
            access_token: response.data.access_token,
        });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send('Error refreshing token');
    }
});

const PORT = 8888;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
