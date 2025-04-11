export class CalculateUsedToken {
    getTokenCost(imageSize: string, model: string): number {
        const baseCostMap = {
            "1024x1024": 0.08, // 1:1
            "1024x1792": 0.12, // Portrait
            "1792x1024": 0.12  // Landscape
        };

        const baseCost = baseCostMap[imageSize];
        if (!baseCost) return 0;

        const profitMargin = Number(process.env.PROFIT_MARGIN) || 0.15;
        const costPerMillionTokens = Number(process.env.TOTALTOKENCOST) || 1;

        const profitAddedCost = baseCost + (baseCost * profitMargin);
        const tokenCost = (profitAddedCost / costPerMillionTokens) * 1_000_000;

        return Math.floor(tokenCost);
    }
}
