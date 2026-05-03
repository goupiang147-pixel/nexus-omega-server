const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

let latestPrediction = { period: "---", pred: "---", conf: 0 };

// 1. Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Your API endpoint
app.get('/api/pred', (req, res) => {
    res.json(latestPrediction);
});

// 3. The Engine Loop
async function engineLoop() {
    try {
        const res = await fetch("https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json");
        const data = await res.json();
        // Add your complex 12-engine logic here later
        latestPrediction = { period: data.data.list[0].issueNumber, pred: "BIG" };
    } catch (e) { console.log("Engine Error"); }
}

setInterval(engineLoop, 5000);
engineLoop();

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
