import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav style={{ padding: "16px", background: "#111827" }}>
            <Link to="/" style={linkStyle}>Dashboard</Link>
            <Link to="/assets" style={linkStyle}>Assets</Link>
            <Link to="/debts" style={linkStyle}>Debts</Link>
            <Link to="/stocks" style={linkStyle}>Stocks</Link>
            <Link to="/fi-calculator" style={linkStyle}>FI Calculator</Link>
            <Link to="/rental-roi" style={linkStyle}>Rental ROI</Link>
        </nav>
    );
}

const linkStyle = {
    color: "white",
    marginRight: "20px",
    textDecoration: "none",
    fontWeight: "bold"
};

export default Navbar;