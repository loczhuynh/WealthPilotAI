import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { getUserId } from "../utils/auth";

function Debts() {
    const userId = getUserId();

    const [debts, setDebts] = useState([]);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");

    const loadDebts = async () => {
        const response = await apiClient.get(`/debts/${userId}`);
        setDebts(response.data);
    };

    useEffect(() => {
        loadDebts();
    }, []);

    const addDebt = async (e) => {
        e.preventDefault();

        if (!name || !amount) {
            alert("Please enter debt name and amount.");
            return;
        }

        await apiClient.post("/debts", {
            userId,
            name,
            amount: Number(amount),
        });

        setName("");
        setAmount("");
        loadDebts();
    };

    const deleteDebt = async (id) => {
        await apiClient.delete(`/debts/${id}`);
        loadDebts();
    };

    return (
        <div>
            <h1>Debts</h1>

            <form onSubmit={addDebt} style={formStyle}>
                <input
                    type="text"
                    placeholder="Debt name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="number"
                    placeholder="Debt amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>
                    Add Debt
                </button>
            </form>

            <h2>Current Debts</h2>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Amount</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {debts.map((debt) => (
                        <tr key={debt.id}>
                            <td style={tdStyle}>{debt.name}</td>
                            <td style={tdStyle}>${Number(debt.amount).toLocaleString()}</td>
                            <td style={tdStyle}>
                                <button
                                    onClick={() => deleteDebt(debt.id)}
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

export default Debts;