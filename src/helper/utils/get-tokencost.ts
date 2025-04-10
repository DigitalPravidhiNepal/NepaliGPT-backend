export class CalculateUsedToken {
    // getTokenCost(imageSize: string, model: string) {
    //     const costMap = {
    //         "256x256": 50,
    //         "512x512": 100,
    //         "1024x1024": model === "dall-e-3" ? 1000 : 500,
    //         "1792x1024": 1500,
    //         "1024x1792": 1500
    //     };
    //     return costMap[imageSize] || 0; // Returns token cost for the given size and model
    // }

    getTokenCost(imageSize: string, model: string): number {
        // const baseCostMap = {
        //     "256x256": 5000,   // Base cost
        //     "512x512": 75000,   // Base cost
        //     "1024x1024": model === "dall-e-3" ? 160000 : 85000, // Base cost
        //     "1792x1024": 320000, // Base cost
        //     "1024x1792": 320000  // Base cost
        // };
        const baseCostMap = {
            "1024x1024": 0.08, // Base cost
            "1024x1792": 0.12  // Base cost
        };

        // Apply a 20% profit margin
        const profitMargin = 0.15;
        const totalCostPerMillionTokens = Number(process.env.TOTALTOKENCOST);

        const token = ((baseCostMap[imageSize] * profitMargin) / totalCostPerMillionTokens) * 1000000


        // return Math.ceil(baseCostMap[imageSize] * profitMargin);
        return Math.floor(token);
    }
}

