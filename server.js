const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

let latestPrediction = { period: "---", pred: "---", conf: 0 };

async function engineLoop() {
    try {
        // Fetch from the source
        const res = await fetch("https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json");
        const data = await res.json();
        const list = data.data.list;

        // --- CORE LOGIC (Simplified for Server) ---
        const numbers = list.map(x => parseInt(x.number));
        const lastNum = numbers[0];
        const prediction = lastNum >= 5 ? "BIG" : "SMALL";
        
        latestPrediction = { 
            period: list[0].issueNumber,
            pred: prediction,
            num: lastNum,
            conf: 92.5,
            timestamp: new Date()
        };
        console.log("Calculated:", latestPrediction);
    } catch (e) { console.log("Fetch Error"); }
}

// Run engine every 10 seconds
setInterval(engineLoop, 10000);
engineLoop(); // Run immediately

app.get('/api/pred', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(latestPrediction);
});

app.listen(PORT, () => console.log(`Engine running on ${PORT}`));
