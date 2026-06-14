import { useState } from "react";
import { getAIResponse } from "../../services/aiAssistantService";

function WealthPilotAssistant({ dashboardData }) {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);

    const handleAsk = () => {
        if (!question.trim()) return;

        const answer = getAIResponse(question, dashboardData);

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: question,
            },
            {
                sender: "ai",
                text: answer,
            },
        ]);

        setQuestion("");
    };

    const askQuestion = (text) => {
        const answer = getAIResponse(text, dashboardData);

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text,
            },
            {
                sender: "ai",
                text: answer,
            },
        ]);
    };

    return (
        <div style={cardStyle}>
            <h2>🤖 WealthPilot AI Assistant</h2>

            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me about your finances..."
                style={inputStyle}
            />

            <div style={suggestionsStyle}>
                <button onClick={() => askQuestion("When is my FI date?")}>
                    When is my FI date?
                </button>

                <button onClick={() => askQuestion("What is my portfolio score?")}>
                    What is my portfolio score?
                </button>

                <button onClick={() => askQuestion("What is my biggest risk?")}>
                    What is my biggest risk?
                </button>

                <button onClick={() => askQuestion("Who is my best performer?")}>
                    Who is my best performer?
                </button>
            </div>

            <button onClick={handleAsk} style={buttonStyle}>
                Ask AI
            </button>

            <div style={chatContainerStyle}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={
                            msg.sender === "user"
                                ? userMessageStyle
                                : aiMessageStyle
                        }
                    >
                        <strong>
                            {msg.sender === "user" ? "You" : "AI"}
                        </strong>

                        <div>{msg.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const chatContainerStyle = {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
};

const userMessageStyle = {
    alignSelf: "flex-end",
    background: "#dbeafe",
    padding: "12px 16px",
    borderRadius: "16px",
    maxWidth: "60%",
};

const aiMessageStyle = {
    alignSelf: "flex-start",
    background: "#ecfdf5",
    padding: "12px 16px",
    borderRadius: "16px",
    maxWidth: "60%",
};

const cardStyle = {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    marginTop: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    marginBottom: "16px",
};

const suggestionsStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "16px",
};

const buttonStyle = {
    background: "#047857",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
};

const responseStyle = {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "16px",
    background: "#ecfdf5",
    color: "#047857",
    fontWeight: "600",
};

export default WealthPilotAssistant;