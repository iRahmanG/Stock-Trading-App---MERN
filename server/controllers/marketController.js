const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();
// @desc    Get live stock quotes from Yahoo Finance
// @route   GET /api/market
const getLiveStocks = async (req, res) => {
    try {
        // You can add any global ticker here! 
        // Note: Indian stocks need '.NS' (NSE) or '.BO' (BSE) at the end
        const symbols = ['AAPL', 'TSLA', 'NVDA', 'RELIANCE.NS', 'TCS.NS', 'INFY.NS']; 
        
        // Fetch all quotes simultaneously 
        const quotes = await Promise.all(symbols.map(symbol => yahooFinance.quote(symbol)));

        // Format the messy Yahoo data into clean objects for your React frontend
        const liveStocks = quotes.map(quote => ({
            _id: quote.symbol, // Use symbol as a unique ID
            symbol: quote.symbol.replace('.NS', ''), // Clean up the name for the UI
            name: quote.shortName || quote.longName,
            price: quote.regularMarketPrice,
            changePercent: quote.regularMarketChangePercent,
            stockExchange: quote.exchange === 'NSI' ? 'NSE' : quote.exchange
        }));

        res.status(200).json(liveStocks);
    } catch (error) {
        console.error("Yahoo Finance API Error:", error);
        res.status(500).json({ message: 'Failed to fetch live market data' });
    }
};

module.exports = { getLiveStocks };