import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async (e) => {
        e.preventDefault();

        try {
            await apiClient.post("/auth/register", {
                email,
                password,
            });

            alert("Register successful. Please login.");
            navigate("/login");
        } catch (error) {
            alert(error.response?.data || "Register failed.");
        }
    };

    return (
        <div style={containerStyle}>
            <h1>Register</h1>

            <form onSubmit={register} style={formStyle}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>
                    Create Account
                </button>
            </form>
        </div>
    );
}

const containerStyle = {
    maxWidth: "420px",
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
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
    background: "#111827",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
};

export default Register;