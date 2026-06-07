import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("test@test.com");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();

        try {
            const response = await apiClient.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.user.id);
            localStorage.setItem("email", response.data.user.email);

            alert("Login successful.");
            navigate("/");
        } catch (error) {
            alert(error.response?.data || "Login failed.");
        }
    };

    return (
        <div style={containerStyle}>
            <h1>Login</h1>

            <form onSubmit={login} style={formStyle}>
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
                    Login
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

export default Login;