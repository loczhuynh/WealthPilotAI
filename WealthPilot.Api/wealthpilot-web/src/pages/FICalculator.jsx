import { useState } from "react";
import apiClient from "../api/apiClient";

function FICalculator() {
    const [currentNetWorth, setCurrentNetWorth] = useState("89600");
    const [monthlyInvestment, setMonthlyInvestment] = useState("2000");
    const [expectedAnnualReturn, setExpectedAnnualReturn] = useState("8");
    const [targetAmount, setTargetAmount] = useState("1000000");
    const [result, setResult] = useState(null);

    const calculateFI = async (e) => {
        e.preventDefault();

        const response = await apiClient.post("/ficalculator", {
            currentNetWorth: Number(currentNetWorth),
            monthlyInvestment: Number(monthlyInvestment),
            expectedAnnualReturn: Number(expectedAnnualReturn),
            targetAmount: Number(targetAmount),
        });

        setResult(response.data);
    };

    return (
        <div>
            <h1>FI Calculator</h1>

            <form onSubmit={calculateFI} style={formStyle}>
                <input
                    type="number"
                    placeholder="Current Net Worth"
                    value={currentNetWorth}
                    onChange={(e) => setCurrentNetWorth(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="number"
                    placeholder="Monthly Investment"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="number"
                    placeholder="Expected Annual Return %"
                    value={expectedAnnualReturn}
                    onChange={(e) => setExpectedAnnualReturn(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="number"
                    placeholder="Target Amount"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>
                    Calculate
                </button>
            </form>

            {result && (
                <div style={resultCardStyle}>
                    <h2>FI Result</h2>

                    <p>
                        <strong>Target Amount:</strong>{" "}
                        ${Number(result.targetAmount).toLocaleString()}
                    </p>

                    <p>
                        <strong>Months to FI:</strong> {result.monthsToFI}
                    </p>

                    <p>
                        <strong>Years to FI:</strong> {result.yearsToFI} years and{" "}
                        {result.remainingMonths} months
                    </p>

                    <p>
                        <strong>Estimated Final Balance:</strong>{" "}
                        ${Number(result.estimatedFinalBalance).toLocaleString()}
                    </p>
                </div>
            )}
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

const resultCardStyle = {
    marginTop: "24px",
    padding: "24px",
    borderRadius: "12px",
    background: "#f3f4f6",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    maxWidth: "500px",
};

export default FICalculator;