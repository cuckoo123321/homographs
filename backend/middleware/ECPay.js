const express = require('express');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config();

// 綠界提供的 SDK
const ecpay_payment = require('ecpay_aio_nodejs');

const { MERCHANTID, HASHKEY, HASHIV, HOST } = process.env;

// SDK 提供的範例，初始化
// https://github.com/ECPay/ECPayAIO_Node.js/blob/master/ECPAY_Payment_node_js/conf/config-example.js
const options = {
  OperationMode: 'Test', //Test or Production
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV,
  },
  IgnorePayment: [],// 支付方式
  IsProjectContractor: false,
};

// 訂單參數設定
router.post('/createOrder', async (req, res) => {
  try {
    const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });

    const base_param = {
      MerchantID:'3002607',
      MerchantTradeNo: generateOrderNumber(),
      MerchantTradeDate,
      PaymentType:aio,
      TotalAmount: '1000',
      TradeDesc: '同形詞教材',
      ItemName: '實用中日同形詞攻略法1#我也繪漢字2（正簡通用版）',
      ReturnURL: `http://localhost:5001`,
      ClientBackURL: `http://localhost:3000/#/payment`,
      ChoosePayment: 'ALL',
      EncryptType:1
    };

    // 計算 CheckMacValue
    const checkMacValue = calculateCheckMacValue(merchantParams);

    // 合併 CheckMacValue 到特店參數
    const paramsWithCheckMacValue = { ...merchantParams, CheckMacValue: checkMacValue };

    // 呼叫綠界 API 以建立訂單
    const response = await axios.post('https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5', paramsWithCheckMacValue);

    console.log(response.data);

    const create = new ecpay_payment(options);
    const html = create.payment_client.aio_check_out_all(base_param);

    res.json({ html });
  } catch (error) {
    console.error('建立訂單時發生錯誤:', error);
    res.status(500).json({ error: '建立訂單時發生錯誤' });
  }
});

router.post('/return', async (req, res) => {
  try {
    const { CheckMacValue } = req.body;
    const data = { ...req.body };
    delete data.CheckMacValue;

    const create = new ecpay_payment(options);
    const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

    console.log(
      '確認交易正確性：',
      CheckMacValue === checkValue,
      CheckMacValue,
      checkValue,
    );

    res.send('1|OK');
  } catch (error) {
    console.error('處理交易回傳時發生錯誤:', error);
    res.status(500).send('Error');
  }
});

router.get('/clientReturn', (req, res) => {
  console.log('clientReturn:', req.body, req.query);
  res.render('return', { query: req.query });
});

// 生成訂單編號的函數
const generateOrderNumber = () => {
  const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const randomDigits = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    
      // 生成包含英文與數字的 8 碼 UID
      const uid = Math.random().toString(36).substr(2, 8);
    
      return `${year}${month}${day}${hours}${minutes}${seconds}${randomDigits}${uid}`;
};

router.get('/', (req, res) => {
  
  // https://github.com/ECPay/ECPayAIO_Node.js/blob/master/ECPAY_Payment_node_js/conf/config-example.js
   // 獲取當前時間
  const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  TradeNo = 'test' + new Date().getTime();
  let base_param = {
    MerchantTradeNo: TradeNo, //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate,
    TotalAmount: '100',
    TradeDesc: '測試交易描述',
    ItemName: '測試商品等',
    ReturnURL: `${HOST}/return`,
    ClientBackURL: `${HOST}/clientReturn`,
  };
  const create = new ecpay_payment(options);

  // 注意：在此事直接提供 html + js 直接觸發的範例，直接從前端觸發付款行為
  const html = create.payment_client.aio_check_out_all(base_param);
  console.log(html);

  res.render('index', {
    title: 'Express',
    html,
  });
});

// 後端接收綠界回傳的資料
router.post('/return', async (req, res) => {
  console.log('req.body:', req.body);

  const { CheckMacValue } = req.body;
  const data = { ...req.body };
  delete data.CheckMacValue; // 此段不驗證

  const create = new ecpay_payment(options);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

  console.log(
    '確認交易正確性：',
    CheckMacValue === checkValue,
    CheckMacValue,
    checkValue,
  );

  // 交易成功後，需要回傳 1|OK 給綠界
  res.send('1|OK');
});

// 用戶交易完成後的轉址
router.get('/clientReturn', (req, res) => {
  console.log('clientReturn:', req.body, req.query);
  res.render('return', { query: req.query });
});

module.exports = router;