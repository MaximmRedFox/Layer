# 🧬 TSL Governance Voting Portal

Community governance portal per TheStrainLab con Privy authentication e Solana wallet integration.

## Features

✅ Twitter/X login via Privy  
✅ Solana wallet connection (Phantom, Solflare, etc.)  
✅ NFT verification on-chain  
✅ Voting system (1 NFT = 1 vote)  
✅ Real-time results  
✅ Responsive design con terminal aesthetics  

---

## 🚀 Deploy su Render

### Step 1: Crea Account Render
1. Vai su [render.com](https://render.com)
2. Sign up con GitHub

### Step 2: Connetti GitHub Repo
1. Carica questo progetto su GitHub
2. Su Render: "New" → "Web Service"
3. Connetti il tuo GitHub repo

### Step 3: Configura Build
**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

**Environment Variables** (aggiungi su Render):
```
NEXT_PUBLIC_PRIVY_APP_ID=cmkst02ac00d7js0d14j9i7qw
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_API_ENDPOINT=https://your-backend.onrender.com/api
```

### Step 4: Configura Privy
1. Vai su [dashboard.privy.io](https://dashboard.privy.io)
2. Settings → **Allowed domains**
3. Aggiungi il tuo Render URL: `https://your-app.onrender.com`

### Step 5: Deploy
Click "Deploy" su Render.

---

## 💻 Test Locale (Opzionale)

### Installa Dependencies
```bash
npm install
```

### Crea .env.local
```
NEXT_PUBLIC_PRIVY_APP_ID=cmkst02ac00d7js0d14j9i7qw
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001/api
```

### Aggiungi localhost a Privy
Dashboard Privy → Allowed domains → Aggiungi `http://localhost:3000`

### Run Dev Server
```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

---

## 📁 Struttura Progetto

```
tsl-governance/
├── pages/
│   ├── _app.js          # Privy Provider wrapper
│   └── index.js         # Main voting page
├── styles/
│   └── globals.css      # Tailwind + custom styles
├── .env.local           # Environment variables
├── package.json         # Dependencies
└── README.md           # This file
```

---

## 🔧 Cosa Serve Ancora

### 1. Backend API
Crea questi endpoint:

**POST /api/vote**
```json
{
  "walletAddress": "...",
  "twitterUsername": "...",
  "selectedPrice": "0.0404",
  "nftCount": 1
}
```

**GET /api/results**
```json
{
  "0.0404": 45,
  "0.101": 12,
  "0.202": 3
}
```

**GET /api/check/:wallet**
```json
{
  "hasVoted": true,
  "selectedPrice": "0.0404"
}
```

### 2. NFT Verification Reale
In `pages/index.js`, cerca `checkNFTOwnership()` e sostituisci mock con:

```javascript
const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC);
const publicKey = new PublicKey(walletAddress);
const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
  programId: TOKEN_PROGRAM_ID
});
// Filter per TheStrainLab collection
```

---

## 🎯 Checklist Deploy

- [ ] Progetto caricato su GitHub
- [ ] Render configurato con build commands
- [ ] Environment variables aggiunte su Render
- [ ] Allowed domains configurati su Privy dashboard
- [ ] Deploy completato
- [ ] Test login Twitter
- [ ] Test wallet connection
- [ ] Test voting flow

---

## 📞 Support

Built with Claude AI for TheStrainLab.  
Against Mission Obvious. 🧬
