function FIProgressCard({
    currentNetWorth,
    targetAmount = 1800000,
    monthlyInvestment = 2000,
    expectedAnnualReturn = 8,
}) {
    const progress = Math.min((currentNetWorth / targetAmount) * 100, 100);
    const remaining = Math.max(targetAmount - currentNetWorth, 0);

    const yearsRemaining = calculateYearsToFI(
        currentNetWorth,
        monthlyInvestment,
        expectedAnnualReturn,
        targetAmount
    );

    const estimatedFiDate = getEstimatedFiDate(yearsRemaining);
    const daysRemaining = Math.round(Number(yearsRemaining) * 365);

    const nextMilestone = getNextMilestone(progress);
    const nextMilestoneAmount = targetAmount * (nextMilestone / 100);
    const amountToNextMilestone = Math.max(nextMilestoneAmount - currentNetWorth, 0);
    const monthsToNextMilestone =
        monthlyInvestment > 0 ? Math.ceil(amountToNextMilestone / monthlyInvestment) : 0;

    const fiStage = getFIStage(progress);
    const progressColor = getProgressColor(progress);

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <div>
                    <h2>FI Progress Tracker</h2>
                    <p style={subtitleStyle}>Your path to financial independence</p>
                </div>

                <div style={{ ...badgeStyle, background: progressColor }}>
                    {fiStage.icon} {fiStage.label}
                    <br />
                    {progress.toFixed(2)}% Complete
                </div>

            </div>

            <div style={statsGridStyle}>
                <Metric title="FI Target" value={money(targetAmount)} />
                <Metric title="Current Net Worth" value={money(currentNetWorth)} />
                <Metric title="Remaining" value={money(remaining)} />
                <Metric title="Estimated Time" value={`${yearsRemaining} years`} />
                <Metric title="Estimated FI Date" value={estimatedFiDate} subtitle={`${daysRemaining.toLocaleString()} days left`} />
            </div>

            <div style={progressWrapperStyle}>
                <div style={progressContainerStyle}>
                    <div
                        style={{
                            ...progressBarStyle,
                            width: `${Math.max(progress, 2)}%`,
                            background: `linear-gradient(90deg, ${progressColor}, #047857)`,
                            boxShadow: `0 0 15px ${progressColor}`,
                        }}
                    />
                </div>
            </div>

            <MilestoneRoadmap
                progress={progress}
                nextMilestone={nextMilestone}
                targetAmount={targetAmount}
                currentNetWorth={currentNetWorth}
            />

            <div style={milestoneBadgeStyle}>
                <span>🎯 Next Milestone ({nextMilestone}%): Need</span>
                <strong>{money(amountToNextMilestone)}</strong>
                <span>more</span>
            </div>

            <div style={journeyGridStyle}>
                <JourneyItem title="Current" value={money(currentNetWorth)} />
                <JourneyItem title="Next Milestone" value={money(nextMilestoneAmount)} />
                <JourneyItem title="FI Target" value={money(targetAmount)} />
            </div>

            <div style={insightCardStyle}>
                <h3>🚀 WealthPilot Insight</h3>

                <p>
                    You are <strong>{money(amountToNextMilestone)}</strong> away from your next FI milestone.
                </p>

                <p>
                    At <strong>{money(monthlyInvestment)}</strong> per month, you could reach it in about{" "}
                    <strong>{monthsToNextMilestone} months</strong>.
                </p>

                <p style={motivationStyle}>💡 {getMotivation(progress)}</p>
            </div>

            <p style={noteStyle}>
                Assumption: {money(monthlyInvestment)}/month invested at{" "}
                {expectedAnnualReturn}% annual return.
            </p>
        </div>
    );
}

function Metric({ title, value, subtitle }) {
    return (
        <div style={metricCardStyle}>
            <p style={metricTitleStyle}>{title}</p>
            <h3 style={metricValueStyle}>{value}</h3>
            {subtitle && <p style={metricSubtitleStyle}>{subtitle}</p>}
        </div>
    );
}

function JourneyItem({ title, value }) {
    return (
        <div style={journeyItemStyle}>
            <p style={journeyTitleStyle}>{title}</p>
            <h3 style={journeyValueStyle}>{value}</h3>
        </div>
    );
}

function MilestoneRoadmap({ progress, nextMilestone, targetAmount, currentNetWorth }) {
    const milestones = [1, 5, 10, 25, 50, 75, 100];

    return (
        <div style={roadmapStyle}>
            {milestones.map((milestone) => {
                const reached = progress >= milestone;
                const active = progress < milestone && milestone === nextMilestone;
                const milestoneAmount = targetAmount * (milestone / 100);
                const needAmount = Math.max(milestoneAmount - currentNetWorth, 0);

                const tooltipText =
                    `${milestone}% Milestone\n` +
                    `Target: ${money(milestoneAmount)}\n` +
                    `Need: ${money(needAmount)} more`;

                return (
                    <div
                        key={milestone}
                        style={{
                            ...roadmapItemStyle,
                            position: "relative",
                        }}
                        title={tooltipText}
                    >
                        <div
                            style={{
                                ...milestoneStyle,
                                background: active
                                    ? "#ecfdf5"
                                    : reached
                                        ? getMilestoneColor(milestone)
                                        : `${getMilestoneColor(milestone)}22`,
                                color: reached
                                    ? "white"
                                    : getMilestoneColor(milestone),
                                border: active
                                    ? `4px solid ${getMilestoneColor(milestone)}`
                                    : `2px solid ${getMilestoneColor(milestone)}55`,
                                boxShadow: active
                                    ? `0 0 24px ${getMilestoneColor(milestone)}88`
                                    : "none",
                                transform: active ? "scale(1.15)" : "scale(1)",
                            }}
                        >
                            {milestone === 100 ? "🏆" : reached ? "✓" : "○"}
                        </div>

                        <div style={roadmapLabelStyle}>{milestone}%</div>
                        <div style={roadmapAmountStyle}>{money(milestoneAmount)}</div>
                    </div>
                );
            })}
        </div>
    );
}

function calculateYearsToFI(currentNetWorth, monthlyInvestment, annualReturn, targetAmount) {
    const monthlyReturn = annualReturn / 100 / 12;
    let balance = Number(currentNetWorth);
    let months = 0;

    while (balance < targetAmount && months < 1200) {
        balance = balance * (1 + monthlyReturn) + Number(monthlyInvestment);
        months++;
    }

    return (months / 12).toFixed(1);
}

function getEstimatedFiDate(yearsRemaining) {
    const date = new Date();
    date.setMonth(date.getMonth() + Math.round(Number(yearsRemaining) * 12));

    return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

function getNextMilestone(progress) {
    if (progress < 1) return 1;
    if (progress < 5) return 5;
    if (progress < 10) return 10;
    if (progress < 25) return 25;
    if (progress < 50) return 50;
    if (progress < 75) return 75;
    if (progress < 100) return 100;
    return 100;
}

function getMilestoneColor(milestone) {
    if (milestone >= 100) return "#f59e0b";
    if (milestone >= 75) return "#ea580c";
    if (milestone >= 50) return "#8b5cf6";
    if (milestone >= 25) return "#3b82f6";
    if (milestone >= 10) return "#06b6d4";
    return "#10b981";
}

function getFIStage(progress) {
    if (progress >= 100) return { icon: "🏆", label: "Financially Independent" };
    if (progress >= 75) return { icon: "🏡", label: "Near FI" };
    if (progress >= 50) return { icon: "🌲", label: "FI Climber" };
    if (progress >= 25) return { icon: "🌳", label: "Wealth Builder" };
    if (progress >= 5) return { icon: "🌿", label: "Growing Investor" };
    return { icon: "🌱", label: "FI Seedling" };
}

function getProgressColor(progress) {
    if (progress < 10) return "#f59e0b";
    if (progress < 50) return "#3b82f6";
    return "#10b981";
}

function getMotivation(progress) {
    if (progress < 1) return "Every millionaire started with the first dollar. Keep building.";
    if (progress < 5) return "The hardest part is getting started. You are already moving.";
    if (progress < 25) return "Momentum is building. Consistency will do the heavy lifting.";
    if (progress < 50) return "You are building serious wealth now. Stay patient.";
    if (progress < 75) return "Financial independence is getting closer every month.";
    return "The finish line is in sight. Protect the plan and keep going.";
}

function money(value) {
    return Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

const cardStyle = {
    marginTop: "32px",
    padding: "30px",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
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
    padding: "12px 18px",
    borderRadius: "999px",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: "1.4",
};

const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "16px",
    marginBottom: "26px",
};

const metricCardStyle = {
    background: "white",
    padding: "18px",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const metricTitleStyle = {
    color: "#6b7280",
    margin: 0,
};

const metricValueStyle = {
    marginTop: "8px",
    marginBottom: 0,
};

const metricSubtitleStyle = {
    marginTop: "6px",
    marginBottom: 0,
    color: "#6b7280",
    fontSize: "14px",
};

//const progressContainerStyle = {
//    width: "100%",
//    height: "32px",
//    background: "#e5e7eb",
//    borderRadius: "999px",
//    overflow: "hidden",
//    marginBottom: "35px"
//};

//const progressBarStyle = {
//    height: "100%",
//    borderRadius: "999px",
//};

const progressTextStyle = {
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
    paddingLeft: "12px",
    lineHeight: "30px",
    whiteSpace: "nowrap",
};

const milestones = [
    { percent: 1 },
    { percent: 5 },
    { percent: 10 },
    { percent: 25 },
    { percent: 50 },
    { percent: 75 },
    { percent: 100 },
];

const progressWrapperStyle = {
    marginTop: "24px",
    marginBottom: "28px",
};

const progressContainerStyle = {
    position: "relative",
    width: "100%",
    height: "38px",
    background: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
};

const progressBarStyle = {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.4s ease",
};

const progressTextOverlayStyle = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#111827",
    fontWeight: "700",
    fontSize: "15px",
};


const roadmapStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 120px)",
    justifyContent: "center",
    gap: "20px",
    marginTop: "25px",
    marginBottom: "25px",
};

const roadmapItemStyle = {
    textAlign: "center",
};

const milestoneStyle = {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    margin: "0 auto 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    transition: "all 0.3s ease",
};

const roadmapLabelStyle = {
    color: "#374151",
    fontWeight: "bold",
    fontSize: "14px",
};

const roadmapAmountStyle = {
    color: "#6b7280",
    fontSize: "13px",
    marginTop: "4px",
};


const milestoneBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#ecfdf5",
    color: "#047857",
    padding: "12px 18px",
    borderRadius: "999px",
    fontWeight: "600",
    marginTop: "4px",
    marginBottom: "20px",
};

const journeyGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "20px",
};

const journeyItemStyle = {
    background: "white",
    padding: "16px",
    borderRadius: "14px",
};

const journeyTitleStyle = {
    color: "#6b7280",
    margin: 0,
};

const journeyValueStyle = {
    marginTop: "8px",
    marginBottom: 0,
};

const insightCardStyle = {
    background: "white",
    padding: "35px",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const motivationStyle = {
    color: "#047857",
    fontWeight: "600",
};

const noteStyle = {
    marginTop: "18px",
    color: "#374151",
};

export default FIProgressCard;