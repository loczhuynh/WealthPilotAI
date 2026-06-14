import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { getUserId } from "../utils/auth";

function FISettings() {
    const userId = getUserId();

    const [annualExpense, setAnnualExpense] = useState("");
    const [monthlyInvestment, setMonthlyInvestment] = useState("");
    const [expectedAnnualReturn, setExpectedAnnualReturn] = useState("");
    const [fiTarget, setFiTarget] = useState(0);

    useEffect(() => {
        loadGoal();
    }, []);

    const loadGoal = async () => {
        const response = await apiClient.get(`/financialgoals/${userId}`);

        setAnnualExpense(response.data.annualExpense);
        setMonthlyInvestment(response.data.monthlyInvestment);
        setExpectedAnnualReturn(response.data.expectedAnnualReturn);
        setFiTarget(response.data.fiTarget);
    };

    const saveGoal = async (e) => {
        e.preventDefault();

        const response = await apiClient.post("/financialgoals", {
            userId,
            annualExpense: Number(annualExpense),
            monthlyInvestment: Number(monthlyInvestment),
            expectedAnnualReturn: Number(expectedAnnualReturn),
        });

        setFiTarget(response.data.fiTarget);
        alert("FI settings saved successfully.");
    };

    if (!userId) {
        return <p>Please login first.</p>;
    }

    return (
        <div>
            <h1>FI Settings</h1>

            <form onSubmit={saveGoal} style={formStyle}>
                <label style={labelStyle}>Annual Expenses</label>
                <input
                    type="number"
                    value={annualExpense}
                    onChange={(e) => setAnnualExpense(e.target.value)}
                    style={inputStyle}
                />

                <label style={labelStyle}>Monthly Investment</label>
                <input
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(e.target.value)}
                    style={inputStyle}
                />

                <label style={labelStyle}>Expected Annual Return (%)</label>
                <input
                    type="number"
                    value={expectedAnnualReturn}
                    onChange={(e) => setExpectedAnnualReturn(e.target.value)}
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>
                    Save FI Settings
                </button>
            </form>

            <div style={resultCardStyle}>
                <h2>Your FI Target</h2>
                <h1>{money(fiTarget)}</h1>
                <p>Calculated as annual expenses × 25.</p>
            </div>
        </div>
    );
}

function money(value) {
    return Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

const formStyle = {
    maxWidth: "480px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
};

const labelStyle = {
    fontWeight: "bold",
};

const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
};

const buttonStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#047857",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "12px",
};

const resultCardStyle = {
    marginTop: "28px",
    padding: "24px",
    borderRadius: "12px",
    background: "#f3f4f6",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    maxWidth: "480px",
};

export default FISettings;