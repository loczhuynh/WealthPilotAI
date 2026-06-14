function FIStrategyComparison({
    currentNetWorth,
    monthlyInvestment,
    expectedAnnualReturn,
    targetAmount,
}) {
    const baseInvestment = Number(monthlyInvestment);

    const strategies = [
        {
            name: "Conservative",
            icon: "🛡️",
            monthlyInvestment: baseInvestment,
        },
        {
            name: "Balanced",
            icon: "⚖️",
            monthlyInvestment: baseInvestment + 500,
        },
        {
            name: "Aggressive",
            icon: "🚀",
            monthlyInvestment: baseInvestment + 1000,
        },
        {
            name: "Maximum",
            icon: "🔥",
            monthlyInvestment: baseInvestment + 2000,
        },
    ].map((strategy) => {
        const yearsToFI = calculateYearsToFI(
            currentNetWorth,
            strategy.monthlyInvestment,
            expectedAnnualReturn,
            targetAmount
        );

        return {
            ...strategy,
            yearsToFI,
            fiDate: getEstimatedFiDate(yearsToFI),
        };
    });

    const conservative = strategies[0];

    const recommended = strategies.reduce((best, current) => {
        const bestYearsSaved = conservative.yearsToFI - best.yearsToFI;
        const currentYearsSaved = conservative.yearsToFI - current.yearsToFI;

        const bestScore = bestYearsSaved / Math.max(best.monthlyInvestment - baseInvestment, 1);
        const currentScore = currentYearsSaved / Math.max(current.monthlyInvestment - baseInvestment, 1);

        return currentScore > bestScore ? current : best;
    }, strategies[1]);

    const yearsSaved = Math.max(
        conservative.yearsToFI - recommended.yearsToFI,
        0
    );

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <div>
                    <h2>🏁 FI Strategy Comparison</h2>
                    <p style={subtitleStyle}>
                        Compare different investment strategies and see how they affect your FI timeline.
                    </p>
                </div>

                <div style={badgeStyle}>
                    🏆 Best Strategy
                    <br />
                    {recommended.name}
                </div>
            </div>

            <div style={strategyGridStyle}>
                {strategies.map((strategy) => {
                    const isRecommended = strategy.name === recommended.name;
                    const strategyYearsSaved = Math.max(
                        conservative.yearsToFI - strategy.yearsToFI,
                        0
                    );

                    return (
                        <div
                            key={strategy.name}
                            style={{
                                ...strategyCardStyle,
                                border: isRecommended
                                    ? "2px solid #047857"
                                    : "1px solid #e5e7eb",
                                boxShadow: isRecommended
                                    ? "0 10px 25px rgba(4,120,87,0.18)"
                                    : "none",
                            }}
                        >
                            <h3>
                                {strategy.icon} {strategy.name}
                            </h3>

                            <p style={labelStyle}>Monthly Investment</p>
                            <h2>{money(strategy.monthlyInvestment)}</h2>

                            <p style={labelStyle}>FI Date</p>
                            <h3>{strategy.fiDate}</h3>

                            <p style={labelStyle}>Years to FI</p>
                            <h3>{strategy.yearsToFI.toFixed(1)} years</h3>

                            <p style={savingStyle}>
                                {strategyYearsSaved > 0
                                    ? `⏱ Save ${strategyYearsSaved.toFixed(1)} years`
                                    : "Baseline strategy"}
                            </p>
                            <p style={labelStyle}>Additional Investment</p>
                            <h4>
                                +{money(strategy.monthlyInvestment - baseInvestment)} / month
                            </h4>

                            {isRecommended && (
                                <div style={recommendedBadgeStyle}>
                                    Recommended
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={recommendationStyle}>
                <h3>🏆 Best Risk/Reward Strategy: {recommended.name}</h3>

                <p>
                    Reach FI <strong>{yearsSaved.toFixed(1)} years earlier</strong>
                    {" "}for only{" "}
                    <strong>{money(recommended.monthlyInvestment - baseInvestment)}</strong>
                    {" "}/ month more.
                </p>

                <p>
                    Your projected FI date could move to{" "}
                    <strong>{recommended.fiDate}</strong>.
                </p>

                <p style={highlightStyle}>
                    This strategy gives you strong time savings without requiring the highest monthly investment.
                </p>
            </div>
        </div>
    );
}

function calculateYearsToFI(currentNetWorth, monthlyInvestment, annualReturn, targetAmount) {
    const monthlyReturn = Number(annualReturn) / 100 / 12;
    let balance = Number(currentNetWorth);
    let months = 0;

    while (balance < Number(targetAmount) && months < 1200) {
        balance = balance * (1 + monthlyReturn) + Number(monthlyInvestment);
        months++;
    }

    return Number((months / 12).toFixed(1));
}

function getEstimatedFiDate(yearsRemaining) {
    const date = new Date();
    date.setMonth(date.getMonth() + Math.round(Number(yearsRemaining) * 12));

    return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
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

const badgeStyle = {
    background: "#047857",
    color: "white",
    padding: "16px 24px",
    borderRadius: "999px",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: "1.4",
};

const strategyGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
};

const strategyCardStyle = {
    background: "#f9fafb",
    padding: "20px",
    borderRadius: "18px",
    position: "relative",
};

const labelStyle = {
    color: "#6b7280",
    marginBottom: "4px",
};

const savingStyle = {
    color: "#047857",
    fontWeight: "bold",
};

const recommendedBadgeStyle = {
    position: "absolute",
    top: "14px",
    right: "14px",
    background: "#047857",
    color: "white",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "bold",
};

const recommendationStyle = {
    marginTop: "24px",
    padding: "22px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #ecfdf5, #eef2ff)",
    border: "1px solid #d1fae5",
};

const highlightStyle = {
    color: "#047857",
    fontWeight: "bold",
};

export default FIStrategyComparison;