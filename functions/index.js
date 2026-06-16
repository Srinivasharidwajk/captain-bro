const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');

admin.initializeApp();

// Initialize Razorpay
// Config parameters should be set in environment variables or functions config.
// Fallback to mock keys if not set.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || functions.config().razorpay?.key_id || 'rzp_test_mock_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay?.key_secret || 'mock_secret_key'
});

/**
 * Callable function to generate a new Razorpay Order.
 * Accepts: { amount: Number, currency: String, receipt: String }
 */
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  const { amount, currency = 'INR', receipt } = data;
  
  if (!amount || amount <= 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a valid positive amount.'
    );
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency,
      receipt: receipt || `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    };
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Error occurred while creating Razorpay order.'
    );
  }
});

/**
 * Callable function to verify the signature of a Razorpay payment.
 * Accepts: { razorpay_order_id: String, razorpay_payment_id: String, razorpay_signature: String }
 */
exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required payment verification details (orderId, paymentId, or signature).'
    );
  }

  const key_secret = process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay?.key_secret || 'mock_secret_key';

  try {
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      return {
        success: true,
        verified: true,
        message: 'Payment signature verified successfully.'
      };
    } else {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Payment signature verification failed. Mismatched signatures.'
      );
    }
  } catch (error) {
    console.error('Payment Signature Verification Error:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Error occurred while verifying Razorpay signature.'
    );
  }
});

/**
 * HTTP function to receive Razorpay payment webhooks.
 */
exports.razorpayWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    return res.status(400).send('Missing signature');
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || functions.config().razorpay?.webhook_secret || 'mock_webhook_secret';
  
  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('Webhook signature mismatch.');
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    console.log(`Razorpay Webhook received event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id || req.body.payload.order?.entity?.id;
      const paymentId = paymentEntity?.id || 'webhook_captured';

      if (!razorpayOrderId) {
        console.warn('No order_id found in payment payload');
        return res.status(200).send('No order ID found');
      }

      const ordersSnapshot = await admin.firestore().collection('orders')
        .where('razorpayOrderId', '==', razorpayOrderId)
        .limit(1)
        .get();

      if (ordersSnapshot.empty) {
        console.warn(`No matching order found for razorpayOrderId: ${razorpayOrderId}`);
        return res.status(200).send('Order not found');
      }

      const orderDoc = ordersSnapshot.docs[0];
      const orderData = orderDoc.data();

      if (orderData.status === 'pending_payment') {
        await orderDoc.ref.update({
          status: 'pending',
          paymentStatus: 'paid',
          paymentId: paymentId,
          updatedAt: new Date().toISOString()
        });
        console.log(`Order ${orderDoc.id} updated to pending/paid via webhook.`);
      } else {
        console.log(`Order ${orderDoc.id} is already in status: ${orderData.status}`);
      }
    }

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).send('Internal Server Error');
  }
});

/**
 * HTTPS Function to serve as a webhook for Supabase Send SMS Hook.
 * Forwards OTP requests to MSG91 Flow API.
 */
exports.supabaseSmsHook = functions.https.onRequest(async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { user, sms } = req.body;
    if (!user || !user.phone || !sms || !sms.otp) {
      console.warn('Invalid Supabase SMS webhook payload:', req.body);
      return res.status(400).send('Bad Request: Missing user phone or OTP token');
    }

    const rawPhone = user.phone;
    // Strip leading '+' or other characters to get a clean mobile number for MSG91
    const cleanPhone = rawPhone.replace(/\D/g, '');

    const otp = sms.otp;

    // Load configuration values
    const authKey = process.env.MSG91_AUTH_KEY || functions.config().msg91?.authkey;
    const templateId = process.env.MSG91_TEMPLATE_ID || functions.config().msg91?.template_id;
    const senderId = process.env.MSG91_SENDER_ID || functions.config().msg91?.sender_id || 'CAPBRO';

    if (!authKey || !templateId) {
      console.error('Configuration Error: MSG91 Authkey or Template ID is not configured.');
      return res.status(500).send('Server configuration missing: SMS gateway keys not set');
    }

    console.log(`Forwarding OTP request for phone: ${cleanPhone}`);

    // Call MSG91 Flow API
    const response = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: 'POST',
      headers: {
        'authkey': authKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        template_id: templateId,
        sender: senderId,
        short_url: "0",
        mobiles: cleanPhone,
        // The variables expected by your DLT template flow:
        otp: otp
      })
    });

    const result = await response.json();
    console.log('MSG91 API response:', result);

    if (result.type === 'success') {
      return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } else {
      console.error('MSG91 gateway returned error status:', result);
      return res.status(502).json({ success: false, error: result.message || 'SMS Delivery Failed' });
    }
  } catch (error) {
    console.error('Error in supabaseSmsHook:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

