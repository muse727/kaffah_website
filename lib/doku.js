import crypto from 'crypto';

export const generateDokuSignature = (payload) => {
  const clientId = process.env.DOKU_CLIENT_ID;
  const secretKey = process.env.DOKU_SECRET_KEY;
  const requestId = payload.requestId;
  const requestTimestamp = payload.requestTimestamp;
  const requestTarget = payload.requestTarget; // Contoh: /checkout/v1/payment
  const requestBody = JSON.stringify(payload.body);

  // 1. Hitung Digest (Isi paket di-hash dulu)
  const digest = crypto.createHash('sha256').update(requestBody).digest('base64');

  // 2. Susun Komponen Signature
  // Format: ClientId + RequestId + Timestamp + RequestTarget + Digest
  const componentSignature = 
    `Client-Id:${clientId}\n` +
    `Request-Id:${requestId}\n` +
    `Request-Timestamp:${requestTimestamp}\n` +
    `Request-Target:${requestTarget}\n` +
    `Digest:${digest}`;

  // 3. Buat HMAC-SHA256 Signature pakai Secret Key
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(componentSignature)
    .digest('base64');

  return `HMACSHA256=${signature}`;
};