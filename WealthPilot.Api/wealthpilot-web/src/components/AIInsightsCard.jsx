function AIInsightsCard({
    netWorth,
    stockValue,
    fiProgress,
    nextMilestoneAmount,
    monthlyInvestment,
    yearsToFI
}) {
    const strengths = [];
    const risks = [];
    const opportunities = [];

    if (netWorth > 0) {
        strengths.push("You have a positive net worth and are building wealth.");
    }

    if (fiProgress >= 1) {
        strengths.push(
            `You already passed the 1% FI milestone. Current progress: ${fiProgress.toFixed(2)}%.`
        );
    }

    if (fiProgress < 5) {
        opportunities.push(
            "You are in the early stage of your FI journey. Every dollar invested now has decades to compound."
        );
    }

    opportunities.push(
        `You need ${money(nextMilestoneAmount)} to reach your next FI milestone.`
    );

    const monthsToMilestone =
        monthlyInvestment > 0
            ? nextMilestoneAmount / monthlyInvestment
            : 0;

    opportunities.push(
        `At your current pace, you could reach the next milestone in approximately ${Math.ceil(monthsToMilestone)} months.`
    );

    if (stockValue > netWorth * 0.7) {
        risks.push(
            "A large portion of your net worth is invested in stocks. Consider maintaining adequate cash reserves."
        );
    }

    const actionItem = buildActionItem(monthlyInvestment, yearsToFI);

    const increasedInvestment = Number(monthlyInvestment) + 500;

    const improvedYearsToFI = Math.max(Number(yearsToFI) - 2.5, 0);

    const currentFiDate = getEstimatedFiDate(yearsToFI);
    const improvedFiDate = getEstimatedFiDate(improvedYearsToFI);
    const yearsSaved = Number(yearsToFI - improvedYearsToFI).toFixed(1);

    const score = calculateScore(
        strengths.length,
        risks.length,
        opportunities.length
    );

    const grade = getGrade(score);

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <div>
                    <h2>🚀 WealthPilot AI Insights</h2>
                    <p style={subtitleStyle}>
                        Rule-based financial intelligence from your current dashboard.
                    </p>
                </div>

                <div style={scoreBadgeStyle}>
                    <div style={scoreNumberStyle}>{score}/100</div>
                    <div>Wealth Score</div>
                    <div style={gradeStyle}>Grade {grade}</div>
                </div>
            </div>

            <div style={actionCardStyle}>
                <h3>🎯 Recommended Action</h3>
                <p style={actionMainStyle}>{actionItem.title}</p>
                <p>{actionItem.description}</p>

                <div style={impactBoxStyle}>
                    <h4>📊 Impact Estimate</h4>

                    <p>
                        Current FI Date: <strong>{currentFiDate}</strong>
                    </p>

                    <p>
                        If monthly investment increases to{" "}
                        <strong>{money(increasedInvestment)}</strong>:{" "}
                        <strong>{improvedFiDate}</strong>
                    </p>

                    <p style={impactHighlightStyle}>
                        Time Saved: {yearsSaved} years
                    </p>
                </div>
            </div>

            <div style={sectionGridStyle}>
                <InsightSection
                    title="✅ Strengths"
                    items={strengths}
                    emptyText="No strengths detected yet."
                />

                <InsightSection
                    title="⚠️ Risks"
                    items={risks}
                    emptyText="No major risks detected."
                />

                <InsightSection
                    title="🚀 Opportunities"
                    items={opportunities}
                    emptyText="No opportunities detected yet."
                />
            </div>
        </div>
    );
}

function InsightSection({ title, items, emptyText }) {
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

function buildActionItem(monthlyInvestment, yearsToFI) {
    const increasedInvestment = Number(monthlyInvestment) + 500;

    if (yearsToFI > 20) {
        return {
            title: `Increase monthly investment from ${money(monthlyInvestment)} to ${money(increasedInvestment)}.`,
            description:
                "This could meaningfully shorten your FI timeline and help you reach milestones faster."
        };
    }

    return {
        title: "Stay consistent with your current plan.",
        description:
            "Your FI timeline is reasonable. Keep investing consistently and review your progress monthly."
    };
}

function calculateScore(strengthCount, riskCount, opportunityCount) {
    let score = 70;

    score += strengthCount * 8;
    score -= riskCount * 10;
    score += Math.min(opportunityCount * 2, 10);

    return Math.max(0, Math.min(score, 100));
}

function getGrade(score) {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 80) return "A-";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    return "D";
}

function money(value) {
    return Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

function getEstimatedFiDate(yearsRemaining) {
    const date = new Date();
    date.setMonth(date.getMonth() + Math.round(Number(yearsRemaining) * 12));

    return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

const cardStyle = {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    marginTop: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
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

const scoreBadgeStyle = {
    background: "#047857",
    color: "white",
    padding: "16px 24px",
    borderRadius: "999px",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: "1.4",
};

const scoreNumberStyle = {
    fontSize: "22px",
};

const gradeStyle = {
    marginTop: "4px",
    fontSize: "14px",
    opacity: 0.9,
};

const actionCardStyle = {
    background: "linear-gradient(135deg, #ecfdf5, #eef2ff)",
    border: "1px solid #d1fae5",
    padding: "22px",
    borderRadius: "18px",
    marginBottom: "24px",
};

const actionMainStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#047857",
};

const sectionGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
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

const impactBoxStyle = {
    marginTop: "18px",
    padding: "16px",
    borderRadius: "14px",
    background: "white",
    border: "1px solid #d1fae5",
};

const impactHighlightStyle = {
    color: "#047857",
    fontWeight: "bold",
};

export default AIInsightsCard;