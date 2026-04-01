# Shelby Website Setup

## 1. Install dependencies

Use CMD if PowerShell blocks npm scripts:

```cmd
cd /d "C:\Users\muhta\Documents\Shelby Project"
npm install
```

## 2. Add environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SHELBY_NETWORK`
- `NEXT_PUBLIC_SHELBY_RPC_BASE_URL`
- `NEXT_PUBLIC_SHELBY_API_KEY`
- `NEXT_PUBLIC_APTOS_API_KEY`

## 3. Start the app

```cmd
npm run dev
```

## 4. Use the website

- Connect an Aptos wallet from the top-right control.
- Go to the main page and choose files with `BROWSE LOCAL NODE`.
- Click `COMMIT TO SHELBY`.
- Approve the Aptos transaction in your wallet.
- After upload completes, inspect metadata in `NETWORK NODES`.
- Download stored blobs from `BILLING`.

## Notes

- The Shelby browser upload flow requires both APT and ShelbyUSD on the selected network.
- This app defaults to `SHELBYNET` unless you override it in `.env.local`.
- The billing page uses the Shelby docs browser guide estimate of 1 ShelbyUSD per upload.
- The current integration follows the Shelby React SDK docs and Aptos wallet adapter example flow.
