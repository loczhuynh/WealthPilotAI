export function getAIResponse(question, data) {
    const q = question.toLowerCase().trim();

    if (q.includes("fi date") || q.includes("financial independence date")) {
        return `Your estimated Financial Independence date is ${data.fiDate}.`;
    }

    if (q.includes("years until fi") || q.includes("how long until fi")) {
        return `You are approximately ${data.yearsToFI} years away from Financial Independence.`;
    }


    if (q.includes("net")) {
        return `Your current net worth is ${money(data.netWorth)}.`;
    }

    if (q.includes("monthly investment")) {
        return `Your current monthly investment is ${money(data.monthlyInvestment)}.`;
    }

    if (q.includes("target") || q.includes("fi goal")) {
        return `Your FI target is ${money(data.targetAmount)}.`;
    }

    if (q.includes("biggest risk")) {
        return data.biggestRisk;
    }

    if (q.includes("best performer")) {
        return data.bestPerformer;
    }

    if (q.includes("worst performer")) {
        return data.worstPerformer;
    }

    if (q.includes("portfolio score")) {
        return `Your Portfolio Score is ${data.portfolioScore}/100.`;
    }

    if (q.includes("wealth score")) {
        return `Your Wealth Score is ${data.wealthScore}/100.`;
    }

    if (
        q.includes("reach fi faster") ||
        q.includes("retire earlier") ||
        q.includes("fi faster")
    ) {
        return `To reach FI faster, your biggest lever is increasing monthly investment. At ${money(data.monthlyInvestment)} per month, your FI date is ${data.fiDate}. Increasing contributions by $500/month could shorten your timeline meaningfully.`;
    }

    if (
        q.includes("should i increase") ||
        q.includes("increase my investment") ||
        q.includes("invest more")
    ) {
        return `Yes, if your cash flow allows it. Increasing your monthly investment above ${money(data.monthlyInvestment)} could reduce your FI timeline and help you reach milestones faster.`;
    }

    if (
        q.includes("biggest opportunity") ||
        q.includes("opportunity")
    ) {
        const increasedMonthly = Number(data.monthlyInvestment) + 500;

        return (
            `Your biggest opportunity is increasing your monthly investment from ` +
            `${money(data.monthlyInvestment)} to ${money(increasedMonthly)} per month. ` +
            `This could help shorten your FI timeline while you continue building wealth consistently.`
        );
    }

    if (
        q.includes("am i diversified") ||
        q.includes("diversified enough") ||
        q.includes("diversification")
    ) {
        return `Your portfolio diversification looks healthy based on your current Portfolio Coach score. Your largest holding is not overly concentrated, but you should continue monitoring position size over time.`;
    }

    if (
        q.includes("what should i focus on") ||
        q.includes("how can i improve") ||
        q.includes("personalized recommendation") ||
        q.includes("recommendations") ||
        q.includes("wealth recommendation") ||
        q.includes("what should i do next")
    ) {
        const increasedMonthly = Number(data.monthlyInvestment) + 500;

        return (
            `📈 Top Personalized Recommendations\n\n` +
            `1️⃣ Increase monthly investment\n` +
            `Move from ${money(data.monthlyInvestment)} to ${money(increasedMonthly)} if your budget allows.\n` +
            `This is your biggest FI acceleration lever.\n\n` +

            `2️⃣ Review your weakest holding\n` +
            `${data.worstPerformer}\n` +
            `Confirm whether the long-term thesis still makes sense.\n\n` +

            `3️⃣ Keep your strongest holding working\n` +
            `${data.bestPerformer}\n\n` +

            `4️⃣ Stay consistent\n` +
            `Portfolio Score: ${data.portfolioScore}/100\n` +
            `Wealth Score: ${data.wealthScore}/100`
        );
    }

    if (
        q.includes("what should i do") ||
        q.includes("recommend") ||
        q.includes("advice")
    ) {
        return `My recommendation: keep investing consistently, review your weakest holding, and consider increasing your monthly investment if your budget allows. Your current portfolio health is strong, but your FI timeline can improve with higher contributions.`;
    }

    if (
        q.includes("how am i doing") ||
        q.includes("overall status") ||
        q.includes("financial health")
    ) {
        return `You are doing well. Your Wealth Score is ${data.wealthScore}/100 and your Portfolio Score is ${data.portfolioScore}/100. You have positive net worth, healthy diversification, and are making steady progress toward Financial Independence.`;
    }

    if (
        q.includes("how am i doing") ||
        q.includes("overall status") ||
        q.includes("financial health")
    ) {
        return (
            `You are doing well. Your Wealth Score is ${data.wealthScore}/100 and your Portfolio Score is ${data.portfolioScore}/100. ` +
            `You have positive net worth, healthy diversification, and steady progress toward Financial Independence.`
        );
    }

   

    return "I can help with FI date, net worth, monthly investment, portfolio score, biggest risk, best performer, diversification, and how to reach FI faster.";
}

function money(value) {
    return Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}