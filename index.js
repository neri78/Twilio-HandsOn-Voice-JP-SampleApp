'use strict';
require('dotenv').config();

const { urlencoded, response } = require('express');
const express = require('express');
const path = require('path');
const ngrok = require('ngrok');

// Twilio関連はここから
const twilio = require('twilio');
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const VoiceResponse = twilio.twiml.VoiceResponse;

// .envファイルから環境変数を取得
const {TWILIO_ACCOUNT_SID, TWILIO_NUMBER, TWILIO_API_KEY, TWILIO_API_SECRET, TWIML_APP_SID} = process.env;


// express app
const app = new express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(urlencoded({extended: false}));

app.use('/js/twilio.min.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules/@twilio/voice-sdk/dist/twilio.min.js'));
});

//Accessトークンを生成しクライアントに渡す。
app.get('/token', (req, res) => {

    const identity = 'user';

    const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: TWIML_APP_SID,
        incomingAllow: false
    });
    
    const token = new AccessToken(
        TWILIO_ACCOUNT_SID,
        TWILIO_API_KEY,
        TWILIO_API_SECRET,
        { identity:  identity}
    );
    token.addGrant(voiceGrant);

    res.send({ token: token.toJwt()});
});

// TwiMLAppからこちらにリクエストが渡ってくる。ここでは渡された番号に対して接続する。
app.post('/Call', (req, res) => {
    const voiceResponse = new VoiceResponse();
    voiceResponse.dial({
        callerId: TWILIO_NUMBER,
    }, req.body.number);    
    res.type('text/xml');
    res.send(voiceResponse.toString());
});

const port = 3000;

app.listen(port, () => console.log(`Listening port ${port}`));

(async function() {
    const url = await ngrok.connect(port);
    console.log(url);
})();




