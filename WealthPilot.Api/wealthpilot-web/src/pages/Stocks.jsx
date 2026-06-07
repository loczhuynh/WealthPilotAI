import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { getUserId } from "../utils/auth";
function Stocks() {
    const userId = getUserId();

    const [stocks, setStocks] = useState([]);
    const [ticker, setTicker] = useState("");
    const [shares, setShares] = useState("");
    const [avgCost, setAvgCost] = useState("");
    const [currentPrice, setCurrentPrice] = useState("");

    const loadStocks = async () => {
        const response = await apiClient.get(`/stockholdings/${userId}`);
        setStocks(response.data);
    };

    useEffect(() => {
        loadStocks();
    }, []);

    const addStock = async (e) => {
        e.preventDefault();

        if (!ticker || !shares || !avgCost || !currentPrice) {
            alert("Please enter ticker, shares, average cost, and current price.");
            return;
        }

        await apiClient.post("/stockholdings", {
            userId,
            ticker,
            shares: Number(shares),
            avgCost: Number(avgCost),
            currentPrice: Number(currentPrice),
        });

        setTicker("");
        setShares("");
        setAvgCost("");
        setCurrentPrice("");
        loadStocks();
    };

    const deleteStock = async (id) => {
        await apiClient.delete(`/stockholdings/${id}`);
        loadStocks();
    };

    return (
        <div>
            <h1>Stocks</h1>

            <form onSubmit={addStock} style={formStyle}>
                <input
                    type="text"
                    placeholder="Ticker"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="number"
                    placeholder="Shares"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="number"
                    placeholder="Avg cost"
                    value={avgCost}
                    onChange={(e) => setAvgCost(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="number"
                    placeholder="Current price"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>
                    Add Stock
                </button>
            </form>

            <h2>Current Stock Holdings</h2>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Ticker</th>
                        <th style={thStyle}>Shares</th>
                        <th style={thStyle}>Avg Cost</th>
                        <th style={thStyle}>Current Price</th>
                        <th style={thStyle}>Current Value</th>
                        <th style={thStyle}>Gain / Loss</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {stocks.map((stock) => (
                        <tr key={stock.id}>
                            <td style={tdStyle}>{stock.ticker}</td>
                            <td style={tdStyle}>{stock.shares}</td>
                            <td style={tdStyle}>${Number(stock.avgCost).toLocaleString()}</td>
                            <td style={tdStyle}>${Number(stock.currentPrice).toLocaleString()}</td>
                            <td style={tdStyle}>${Number(stock.currentValue).toLocaleString()}</td>
                            <td style={tdStyle}>
                                ${Number(stock.gainLoss).toLocaleString()}
                            </td>
                            <td style={tdStyle}>
                                <button
                                    onClick={() => deleteStock(stock.id)}
                                    style={deleteButtonStyle}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const formStyle = {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
};

const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
};

const buttonStyle = {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
};

const deleteButtonStyle = {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
};

const thStyle = {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #e5e7eb",
};

const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
};

export default Stocks;