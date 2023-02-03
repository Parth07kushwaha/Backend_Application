const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const app = express();

app.get('/rest/v1/calendar/init', (req, res) => {
  const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
    querystring.stringify({
      client_id: 'YOUR_CLIENT_ID',
      redirect_uri: 'http://localhost:3000/rest/v1/calendar/callback',
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      response_type: 'code'
    });

  res.redirect(googleAuthUrl);
});

app.get('/rest/v1/calendar/callback', async (req, res) => {
  const code = req.query.code;
  const tokenResponse = await axios.post('https://oauth2.googleapis.com/token',
    querystring.stringify({
      code: code,
      client_id: 'YOUR_CLIENT_ID',
      client_secret: 'YOUR_CLIENT_SECRET',
      redirect_uri: 'http://localhost:3000/rest/v1/calendar/callback',
      grant_type: 'authorization_code'
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  const accessToken = tokenResponse.data.access_token;
  // Store the access token in your database or session
  res.send('Access Token: ' + accessToken);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
