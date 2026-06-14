import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { getUserId } from "../utils/auth";

function PortfolioPerformance() {
    const userId = getUserId();

    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        loadStocks();
    }, []);

    const loadStocks = async () => {
        if (!userId) return;

        const response = await apiClient.get(`/stockholdings/${userId}`);
        setStocks(response.data);
    };

    const totalCost = stocks.reduce((sum, x) => sum + Number(x.totalCost), 0);
    const totalValue = stocks.reduce((sum, x) => sum + Number(x.currentValue), 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent =
        totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <div>
                    <h2>Portfolio Performance</h2>
                    <p style={subtitleStyle}>Track your stock cost basis, market value, and gains.</p>
                </div>

                <div style={totalBadgeStyle(totalGainLoss)}>
                    {totalGainLoss >= 0 ? "+" : ""}
                    {money(totalGainLoss)} ({totalGainLossPercent.toFixed(2)}%)
                </div>
            </div>

            <div style={summaryGridStyle}>
                <Metric title="Total Cost Basis" value={money(totalCost)} />
                <Metric title="Current Value" value={money(totalValue)} />
                <Metric title="Total Gain/Loss" value={money(totalGainLoss)} positive={totalGainLoss >= 0} />
            </div>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Ticker</th>
                        <th style={thStyle}>Shares</th>
                        <th style={thStyle}>Avg Cost</th>
                        <th style={thStyle}>Current Price</th>
                        <th style={thStyle}>Cost Basis</th>
                        <th style={thStyle}>Current Value</th>
                        <th style={thStyle}>Gain/Loss</th>
                        <th style={thStyle}>Gain/Loss %</th>
                    </tr>
                </thead>

                <tbody>
                    {stocks.map((stock) => {
                        const gainLoss = Number(stock.gainLoss);
                        const gainLossPercent = Number(stock.gainLossPercent);

                        return (
                            <tr key={stock.id}>
                                <td style={tdStyle}><strong>{stock.ticker}</strong></td>
                                <td style={tdStyle}>{Number(stock.shares).toLocaleString()}</td>
                                <td style={tdStyle}>{money(stock.avgCost)}</td>
                                <td style={tdStyle}>{money(stock.currentPrice)}</td>
                                <td style={tdStyle}>{money(stock.totalCost)}</td>
                                <td style={tdStyle}>{money(stock.currentValue)}</td>
                                <td style={gainLoss >= 0 ? goodTdStyle : badTdStyle}>
                                    {gainLoss >= 0 ? "+" : ""}
                                    {money(gainLoss)}
                                </td>
                                <td style={gainLoss >= 0 ? goodTdStyle : badTdStyle}>
                                    {gainLoss >= 0 ? "+" : ""}
                                    {gainLossPercent.toFixed(2)}%
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {stocks.length === 0 && (
                <p style={emptyStyle}>No stock holdings yet. Add stocks from the Stocks page.</p>
            )}
        </div>
    );
}

function Metric({ title, value, positive }) {
    return (
        <div style={metricCardStyle}>
            <p style={metricTitleStyle}>{title}</p>
            <h3 style={{
                ...metricValueStyle,
                color: positive === undefined ? "#111827" : positive ? "#047857" : "#dc2626"
            }}>
                {value}
            </h3>
        </div>
    );
}

function money(value) {
    return Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

const cardStyle = {
    marginTop: "32px",
    padding: "28px",
    borderRadius: "18px",
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
};

const subtitleStyle = {
    color: "#6b7280",
};

const totalBadgeStyle = (value) => ({
    padding: "10px 16px",
    borderRadius: "999px",
    background: value >= 0 ? "#047857" : "#dc2626",
    color: "white",
    fontWeight: "bold",
});

const summaryGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "24px",
};

const metricCardStyle = {
    background: "#f3f4f6",
    padding: "18px",
    borderRadius: "14px",
};

const metricTitleStyle = {
    color: "#6b7280",
    margin: 0,
};

const metricValueStyle = {
    marginTop: "8px",
    marginBottom: 0,
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
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

const goodTdStyle = {
    ...tdStyle,
    color: "#047857",
    fontWeight: "bold",
};

const badTdStyle = {
    ...tdStyle,
    color: "#dc2626",
    fontWeight: "bold",
};

const emptyStyle = {
    marginTop: "16px",
    color: "#6b7280",
};

export default PortfolioPerformance;