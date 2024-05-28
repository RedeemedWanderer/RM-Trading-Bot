function simulate() {
    const initialCapital = document.getElementById('initialCapital').value;
    const days = document.getElementById('days').value;
    const finalValue = runSimulation(initialCapital, days);
    document.getElementById('result').innerText = `Final Portfolio Value: $${finalValue.toFixed(2)}`;
}

function runSimulation(initialCapital, days) {
    let capital = parseFloat(initialCapital);
    let prices = [100];  // Starting price

    for (let i = 1; i < days; i++) {
        let change = (Math.random() * 10) - 5;  // Random change between -5% and 5%
        let newPrice = prices[prices.length - 1] * (1 + change / 100);
        prices.push(newPrice);
    }

    // Simple moving average strategy simulation
    let shortWindow = 20;
    let longWindow = 50;
    let signals = calculateSignals(prices, shortWindow, longWindow);
    capital = simulateTrading(capital, prices, signals);

    return capital;
}

function calculateSignals(prices, shortWindow, longWindow) {
    let shortMavg = [];
    let longMavg = [];
    let signals = Array(prices.length).fill(0);

    for (let i = 0; i < prices.length; i++) {
        let shortSlice = prices.slice(Math.max(i - shortWindow + 1, 0), i + 1);
        let longSlice = prices.slice(Math.max(i - longWindow + 1, 0), i + 1);
        shortMavg.push(shortSlice.reduce((a, b) => a + b, 0) / shortSlice.length);
        longMavg.push(longSlice.reduce((a, b) => a + b, 0) / longSlice.length);

        if (i >= shortWindow && shortMavg[i] > longMavg[i] && shortMavg[i - 1] <= longMavg[i - 1]) {
            signals[i] = 1;  // Buy signal
        } else if (i >= shortWindow && shortMavg[i] < longMavg[i] && shortMavg[i - 1] >= longMavg[i - 1]) {
            signals[i] = -1;  // Sell signal
        }
    }

    return signals;
}

function simulateTrading(capital, prices, signals) {
    let position = 0;

    for (let i = 0; i < prices.length; i++) {
        if (signals[i] === 1) {  // Buy signal
            position = capital / prices[i];
            capital -= position * prices[i];
        } else if (signals[i] === -1 && position > 0) {  // Sell signal
            capital += position * prices[i];
            position = 0;
        }
    }

    if (position > 0) {
        capital += position * prices[prices.length - 1];
    }

    return capital;
}
