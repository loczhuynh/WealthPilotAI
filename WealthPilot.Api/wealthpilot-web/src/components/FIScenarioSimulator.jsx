import { useState } from "react";

function FIScenarioSimulator({
    currentNetWorth,
    currentMonthlyInvestment,
    currentExpectedReturn,
    currentTargetAmount,
    currentYearsToFI,
}) {
    const [monthlyInvestment, setMonthlyInvestment] = useState(currentMonthlyInvestment);
    const [expectedReturn, setExpectedReturn] = useState(currentExpectedReturn);
    const [targetAmount, setTargetAmount] = useState(currentTargetAmount);

    const simulatedYearsToFI = calculateYearsToFI(
        currentNetWorth,
        Number(monthlyInvestment),
        Number(expectedReturn),
        Number(targetAmount)
    );

    const currentFiDate = getEstimatedFiDate(currentYearsToFI);
    const simulatedFiDate = getEstimatedFiDate(simulatedYearsToFI);
    const yearsSaved = Math.max(Number(currentYearsToFI) - Number(simulatedYearsToFI), 0);
    const yearsSavedColor =
        yearsSaved > 5
            ? "#047857"
            : yearsSaved > 2
                ? "#059669"
                : "#f59e0b";


    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <div>
                    <h2>🧪 FI Scenario Simulator</h2>
                    <p style={subtitleStyle}>
                        See how changing your investment plan affects your FI date.
                    </p>
                </div>

                <div style={{ ...badgeStyle, background: yearsSavedColor }}>
                    ⏱️ Reach FI {yearsSaved.toFixed(1)} Years Earlier 
                </div>
            </div>

            <div style={inputGridStyle}>
                <label style={labelStyle}>
                    Monthly Investment
                    <input
                        type="number"
                        value={monthlyInvestment}
                        onChange={(e) => setMonthlyInvestment(e.target.value)}
                        style={inputStyle}
                    />

                    <div style={{
                        marginTop: "6px",
                        color: "#6b7280",
                        fontSize: "14px"
                    }}>
                        {money(monthlyInvestment)} / month
                    </div>
                </label>

                <label style={labelStyle}>
                    Expected Annual Return (%)
                    <input
                        type="number"
                        value={expectedReturn}
                        onChange={(e) => setExpectedReturn(e.target.value)}
                        style={inputStyle}
                    />
                </label>

                <label style={labelStyle}>
                    FI Target
                    <input
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        style={inputStyle}
                    />
                    <div
                        style={{
                            marginTop: "6px",
                            color: "#6b7280",
                            fontSize: "14px",
                            fontWeight: "600"
                        }}
                    >
                        🎯 {money(targetAmount)}
                    </div>
                </label>

                
            </div>

            <div style={resultGridStyle}>
                <Metric title="Current FI Date" value={currentFiDate} />
                <Metric title="Scenario FI Date" value={simulatedFiDate} />
                <Metric title="Years to FI" value={`${simulatedYearsToFI} years`} />
                <Metric
                    title="Years Saved"
                    value={`🎉 ${yearsSaved.toFixed(1)} Years`}
                    color={yearsSavedColor}
                />
            </div>

            <div style={insightStyle}>
                💡 Increasing your monthly investment to{" "}
                <strong>{money(monthlyInvestment)}</strong> with an expected return of{" "}
                <strong>{expectedReturn}%</strong> could move your FI date from{" "}
                <strong>{currentFiDate}</strong> to <strong>{simulatedFiDate}</strong>.
            </div>
        </div>
    );
}

function Metric({ title, value, color }) {
    return (
        <div style={metricCardStyle}>
            <p style={metricTitleStyle}>{title}</p>
            <h3 style={{ ...metricValueStyle, color: color || "#111827" }}>
                {value}
            </h3>
        </div>
    );
}

function calculateYearsToFI(currentNetWorth, monthlyInvestment, annualReturn, targetAmount) {
    const monthlyReturn = annualReturn / 100 / 12;
    let balance = Number(currentNetWorth);
    let months = 0;

    while (balance < Number(targetAmount) && months < 1200) {
        balance = balance * (1 + monthlyReturn) + Number(monthlyInvestment);
        months++;
    }

    return Number((months / 12).toFixed(1));
}

function getEstimatedFiDate(yearsRemaining) {
    const date = new Date();
    date.setMonth(date.getMonth() + Math.round(Number(yearsRemaining) * 12));

    return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

function money(value) {
    return Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

const cardStyle = {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    marginTop: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
};

const subtitleStyle = {
    color: "#6b7280",
    marginTop: "-8px",
};

const badgeStyle = {
    background: "#047857",
    color: "white",
    padding: "14px 20px",
    borderRadius: "999px",
    fontWeight: "bold",
};

const inputGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
    marginBottom: "24px",
};

const labelStyle = {
    display: "flex",
    flexDirection: "column",
    fontWeight: "bold",
    gap: "8px",
};

const inputStyle = {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
};

const resultGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "20px",
};

const metricCardStyle = {
    background: "#f9fafb",
    padding: "18px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
};

const metricTitleStyle = {
    color: "#6b7280",
    margin: 0,
};

const metricValueStyle = {
    marginTop: "8px",
    marginBottom: 0,
};

const insightStyle = {
    background: "#ecfdf5",
    color: "#047857",
    padding: "18px",
    borderRadius: "16px",
    fontWeight: "600",
};

export default FIScenarioSimulator;