const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// @desc    Get live quotes for the dashboard
// @route   GET /api/market
const getLiveStocks = async (req, res) => {
    try {
        const symbols = ['AAPL', 'TSLA', 'NVDA', 'RELIANCE.NS', 'TCS.NS', 'INFY.NS']; 
        const quotes = [];

        for (let symbol of symbols) {
            try {
                const quote = await yahooFinance.quote(symbol);
                if (quote) quotes.push(quote);
            } catch (err) {
                console.error(`⚠️ Skipping ${symbol}: Market data unavailable.`);
            }
        }

        const liveStocks = quotes.map(quote => ({
            _id: quote.symbol, 
            symbol: quote.symbol.replace('.NS', '').replace('.BO', ''),
            name: quote.shortName || quote.longName || quote.symbol,
            price: quote.regularMarketPrice || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            stockExchange: quote.exchange === 'NSI' ? 'NSE' : (quote.exchange || 'NASDAQ')
        }));

        res.status(200).json(liveStocks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch live market data' });
    }
};

// @desc    Get a single stock for search and trade pages
// @route   GET /api/market/:symbol
const getStockBySymbol = async (req, res) => {
    try {
        const { symbol } = req.params;
        const quote = await yahooFinance.quote(symbol);
        
        if (!quote) return res.status(404).json({ message: "Stock not found" });

        res.status(200).json({
            _id: quote.symbol, 
            symbol: quote.symbol.replace('.NS', '').replace('.BO', ''),
            name: quote.shortName || quote.longName || quote.symbol,
            price: quote.regularMarketPrice || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            stockExchange: quote.exchange === 'NSI' ? 'NSE' : (quote.exchange || 'NASDAQ')
        });
    } catch (error) {
        res.status(404).json({ message: 'Stock not found. Check the symbol.' });
    }
};

module.exports = { getLiveStocks, getStockBySymbol };