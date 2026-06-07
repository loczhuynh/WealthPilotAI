import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import StatCard from "../components/StatCard";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

function Dashboard() {
    const userId = 1;

    const [data, setData] = useState(null);
    const [snapshots, setSnapshots] = useState([]);

    const loadDashboard = async () => {
        const response = await apiClient.get(`/dashboard/${userId}`);
        setData(response.data);
    };

    const loadSnapshots = async () => {
        const response = await apiClient.get(`/networthsnapshots/${userId}`);

        const chartData = response.data.map((item) => ({
            date: new Date(item.snapshotDate).toLocaleString(),
            netWorth: item.netWorth,
        }));

        setSnapshots(chartData);
    };

    const saveSnapshot = async () => {
        await apiClient.post(`/networthsnapshots/${userId}`);
        loadSnapshots();
    };

    useEffect(() => {
        const initializeDashboard = async () => {
            await saveSnapshot();
            await loadDashboard();
            await loadSnapshots();
        };

        initializeDashboard();
    }, []);

    if (!data) return <p>Loading dashboard...</p>;

    return (
        <div>
            <h1>WealthPilot AI Dashboard</h1>

            <div style={gridStyle}>
                <StatCard title="Total Assets" value={data.totalAssets} />
                <StatCard title="Total Debts" value={data.totalDebts} />
                <StatCard title="Stock Value" value={data.stockValue} />
                <StatCard title="Net Worth" value={data.netWorth} />
            </div>

            <div style={chartCardStyle}>
                <h2>Net Worth Trend</h2>

                {snapshots.length === 0 ? (
                    <p>No snapshots yet. Click “Save Net Worth Snapshot”.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={snapshots}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis
                                tickFormatter={(value) =>
                                    `$${(value / 1000).toFixed(0)}K`
                                }
                            />
                            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                            <Line
                                type="monotone"
                                dataKey="netWorth"
                                strokeWidth={3}
                                dot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginTop: "20px",
};

const buttonStyle = {
    marginTop: "24px",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#047857",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
};

const chartCardStyle = {
    marginTop: "32px",
    padding: "24px",
    borderRadius: "12px",
    background: "#f3f4f6",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

export default Dashboard;