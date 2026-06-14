import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { getUserId } from "../utils/auth";

function PortfolioCoachCard() {
    const userId = getUserId();

    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        loadStocks();
    }, []);

    const loadStocks = async () => {
        if (!userId) return;

        const response = await apiClient.get(`/stockholdings/${userId}`);
        setStocks(response.data);
    };

    const analysis = analyzePortfolio(stocks);

   

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <div>
                    <h2>🧠 AI Portfolio Coach</h2>
                    <p style={subtitleStyle}>
                        Advisor-style feedback based on your current stock holdings.
                    </p>
                </div>

                <div>
                    <div style={scoreBadgeStyle(analysis.score)}>
                        {analysis.score}/100
                        <br />
                        Portfolio Score
                        <br />
                        <span style={gradeTextStyle}>{analysis.grade}</span>
                    </div>

                    <div style={healthBadgeStyle(analysis.score)}>
                        {analysis.health}
                    </div>
                </div>
            </div>

            {stocks.length === 0 ? (
                <p>No stock holdings yet. Add stocks to receive portfolio coaching.</p>
            ) : (
                <>
                    <div style={summaryGridStyle}>
                        <Metric title="Total Value" value={money(analysis.totalValue)} />
                        <Metric
                            title="Total Gain/Loss"
                            value={money(analysis.totalGainLoss)}
                            color={analysis.totalGainLoss >= 0 ? "#047857" : "#dc2626"}
                        />
                        <Metric title="Largest Holding" value={analysis.largestHoldingName} />
                         <Metric title="Best Performer" value={analysis.bestPerformerName} color="#047857" />
                        <Metric
                            title="Worst Performer"
                            value={`${analysis.worstPerformerName}`}
                            color="#dc2626"
                        />
                        <Metric title="Diversification" value={analysis.diversificationLabel} />
                        
                    </div>

                    <div style={sectionGridStyle}>
                        <CoachSection
                            title="✅ Strengths"
                            items={analysis.strengths}
                            emptyText="No strengths detected yet."
                        />

                        <CoachSection
                            title="⚠️ Risks"
                            items={analysis.risks}
                            emptyText="No major risks detected."
                        />

                        <CoachSection
                            title="🎯 Recommended Actions"
                            items={analysis.actions}
                            emptyText="Continue dollar-cost averaging and review your portfolio quarterly."
                        />
                    </div>

                    <div style={coachInsightStyle}>
                        <h3>💡 Coach Summary</h3>
                        <p>{analysis.summary}</p>
                    </div>
                </>
            )}
        </div>
    );
}

function analyzePortfolio(stocks) {
    if (!stocks || stocks.length === 0) {
        return {
            score: 0,
            grade: "Grade N/A",
            totalValue: 0,
            totalGainLoss: 0,
            largestHoldingName: "N/A",
            bestPerformerName: "N/A",
            diversificationLabel: "N/A",
            strengths: [],
            risks: [],
            actions: [],
            summary: "Add stock holdings to unlock AI portfolio coaching.",
        };
    }

    const normalized = stocks.map((stock) => {
        const shares = Number(stock.shares);
        const avgCost = Number(stock.avgCost);
        const currentPrice = Number(stock.currentPrice);

        const costBasis = shares * avgCost;
        const currentValue = shares * currentPrice;
        const gainLoss = currentValue - costBasis;
        const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

        return {
            ...stock,
            shares,
            avgCost,
            currentPrice,
            costBasis,
            currentValue,
            gainLoss,
            gainLossPercent,
        };
    });

    const totalValue = normalized.reduce((sum, x) => sum + x.currentValue, 0);
    const totalCost = normalized.reduce((sum, x) => sum + x.costBasis, 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    const largestHolding = normalized.reduce((max, stock) =>
        stock.currentValue > max.currentValue ? stock : max
    );

    const largestHoldingPercent =
        totalValue > 0 ? (largestHolding.currentValue / totalValue) * 100 : 0;

    const bestPerformer = normalized.reduce((best, stock) =>
        stock.gainLossPercent > best.gainLossPercent ? stock : best
    );

    const worstPerformer = normalized.reduce((worst, stock) =>
        stock.gainLossPercent < worst.gainLossPercent ? stock : worst
    );



    const strengths = [];
    const risks = [];
    const actions = [];

    if (totalGainLoss > 0) {
        strengths.push(
            `Your portfolio is currently up ${money(totalGainLoss)} (${totalGainLossPercent.toFixed(2)}%).`
        );
    } else {
        risks.push(
            `Your portfolio is currently down ${money(Math.abs(totalGainLoss))} (${Math.abs(totalGainLossPercent).toFixed(2)}%).`
        );
    }

    strengths.push(
        `${bestPerformer.ticker} is your strongest performer at ${bestPerformer.gainLossPercent.toFixed(2)}%.`
    );

    if (worstPerformer.gainLossPercent < 0) {
        risks.push(
            `${worstPerformer.ticker} is currently down ${Math.abs(worstPerformer.gainLossPercent).toFixed(2)}%. Review whether the thesis still holds.`
        );
    }

    if (worstPerformer.gainLossPercent < -10) {
        actions.push(
            `Review ${worstPerformer.ticker}. It is down ${Math.abs(
                worstPerformer.gainLossPercent
            ).toFixed(2)}%, so confirm whether the long-term thesis still makes sense.`
        );
    }

    if (totalGainLoss > 0 && largestHoldingPercent <= 40 && normalized.length >= 3) {
        actions.push(
            "Continue dollar-cost averaging and review your portfolio quarterly."
        );
    }

    if (largestHoldingPercent > 60) {
        risks.push(
            `${largestHolding.ticker} is ${largestHoldingPercent.toFixed(1)}% of your portfolio. This is high concentration risk.`
        );

        actions.push(
            `Consider reducing concentration risk by adding diversified ETFs or balancing new contributions away from ${largestHolding.ticker}.`
        );
    } else if (largestHoldingPercent > 40) {
        risks.push(
            `${largestHolding.ticker} is ${largestHoldingPercent.toFixed(1)}% of your portfolio. Monitor concentration risk.`
        );

        actions.push(
            `Consider directing future contributions to other holdings to improve diversification.`
        );
    }

    else {
        strengths.push(
            `Your largest holding is ${largestHolding.ticker} at ${largestHoldingPercent.toFixed(1)}%, which is more balanced.`
        );
    }

    if (normalized.length < 3) {
        risks.push("Your portfolio has fewer than 3 holdings. Diversification is limited.");
        actions.push("Consider adding a broad-market ETF to improve diversification.");
    }

    if (normalized.length >= 3 && largestHoldingPercent <= 50) {
        strengths.push("Your portfolio has a reasonable level of diversification.");
    }

    const diversificationLabel = getDiversificationLabel(normalized.length, largestHoldingPercent);
    const score = calculatePortfolioScore(totalGainLossPercent, normalized.length, largestHoldingPercent);
    const grade = getPortfolioGrade(score);
    const health = getPortfolioHealth(score);

    const summary = buildSummary(
        score,
        totalGainLossPercent,
        largestHolding,
        largestHoldingPercent,
        bestPerformer,
        worstPerformer
    );

    return {
        score,
        grade,
        totalValue,
        totalGainLoss,
        largestHoldingName: `${largestHolding.ticker} (${largestHoldingPercent.toFixed(1)}%)`,
        bestPerformerName: `${bestPerformer.ticker} +${bestPerformer.gainLossPercent.toFixed(2)}%`,
        diversificationLabel,
        strengths,
        risks,
        actions,
        summary,
        worstPerformerName:
            `${worstPerformer.ticker} ${worstPerformer.gainLossPercent.toFixed(2)}%`,
        health,
    };
}

function getPortfolioHealth(score) {
    if (score >= 90) return "🟢 Excellent Portfolio Health";
    if (score >= 80) return "🟡 Good Portfolio Health";
    if (score >= 70) return "🟠 Fair Portfolio Health";
    return "🔴 Needs Attention";
}

function getDiversificationLabel(count, largestHoldingPercent) {
    if (count < 3) return "Low";
    if (largestHoldingPercent > 60) return "Concentrated";
    if (largestHoldingPercent > 40) return "Moderate";
    return "Healthy";
}

function getPortfolioGrade(score) {
    if (score >= 95) return "Grade A+";
    if (score >= 90) return "Grade A";
    if (score >= 80) return "Grade B";
    if (score >= 70) return "Grade C";
    if (score >= 60) return "Grade D";
    return "Grade F";
}

function calculatePortfolioScore(totalGainLossPercent, holdingCount, largestHoldingPercent) {
    let score = 70;

    if (totalGainLossPercent > 0) score += 10;
    if (totalGainLossPercent > 10) score += 5;
    if (holdingCount >= 3) score += 10;
    if (holdingCount < 3) score -= 15;
    if (largestHoldingPercent > 60) score -= 20;
    else if (largestHoldingPercent > 40) score -= 10;

    return Math.max(0, Math.min(score, 100));
}

function buildSummary(score, totalGainLossPercent, largestHolding, largestHoldingPercent, bestPerformer, worstPerformer) {
    if (score >= 85) {
        return `Your portfolio demonstrates healthy diversification and positive performance. ${bestPerformer.ticker} remains your strongest contributor while concentration risk is well controlled. The primary area to monitor is ${worstPerformer.ticker}, which is currently your weakest holding. Overall portfolio health is excellent and consistent contributions should continue improving long-term FI outcomes.`;
    }

    if (score >= 70) {
        return `Your portfolio is performing reasonably well, but concentration and diversification should be monitored. ${bestPerformer.ticker} is your strongest contributor, while ${largestHolding.ticker} is your largest position at ${largestHoldingPercent.toFixed(1)}%.`;
    }

    return `Your portfolio may need attention. Focus on improving diversification, reducing concentration risk, and reviewing underperforming holdings such as ${worstPerformer.ticker}.`;
}

function Metric({ title, value, color }) {
    return (
        <div style={metricCardStyle}>
            <p style={metricTitleStyle}>{title}</p>
            <h3 style={{ ...metricValueStyle, color: color || "#111827" }}>
                {value}
            </h3>
        </div>
    );
}

function CoachSection({ title, items, emptyText }) {
    return (
        <div style={sectionCardStyle}>
            <h3>{title}</h3>

            {items.length === 0 ? (
                <p style={emptyStyle}>{emptyText}</p>
            ) : (
                items.map((item, index) => (
                    <div key={index} style={insightStyle}>
                        {item}
                    </div>
                ))
            )}
        </div>
    );
}

function money(value) {
    return Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

const cardStyle = {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    marginTop: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
};

const subtitleStyle = {
    color: "#6b7280",
    marginTop: "-8px",
};

const scoreBadgeStyle = (score) => ({
    background: score >= 80 ? "#047857" : score >= 60 ? "#f59e0b" : "#dc2626",
    color: "white",
    padding: "16px 24px",
    borderRadius: "999px",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: "1.4",
});

const gradeTextStyle = {
    fontSize: "14px",
    opacity: 0.9,
};


//const summaryGridStyle = {
//    display: "grid",
//    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//    gap: "18px",
//    marginBottom: "24px",
//};

const summaryGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "14px",
    marginBottom: "24px",
};

const metricCardStyle = {
    padding: "18px",
    borderRadius: "16px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    minHeight: "100px",
};

const metricTitleStyle = {
    color: "#6b7280",
    margin: 0,
};

const metricValueStyle = {
    marginTop: "8px",
    marginBottom: 0,
    fontSize: "20px",
};

const sectionGridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
};

const sectionCardStyle = {
    background: "#f9fafb",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
};

const insightStyle = {
    padding: "10px 0",
    fontSize: "16px",
    borderBottom: "1px solid #e5e7eb",
};

const emptyStyle = {
    color: "#6b7280",
};

const coachInsightStyle = {
    marginTop: "24px",
    padding: "22px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #ecfdf5, #eef2ff)",
    border: "1px solid #d1fae5",
};


const healthBadgeStyle = (score) => ({
    marginTop: "10px",
    background:
        score >= 90
            ? "#dcfce7"
            : score >= 80
                ? "#fef9c3"
                : score >= 70
                    ? "#fed7aa"
                    : "#fee2e2",
    color: "#047857",
    padding: "10px 14px",
    borderRadius: "999px",
    fontWeight: "bold",
    textAlign: "center",
});


export default PortfolioCoachCard;