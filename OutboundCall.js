'use strict';
require('dotenv').config();

// .envファイルから環境変数を取得
const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER, MY_PHONE_NUMBER} = process.env;

// 2-1: Twilioヘルパーライブラリを初期化

// 2-2: 静的なTwiMLを用いて外部に発信

// 2-3: 動的にTwiMLを構築し外部に発信
