'use strict';
// UI部分
const InitButton = document.getElementById('init');
const ToField = document.getElementById('to');
const CallButton = document.getElementById('call');
const DisconnectButton = document.getElementById('disconnect');

// 初期化ボタンをクリックするとClient Capability Tokenを取得し、Twilio.Deviceを初期化する。
InitButton.addEventListener('click', async() => {
    let response = await fetch('/token', {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json'
        }
    });
    
    let {token}  = await response.json();
    Twilio.Device.setup(token);
    Twilio.Device.on('ready', () => {
        CallButton.disabled = false;
        InitButton.disabled = true;
    });
});



dialForm.addEventListener('submit', (event) => {

    event.preventDefault();
    const submitId = event.submitter.id;

    //発信ボタンがクリックされた場合はTwiML Appに対して numberを引数として発信してもらう。
    if (submitId === 'call') {
        const number = ToField.value;
        CallButton.disabled = true;
        Twilio.Device.connect({ number: number});
        DisconnectButton.disabled = false;
    }

    // 終了ボタンがクリックされた場合は接続を終了する。
    else if (submitId === 'disconnect') {
        Twilio.Device.disconnectAll();
        DisconnectButton.disabled = true;
        CallButton.disabled = false; 
    }
    
})
