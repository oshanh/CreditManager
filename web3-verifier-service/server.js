const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/verify', (req, res) => {
    const { address, message, signature } = req.body;

    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        console.log("Recovered:", recoveredAddress);

        const match = recoveredAddress.toLowerCase() === address.toLowerCase();
        res.json({ valid: match });
    } catch (err) {
        console.error("Signature verification failed:", err);
        res.status(400).json({ valid: false });
    }
});

app.listen(3001, () => {
    console.log('✅ Web3 Verifier service running on http://localhost:3001');
});
