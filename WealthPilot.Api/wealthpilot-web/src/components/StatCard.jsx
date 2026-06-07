function StatCard({ title, value }) {
    return (
        <div style={{
            padding: "20px",
            borderRadius: "12px",
            background: "#f3f4f6",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
            <h3>{title}</h3>
            <h2>${Number(value).toLocaleString()}</h2>
        </div>
    );
}

export default StatCard;