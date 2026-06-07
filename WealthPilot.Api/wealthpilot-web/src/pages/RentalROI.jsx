import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";



function RentalROI() {
    const [form, setForm] = useState({
        propertyName: "Sample Property",
        purchasePrice: 250000,
        downPayment: 50000,
        closingCosts: 7000,
        monthlyRent: 2200,
        monthlyMortgage: 1450,
        monthlyPropertyTax: 300,
        monthlyInsurance: 120,
        monthlyHOA: 0,
        monthlyRepairs: 150,
        monthlyVacancyAllowance: 150,
        monthlyPropertyManagement: 180,
    });

    useEffect(() => {
        loadSavedDeals();
    }, []);

    const [result, setResult] = useState(null);
    const [savedDeals, setSavedDeals] = useState([]);

    const updateField = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const calculateROI = async (e) => {
        e.preventDefault();

        const response = await apiClient.post("/rentalroicalculator", {
            purchasePrice: Number(form.purchasePrice),
            downPayment: Number(form.downPayment),
            closingCosts: Number(form.closingCosts),
            monthlyRent: Number(form.monthlyRent),
            monthlyMortgage: Number(form.monthlyMortgage),
            monthlyPropertyTax: Number(form.monthlyPropertyTax),
            monthlyInsurance: Number(form.monthlyInsurance),
            monthlyHOA: Number(form.monthlyHOA),
            monthlyRepairs: Number(form.monthlyRepairs),
            monthlyVacancyAllowance: Number(form.monthlyVacancyAllowance),
            monthlyPropertyManagement: Number(form.monthlyPropertyManagement),
        });

        setResult(response.data);
    };

    const saveDeal = async () => {
        if (!result) return;

        await apiClient.post("/rentalproperties", {
            userId: 1,
            propertyName: form.propertyName,
            purchasePrice: result.purchasePrice,
            loanAmount: result.loanAmount,
            monthlyRent: result.monthlyRent,
            monthlyExpenses: result.monthlyExpenses,
            monthlyCashFlow: result.monthlyCashFlow,
            annualCashFlow: result.annualCashFlow,
            noi: result.noi,
            capRate: result.capRate,
            totalCashInvested: result.totalCashInvested,
            cashOnCashReturn: result.cashOnCashReturn,
        });

        loadSavedDeals();
    };

    const loadSavedDeals = async () => {
        const response = await apiClient.get("/rentalproperties/1");
        setSavedDeals(response.data);
    };

    const deleteDeal = async (id) => {
        await apiClient.delete(`/rentalproperties/${id}`);
        loadSavedDeals();
    };

    return (
        <div>
            <h1>Rental ROI Calculator</h1>

            <form onSubmit={calculateROI} style={formStyle}>
                <Input label="Property Name" value={form.propertyName} onChange={(v) => updateField("propertyName", v)} type="text" />
                <Input label="Purchase Price" value={form.purchasePrice} onChange={(v) => updateField("purchasePrice", v)} />
                <Input label="Down Payment" value={form.downPayment} onChange={(v) => updateField("downPayment", v)} />
                <Input label="Closing Costs" value={form.closingCosts} onChange={(v) => updateField("closingCosts", v)} />
                <Input label="Monthly Rent" value={form.monthlyRent} onChange={(v) => updateField("monthlyRent", v)} />
                <Input label="Monthly Mortgage" value={form.monthlyMortgage} onChange={(v) => updateField("monthlyMortgage", v)} />
                <Input label="Monthly Property Tax" value={form.monthlyPropertyTax} onChange={(v) => updateField("monthlyPropertyTax", v)} />
                <Input label="Monthly Insurance" value={form.monthlyInsurance} onChange={(v) => updateField("monthlyInsurance", v)} />
                <Input label="Monthly HOA" value={form.monthlyHOA} onChange={(v) => updateField("monthlyHOA", v)} />
                <Input label="Monthly Repairs" value={form.monthlyRepairs} onChange={(v) => updateField("monthlyRepairs", v)} />
                <Input label="Vacancy Allowance" value={form.monthlyVacancyAllowance} onChange={(v) => updateField("monthlyVacancyAllowance", v)} />
                <Input label="Property Management" value={form.monthlyPropertyManagement} onChange={(v) => updateField("monthlyPropertyManagement", v)} />

                <button type="submit" style={buttonStyle}>Calculate ROI</button>
            </form>

            {result && (
                <div style={resultCardStyle}>
                    <h2>Rental ROI Result</h2>

                    <h3>{form.propertyName}</h3>

                    <p><strong>Purchase Price:</strong> {money(result.purchasePrice)}</p>
                    <p><strong>Loan Amount:</strong> {money(result.loanAmount)}</p>
                    <p><strong>Monthly Rent:</strong> {money(result.monthlyRent)}</p>
                    <p><strong>Monthly Expenses:</strong> {money(result.monthlyExpenses)}</p>

                    <p style={result.monthlyCashFlow >= 0 ? goodStyle : badStyle}>
                        <strong>Monthly Cash Flow:</strong> {money(result.monthlyCashFlow)}
                        {result.monthlyCashFlow >= 0 ? " ✅ Positive" : " ❌ Negative"}
                    </p>

                    <p><strong>Annual Cash Flow:</strong> {money(result.annualCashFlow)}</p>
                    <p><strong>NOI:</strong> {money(result.noi)}</p>
                    <p><strong>Cap Rate:</strong> {result.capRate}%</p>
                    <p><strong>Cash-on-Cash Return:</strong> {result.cashOnCashReturn}%</p>

                    <div style={ratingBoxStyle}>
                        <h3>Deal Rating</h3>
                        <p style={{ fontSize: "24px", margin: 0 }}>{getDealRating(result)}</p>
                        <p>{getDealMessage(result)}</p>
                    </div>

                    <button onClick={saveDeal} style={saveButtonStyle}>
                        Save Property
                    </button>
                </div>
            )}

            {savedDeals.length > 0 && (
                <div style={{ marginTop: "32px" }}>
                    <h2>Saved Properties</h2>

                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Property</th>
                                <th style={thStyle}>Price</th>
                                <th style={thStyle}>Cash Flow</th>
                                <th style={thStyle}>Cap Rate</th>
                                <th style={thStyle}>CoC Return</th>
                                <th style={thStyle}>Rating</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {savedDeals.map((deal) => (
                                <tr key={deal.id}>
                                    <td style={tdStyle}>{deal.propertyName}</td>
                                    <td style={tdStyle}>{money(deal.purchasePrice)}</td>
                                    <td style={deal.monthlyCashFlow >= 0 ? goodTdStyle : badTdStyle}>
                                        {money(deal.monthlyCashFlow)}
                                    </td>
                                    <td style={tdStyle}>{Number(deal.capRate).toFixed(2)}%</td>
                                    <td style={tdStyle}>{Number(deal.cashOnCashReturn).toFixed(2)}%</td>
                                    <td style={tdStyle}>{getDealRating(deal)}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => deleteDeal(deal.id)} style={deleteButtonStyle}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function Input({ label, value, onChange, type = "number" }) {
    return (
        <div style={inputGroupStyle}>
            <label style={labelStyle}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={inputStyle}
            />
        </div>
    );
}

function money(value) {
    return Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

function getDealRating(result) {
    if (result.monthlyCashFlow > 300 && result.cashOnCashReturn >= 8) return "⭐⭐⭐⭐⭐ Excellent";
    if (result.monthlyCashFlow > 100 && result.cashOnCashReturn >= 5) return "⭐⭐⭐⭐ Good";
    if (result.monthlyCashFlow >= 0) return "⭐⭐⭐ Average";
    if (result.monthlyCashFlow < 0 && result.capRate >= 6) return "⭐⭐ Weak Cash Flow";
    return "⭐ Avoid";
}

function getDealMessage(result) {
    if (result.monthlyCashFlow > 300 && result.cashOnCashReturn >= 8) {
        return "Strong deal. Positive cash flow and strong return.";
    }

    if (result.monthlyCashFlow > 100 && result.cashOnCashReturn >= 5) {
        return "Good deal. Worth deeper review.";
    }

    if (result.monthlyCashFlow >= 0) {
        return "Acceptable deal, but not very strong.";
    }

    if (result.monthlyCashFlow < 0 && result.capRate >= 6) {
        return "The property has decent income, but financing makes cash flow negative.";
    }

    return "Weak deal. Cash flow and return are not attractive.";
}

const formStyle = {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
};

const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
};

const labelStyle = {
    fontWeight: "bold",
    marginBottom: "6px",
};

const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "240px",
};

const buttonStyle = {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    height: "46px",
    marginTop: "24px",
};

const saveButtonStyle = {
    ...buttonStyle,
    background: "#047857",
};

const deleteButtonStyle = {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
};

const resultCardStyle = {
    marginTop: "24px",
    padding: "24px",
    borderRadius: "12px",
    background: "#f3f4f6",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    maxWidth: "650px",
};

const ratingBoxStyle = {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "10px",
    background: "white",
};

const goodStyle = {
    color: "#047857",
    fontWeight: "bold",
};

const badStyle = {
    color: "#dc2626",
    fontWeight: "bold",
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

export default RentalROI;