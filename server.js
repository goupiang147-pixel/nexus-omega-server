const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

let latestPrediction = { status: "calculating" };

// This is where your engine logic lives
async function runEngine() {
    try {
        // Fetching the game history
        const res = await fetch("https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json");
        const data = await res.json();
        
        // --- YOUR ENGINE LOGIC GOES HERE ---
        // Example: logic analyzing list[0]
        const lastResult = data.data.list[0].number;
        const prediction = lastResult > 4 ? "BIG" : "SMALL";
        
        latestPrediction = { 
            period: data.data.list[0].issueNumber,
            result: prediction,
            conf: "High" 
        };
        // ------------------------------------
    } catch (e) { console.log("Engine Error"); }
}

// Run engine every 5 seconds
setInterval(runEngine, 5000);

app.get('/api/pred', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(latestPrediction);
});

app.listen(PORT, () => console.log(`Engine running on ${PORT}`));
