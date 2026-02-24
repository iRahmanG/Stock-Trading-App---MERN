
<div align="center">

# Trading App

### A Real-Time Full-Stack Stock Trading Simulator

**Trading App is a secure, scalable MERN stack platform that enables users to simulate stock market trading using live data. It implements real-time market feeds, automated currency conversion, portfolio valuation, and private transaction ledgers—designed with a professional Bento-style architecture.**

Focused on real-world financial software practices such as JWT authentication, transactional integrity, live API integration, and responsive data visualization, this project demonstrates enterprise-grade full-stack development using MongoDB, Express, React, and Node.js.

[Features](https://www.google.com/search?q=%23-key-features) • [Architecture](https://www.google.com/search?q=%23-architecture--flow) • [Tech Stack](https://www.google.com/search?q=%23-tech-stack--architecture) • [Getting Started](https://www.google.com/search?q=%23-getting-started)

</div>

---

## Project Overview

Many beginner trading projects rely on static or hardcoded data. **Trading App** handles real-world market complexities to provide a professional simulation experience.

**Trading App** was built to demonstrate:

* **Live Market Integration**: Real-time price fetching via Yahoo Finance API.
* **Advanced Visualization**: Interactive technical analysis using TradingView charts.
* **Currency Intelligence**: Automatic conversion for global stocks (USD to INR).
* **Transaction Security**: Secure JWT-based authentication and private data isolation.
* **Financial Logic**: Real-time holding validation and balance-aware order processing.

---

## Architecture & Flow

```mermaid
graph TD
    A[React Frontend] --> B[Express Backend]
    B --> C[MongoDB Database]
    B --> D[Yahoo Finance API]
    A --> E[TradingView Widget]
    B --> F[JWT Security Layer]
    F --> B

```

### Architectural Highlights

* **MERN Stack** (MongoDB, Express, React, Node.js)
* **Bento Grid UI Design** for a high-density, professional dashboard
* **RESTful API Design** for order management and market data
* **Real-Time Portfolio Valuation** logic (Cash + Live Market Value)
* **Stateless Authentication** using JSON Web Tokens (JWT)

---

## Key Features

<table>
<tr>
<td width="50%">

### Market Intelligence

* Live global ticker search (NSE, NASDAQ, NYSE)
* Real-time watchlists with price change indicators
* Professional TradingView candlestick charts
* Global index performance tracking

</td>
<td width="50%">

### Trading Logic

* Instant Buy/Sell execution with automated balance deduction
* Holding validation to prevent selling unowned stocks
* Dynamic currency conversion for international markets

</td>
</tr>

<tr>
<td width="50%">

### Portfolio Analytics

* Real-time Net Worth calculation
* Sector Exposure visualization
* Available liquidity (Buying Power) tracking
* Private Transaction Ledger filtered by user

</td>
<td width="50%">

### Secure Infrastructure

* JWT-based authentication system
* Protected API routes for all financial transactions
* Cross-Origin Resource Sharing (CORS) configured for security
* Robust error handling for market data failure

</td>
</tr>
</table>

---

## Tech Stack & Architecture

### Core Technologies

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Data Provider:** Yahoo Finance (via yahoo-finance2)
* **Charts:** TradingView Advanced Real-Time Chart Widget

---

### Key Domain Logic

* **Net Worth Formula**: $\text{Available Cash} + \sum (\text{Holding Qty} \times \text{Current Live Price})$
* **Forex Logic**: Automatic application of simulation conversion rate (e.g., 83.00) for USD-denominated assets.
* **Inventory Safety**: Backend reduce-logic to calculate current holdings from order history before allowing a sell order.

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/trading-app.git

```

### Configure Environment Variables

Create a `.env` file in the `/server` directory:

```properties
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

```

---

### Run the Application

**Start Backend:**

```bash
cd server
npm run dev

```

**Start Frontend:**

```bash
cd client
npm run dev

```

The application will be accessible at:

```
http://localhost:5173

```

---

## Learning Outcomes

This project demonstrates proficiency in:

* **Live API Orchestration**: Managing asynchronous data from external financial feeds.
* **Full-Stack Security**: Implementing data isolation so users only see their own private ledgers.
* **Complex UI State**: Synchronizing global auth state with real-time market valuations.
* **Financial Data Modeling**: Proper entity relationships for Users and Orders in a MERN environment.

---

## Future Enhancements (Planned)

* Stop-loss and Limit order functionality
* Real-time WebSocket updates for price changes
* Advanced portfolio diversification charts
* User watchlist persistence (Pinning stocks)
* Historical performance tracking (P&L over time)

---

## Author
**Maksud Rahman**

GitHub: [https://github.com/iRahmanG](https://github.com/iRahmanG)


---

<div align="center">

⭐ If this project helped you understand trading terminal architecture, consider starring the repository!

</div>

---

**Would you like me to help you finalize any other part of the project before your final presentation?**
