const orderModel = require('../models/orderModel');
const crypto = require('crypto');
const axios = require('axios');
//const ecpay_payment = require('ecpay_aio_nodejs');// 綠界提供的 SDK
//const ecpay_payment = require('../../node_modules/ecpay_aio_nodejs/lib/ecpay_payment');
const ecpay_payment = require('../../node_modules/ecpay_aio_nodejs')


const orderController = {
  createOrder: async (req, res) => {
    const { user_id, order_number, order_products, order_shipping_fee, order_price } = req.body;

    try {
      const result = await orderModel.createOrder(
        user_id,
        order_number,
        order_products,
        order_shipping_fee,
        order_price
      );

      res.status(201).json({
        success: true,
        data: result,
        message: 'Order created successfully',
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  },

  getOrderById: async (req, res) => {
    const { order_id } = req.params;

    try {
      const order = await orderModel.getOrderById(order_id);

      res.status(200).json({
        success: true,
        data: order,
        message: 'Order retrieved successfully',
      });
    } catch (error) {
      console.error('Error retrieving order:', error);
      res.status(404).json({
        success: false,
        error: error.message || 'Order not found',
      });
    }
  },

  result: (req, res) => {
    res.render('payment/result');
},

  GetCheckValue: async (req, res) => {
    try { 
      
      const { MerchantID, HASHKEY, HASHIV } = process.env;
      const { order_id } = req.params;
      const orderData = req.body; //前端傳來的交易內容

      // const currentDate = new Date();

      // // 取得年、月、日、時、分、秒
      // const year = currentDate.getFullYear();
      // const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      // const day = String(currentDate.getDate()).padStart(2, '0');
      // const hours = String(currentDate.getHours()).padStart(2, '0');
      // const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      // const seconds = String(currentDate.getSeconds()).padStart(2, '0');

      // // 格式化日期時間
      // const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
      const formattedDateTime = new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      });

      const options = {
        OperationMode: 'Test', //Test or Production
        MercProfile: {
          MerchantID: MerchantID,
          HashKey: HASHKEY,
          HashIV: HASHIV,
        },
        IgnorePayment: [],// 支付方式
        IsProjectContractor: false,
      };
  
      const order = {
        //特店訂單編號
        MerchantTradeNo: orderData.order_number,
        //特店交易時間
        MerchantTradeDate: formattedDateTime,
        //交易類型 固定填入 aio
        PaymentType: 'aio',
        //交易金額
        TotalAmount: orderData.order_price,
        //交易描述
        TradeDesc: orderData.order_products,
        //商品名稱
        ItemName: orderData.order_products,
        //付款完成通知回傳網址 完成後發通知給後端
        ReturnURL: 'https://localhost:5001/return',
        //選擇預設付款方式 固定填入 ALL
        ChoosePayment: 'ALL',
        //CheckMacValue 加密類型 固定填入 1 (SHA256)
        EncryptType: '1',
        //Client端返回特店的按鈕連結 當使用者於綠界操作結束時，綠界會轉址至此URL
        ClientBackURL:'https://localhost:5001/clientReturn',
        IgnorePayment: 'GooglePay#WebATM#CVS#BARCODE',
      };
      console.log('訂單建立成功:', order);

      const create = new ecpay_payment(options);
      const html = create.payment_client.aio_check_out_all(order);

      //res.json({ html });
      console.log('HASHKEY:', HASHKEY)
      console.log('HashIV:', HASHIV)
      console.log(html);
      //res.send(html);

      res.render('payment/result', {
        title: 'Express',
        html,
      });
    } catch (error) {
      console.error('建立訂單時發生錯誤:', error);
      res.status(500).json({ error: '建立訂單時發生錯誤' });
    }
  },

  paymentReturn: async (req, res) => {
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
  },

  clientReturn: async (req, res) => {
    console.log('clientReturn:', req.body, req.query);
    res.render('payment/return', { query: req.query });
  }


};

module.exports = orderController;
