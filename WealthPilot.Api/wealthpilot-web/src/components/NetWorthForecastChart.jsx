import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

function NetWorthForecastChart({
    currentNetWorth,
    monthlyInvestment,
    expectedAnnualReturn,
    targetAmount,
}) {
    const forecastData = buildForecastData(
        currentNetWorth,
        monthlyInvestment,
        expectedAnnualReturn,
        targetAmount
    );

    return (
        <div style={cardStyle}>
            <h2>Net Worth Forecast</h2>
            <p style={subtitleStyle}>
                Projected path based on your monthly investment and expected return.
            </p>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />

                    <YAxis
                        tickFormatter={(value) =>
                            `$${(Number(value) / 1000).toFixed(0)}K`
                        }
                    />

                    <Tooltip
                        formatter={(value) => money(value)}
                        labelFormatter={(label) => `Year: ${label}`}
                    />

                    <ReferenceLine
                        y={targetAmount}
                        label="FI Target"
                        strokeDasharray="6 6"
                    />

                    <Line
                        type="monotone"
                        dataKey="projectedNetWorth"
                        name="Projected Net Worth"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function buildForecastData(
    currentNetWorth,
    monthlyInvestment,
    expectedAnnualReturn,
    targetAmount
) {
    const data = [];
    const monthlyReturn = Number(expectedAnnualReturn) / 100 / 12;

    let balance = Number(currentNetWorth);
    let currentYear = new Date().getFullYear();

    data.push({
        year: currentYear.toString(),
        projectedNetWorth: Number(balance.toFixed(2)),
    });

    for (let year = 1; year <= 30; year++) {
        for (let month = 1; month <= 12; month++) {
            balance = balance * (1 + monthlyReturn) + Number(monthlyInvestment);
        }

        data.push({
            year: (currentYear + year).toString(),
            projectedNetWorth: Number(balance.toFixed(2)),
        });

        if (balance >= targetAmount) break;
    }

    return data;
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

const subtitleStyle = {
    color: "#6b7280",
};

export default NetWorthForecastChart;