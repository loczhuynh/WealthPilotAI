import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import StatCard from "../components/StatCard";
import { getUserId } from "../utils/auth";
import FIProgressCard from "../components/FIProgressCard";
import PortfolioPerformance from "../components/PortfolioPerformance";
import NetWorthForecastChart from "../components/NetWorthForecastChart";
import AIInsightsCard from "../components/AIInsightsCard";
import FIScenarioSimulator from "../components/FIScenarioSimulator";
import FIStrategyComparison from "../components/FIStrategyComparison";
import PortfolioCoachCard from "../components/PortfolioCoachCard";
import WealthPilotAssistant from "../components/ai/WealthPilotAssistant";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

const PIE_COLORS = [
    "#2563eb", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#ec4899", // Pink
];

const pieCardStyle = {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginTop: "24px",
};

const tooltipStyle = {
    background: "white",
    padding: "12px 16px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    border: "1px solid #e5e7eb",
};

function Dashboard() {
    const userId = getUserId();

    if (!userId) {
        return <p>Please login first.</p>;
    }

    const [data, setData] = useState(null);
    const [snapshots, setSnapshots] = useState([]);
    const [allocation, setAllocation] = useState([]);
    const [financialGoal, setFinancialGoal] = useState(null);

    const loadDashboard = async () => {
        const response = await apiClient.get(`/dashboard/${userId}`);
        setData(response.data);
    };

    const loadFinancialGoal = async () => {
        const response = await apiClient.get(`/financialgoals/${userId}`);
        setFinancialGoal(response.data);
    };

    const loadSnapshots = async () => {
        const response = await apiClient.get(`/networthsnapshots/${userId}`);

        const chartData = response.data.map((item) => ({
            date: new Date(item.snapshotDate).toLocaleString(),
            netWorth: Number(item.netWorth),
        }));

        console.log("Chart Data:", chartData);

        setSnapshots(chartData);
    };

    const loadAllocation = async () => {
        const assetsResponse = await apiClient.get(`/assets/${userId}`);
        const stocksResponse = await apiClient.get(`/stockholdings/${userId}`);

        const assetData = assetsResponse.data.map((asset) => ({
            name: asset.name,
            value: Number(asset.value),
        }));

        const stockData = stocksResponse.data.map((stock) => ({
            name: stock.ticker,
            value: Number(stock.currentValue),
        }));

        setAllocation([...assetData, ...stockData].filter(x => x.value > 0));
    };

    const saveSnapshot = async () => {
        await apiClient.post(`/networthsnapshots/${userId}`);
        loadSnapshots();
    };

    useEffect(() => {
        const initializeDashboard = async () => {
            await loadDashboard();
            await saveSnapshot();
            await loadSnapshots();
            await loadAllocation();
            await loadFinancialGoal();
        };

        initializeDashboard();
    }, []);

    if (!data) return <p>Loading dashboard...</p>;

    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            const total = allocation.reduce((sum, x) => sum + x.value, 0);
            const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;

            return (
                <div style={tooltipStyle}>
                    <h4 style={{ margin: "0 0 8px 0" }}>{item.name}</h4>
                    <p style={{ margin: 0 }}>
                        Value: ${Number(item.value).toLocaleString()}
                    </p>
                    <p style={{ margin: 0 }}>
                        Allocation: {percent}%
                    </p>
                </div>
            );
        }
    };

    const totalAllocationValue = allocation.reduce(
        (sum, item) => sum + item.value,
        0
    );

    const fiProgress = financialGoal
        ? (Number(data.netWorth) / Number(financialGoal.fiTarget)) * 100
        : 0;

    const nextMilestone = getNextMilestone(fiProgress);

    const nextMilestoneAmount = financialGoal
        ? Number(financialGoal.fiTarget) * (nextMilestone / 100)
        : 0;

    const nextMilestoneGap = Math.max(
        nextMilestoneAmount - Number(data.netWorth),
        0
    );

    const yearsToFI = financialGoal
        ? calculateYearsToFI(
            Number(data.netWorth),
            Number(financialGoal.monthlyInvestment),
            Number(financialGoal.expectedAnnualReturn),
            Number(financialGoal.fiTarget)
        )
        : 0;

    return (
        <div>
            <h1>WealthPilot AI Dashboard</h1>

            <div style={gridStyle}>
                <StatCard title="Total Assets" value={data.totalAssets} />
                <StatCard title="Total Debts" value={data.totalDebts} />
                <StatCard title="Stock Value" value={data.stockValue} />
                <StatCard title="Net Worth" value={data.netWorth} />
            </div>

            {
                financialGoal && (
                    <FIProgressCard
                        currentNetWorth={Number(data.netWorth)}
                        targetAmount={financialGoal.fiTarget}
                        monthlyInvestment={financialGoal.monthlyInvestment}
                        expectedAnnualReturn={financialGoal.expectedAnnualReturn}
                    />
                )
            }

            {financialGoal && (
                <NetWorthForecastChart
                    currentNetWorth={Number(data.netWorth)}
                    monthlyInvestment={Number(financialGoal.monthlyInvestment)}
                    expectedAnnualReturn={Number(financialGoal.expectedAnnualReturn)}
                    targetAmount={Number(financialGoal.fiTarget)}
                />
            )}

            {financialGoal && (
                <AIInsightsCard
                    netWorth={Number(data.netWorth)}
                    stockValue={Number(data.stockValue)}
                    fiProgress={fiProgress}
                    nextMilestoneAmount={nextMilestoneGap}
                    monthlyInvestment={Number(financialGoal.monthlyInvestment)}
                    yearsToFI={yearsToFI}
                />
            )}

            {financialGoal && (
                <FIScenarioSimulator
                    currentNetWorth={Number(data.netWorth)}
                    currentMonthlyInvestment={Number(financialGoal.monthlyInvestment)}
                    currentExpectedReturn={Number(financialGoal.expectedAnnualReturn)}
                    currentTargetAmount={Number(financialGoal.fiTarget)}
                    currentYearsToFI={yearsToFI}
                />
            )}

            {financialGoal && (
                <FIStrategyComparison
                    currentNetWorth={Number(data.netWorth)}
                    monthlyInvestment={Number(financialGoal.monthlyInvestment)}
                    expectedAnnualReturn={Number(financialGoal.expectedAnnualReturn)}
                    targetAmount={Number(financialGoal.fiTarget)}
                />
            )}

            <PortfolioPerformance />

            <PortfolioCoachCard />

            <WealthPilotAssistant
                dashboardData={{
                    fiDate: "Jan 2047",
                    yearsToFI: yearsToFI,
                    portfolioScore: 90,
                    wealthScore: 82,
                    bestPerformer: "QQQ is your strongest performer at +16.73%.",
                    worstPerformer: "KYMR is your weakest holding at -12.11%.",
                    biggestRisk: "KYMR is currently down 12.11%. Review whether the thesis still holds.",
                }}
            />

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
                                    domain={["auto", "auto"]}
                                    tickFormatter={(value) =>
                                        `$${Number(value).toLocaleString()}`
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

                <div style={pieCardStyle}>

                    <h2>Asset Allocation</h2>

                    {allocation.length === 0 ? (
                        <p>No asset allocation data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={allocation}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={85}
                                    outerRadius={140}
                                    label={false}
                                >
                                {allocation.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                                    />
                                ))}
                                </Pie>

                                <text
                                    x="50%"
                                    y="47%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    style={{
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                        fill: "#111827",
                                    }}
                                >
                                    ${Number(totalAllocationValue).toLocaleString()}
                                </text>

                                <text
                                    x="50%"
                                    y="55%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    style={{
                                        fontSize: "14px",
                                        fill: "#6b7280",
                                    }}
                                >
                                    Portfolio Value
                                </text>

                                <Tooltip content={<CustomPieTooltip />} />

                                <Legend
                                    verticalAlign="bottom"
                                    height={50}
                                    formatter={(value) => {
                                        const item = allocation.find(x => x.name === value);
                                        const total = allocation.reduce((sum, x) => sum + x.value, 0);
                                        const percent = item ? ((item.value / total) * 100).toFixed(1) : 0;

                                        return `${value} ${percent}%`;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>               
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


const chartCardStyle = {
    marginTop: "32px",
    padding: "24px",
    borderRadius: "12px",
    background: "#f3f4f6",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

function getNextMilestone(progress) {
    if (progress < 1) return 1;
    if (progress < 5) return 5;
    if (progress < 10) return 10;
    if (progress < 25) return 25;
    if (progress < 50) return 50;
    if (progress < 75) return 75;
    if (progress < 100) return 100;
    return 100;
}

function calculateYearsToFI(currentNetWorth, monthlyInvestment, annualReturn, targetAmount) {
    const monthlyReturn = annualReturn / 100 / 12;
    let balance = Number(currentNetWorth);
    let months = 0;

    while (balance < targetAmount && months < 1200) {
        balance = balance * (1 + monthlyReturn) + Number(monthlyInvestment);
        months++;
    }

    return Number((months / 12).toFixed(1));
}

export default Dashboard;