import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function Assets() {
    const userId = 1;

    const [assets, setAssets] = useState([]);
    const [name, setName] = useState("");
    const [value, setValue] = useState("");

    const loadAssets = async () => {
        const response = await apiClient.get(`/assets/${userId}`);
        setAssets(response.data);
    };

    useEffect(() => {
        loadAssets();
    }, []);

    const addAsset = async (e) => {
        e.preventDefault();

        if (!name || !value) {
            alert("Please enter asset name and value.");
            return;
        }

        await apiClient.post("/assets", {
            userId,
            name,
            value: Number(value),
        });

        setName("");
        setValue("");
        loadAssets();
    };

    const deleteAsset = async (id) => {
        await apiClient.delete(`/assets/${id}`);
        loadAssets();
    };

    return (
        <div>
            <h1>Assets</h1>

            <form onSubmit={addAsset} style={formStyle}>
                <input
                    type="text"
                    placeholder="Asset name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="number"
                    placeholder="Asset value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>
                    Add Asset
                </button>
            </form>

            <h2>Current Assets</h2>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Value</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {assets.map((asset) => (
                        <tr key={asset.id}>
                            <td style={tdStyle}>{asset.name}</td>
                            <td style={tdStyle}>${Number(asset.value).toLocaleString()}</td>
                            <td style={tdStyle}>
                                <button
                                    onClick={() => deleteAsset(asset.id)}
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

export default Assets;