# Google Login and UPI Payments

## Google login

This app uses Google Identity Services on the frontend and verifies the Google ID token on the Express backend.

1. Create an OAuth 2.0 Web Client ID in Google Cloud Console.
2. Add the browser origins you use, for example `http://localhost:4000` and your production domain.
3. Copy `client/.env.example` to `client/.env` and set `VITE_GOOGLE_CLIENT_ID`.
4. Copy `server/.env.example` to `server/.env` and set the same value as `GOOGLE_CLIENT_ID`.
5. Restart the app after changing environment variables.

The server rejects Google sign-ins when `GOOGLE_CLIENT_ID` is missing, so tokens are not trusted client-side only.

## UPI payments

The current wallet flow creates a UPI intent URL and records the payment only when the demo confirmation button is clicked. This is useful for product testing, but it is not a real payment settlement flow.

For production:

1. Use a payment gateway that supports UPI, such as Razorpay, Cashfree, PhonePe, PayU, or another approved provider.
2. Create the order on the backend only. Do not expose gateway secrets in React.
3. Open the gateway checkout or UPI intent from the frontend.
4. Verify payment success on the backend using the gateway signature and webhook.
5. Credit the wallet only after verified success from the gateway.

UPI collect flows are being phased out for many cases. Prefer UPI Intent or QR through a gateway for new integrations.
