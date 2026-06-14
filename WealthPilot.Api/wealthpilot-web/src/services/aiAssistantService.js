export function getAIResponse(question, data) {
    const q = question.toLowerCase();

    if (q.includes("fi date")) {
        return `Your estimated Financial Independence date is ${data.fiDate}.`;
    }

    if (q.includes("years until fi") || q.includes("how long until fi")) {
        return `You are approximately ${data.yearsToFI} years away from Financial Independence.`;
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

    return "I don't understand that yet. Try asking about FI date, portfolio score, best performer, worst performer, or biggest risk.";
}