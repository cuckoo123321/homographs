const orderModel = require('../models/orderModel');
const crypto = require('crypto');
const axios = require('axios');
// 綠界提供的 SDK
//const ecpay_payment = require('../../node_modules/ecpay_aio_nodejs');


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
      console.log(html);
      //res.send(html);

      res.render('payment/result', {
        title: 'Express',
        orderHtml: html,
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
  }, 

  getAllOrdersByUserId: async (req, res) => {
    const { user_id } = req.params;

    try {
      const orders = await orderModel.getAllOrdersByUserId(user_id);

      res.status(200).json({
        success: true,
        data: orders,
        message: 'All orders retrieved successfully',
      });
    } catch (error) {
      console.error('Error retrieving orders:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  },

  createPayment: async (req, res) => {
    try {
      const { user_id, order_id, cardNumber, expirationYear, expirationMonth, cvv } = req.body;
      const { HARDCODED_CARD_NUMBER, HARDCODED_EXPIRATION_YEAR, HARDCODED_EXPIRATION_MONTH, HARDCODED_CVV } = process.env;

      // 驗證信用卡信息
      function validateCreditCard(cardNumber, expirationYear, expirationMonth, cvv) {
        const validCardNumber = cardNumber === HARDCODED_CARD_NUMBER;
        const validExpirationYear = expirationYear === HARDCODED_EXPIRATION_YEAR;
        const validExpirationMonth = expirationMonth === HARDCODED_EXPIRATION_MONTH;
        const validCvv = cvv === HARDCODED_CVV;
      
        return validCardNumber && validExpirationYear && validExpirationMonth && validCvv;
      }
  
     // 驗證信用卡信息
      const isCreditCardValid = validateCreditCard(cardNumber, expirationYear, expirationMonth, cvv);

      // 如果驗證失敗，仍然存入資料庫，並設定狀態為未支付、未成功、未出貨
      if (!isCreditCardValid) {
        console.log('驗證失敗，設定狀態為未支付、未成功、未出貨');
      }

      const is_paid = isCreditCardValid ? 1 : 0;
      const is_success = isCreditCardValid ? 1 : 0;
      const is_delivered = '未出貨';

      const paymentResult = await orderModel.createPayment(user_id, order_id, is_paid, is_success, is_delivered);
  
      res.status(201).json({ success: true, data: paymentResult });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Error creating payment' });
    }
  },
  
  getPaymentResult: async (req, res) => {
    const { payment_id } = req.params;
    try {   
      const paymentResult = await orderModel.getPaymentResult(payment_id);
      res.status(200).json({ success: true, data: paymentResult });
    } catch (error) {
      console.error('Error getting payment result:', error);
      res.status(404).json({
        success: false,
        error: error.message || 'Payment not found',
      });
    }
  },

  getAllOrders: (req, res) => {
    res.render('order/orderList');
  },

  //後端顯示orderList
  handleGetAllOrders: (req, res) => {
    orderModel.getAllOrders((err, orders) => {
        if (err) {
          console.log(err);
        }
        res.render('order/orderList',{
          orders: orders,
      });
    });
  },

  //刪除後台訂單
  delete: (req, res) => {
    const orderNumber = req.params.number;
    orderModel.deleteOrder(orderNumber, (err) => {
        if (err) {
            console.error('Error deleting order:', err);
        } 
        res.redirect('/orderList');
    });
  },

  //編輯訂單出貨狀態
  updateIsDelivered: (req, res) => {
    const orderID = req.params.id;
    const isDelivered = req.body.is_delivered; // 透過表單提交的資料獲取 is_delivered

    orderModel.updateIsDelivered(orderID, isDelivered, (err) => {
        if (err) {
            console.error('Error updating is_delivered:', err);
        } else {
            res.redirect('/orderList');
        }
    });
},


};

module.exports = orderController;