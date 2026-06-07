import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Debts from "./pages/Debts";
import Stocks from "./pages/Stocks";
import FICalculator from "./pages/FICalculator";
import RentalROI from "./pages/RentalROI";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <main style={{ padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/debts" element={<Debts />} />
                    <Route path="/stocks" element={<Stocks />} />
                    <Route path="/fi-calculator" element={<FICalculator />} />
                    <Route path="/rental-roi" element={<RentalROI />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;