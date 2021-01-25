'use strict';
require('dotenv').config();

const { urlencoded, response } = require('express');
const express = require('express');
const path = require('path');
const ngrok = require('ngrok');

// Twilio関連はここから
const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

// .envファイルから環境変数を取得
const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER, TWIML_APP_SID} = process.env;


// express app
const app = new express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(urlencoded({extended: false}));

app.use('/js/twilio.min.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules/twilio-client/dist/twilio.min.js'));
});

//Client Capabilityトークンを生成しクライアントに渡す。
app.get('/token', (req, res) => {
    const capability = new ClientCapability({
        accountSid: TWILIO_ACCOUNT_SID,
        authToken: TWILIO_AUTH_TOKEN
    });
    // 外部発信のみを有効化
    capability.addScope(
        new ClientCapability.OutgoingClientScope({
            applicationSid: TWIML_APP_SID
        })
    );
    const token = capability.toJwt();
    res.send({ token: token});
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




