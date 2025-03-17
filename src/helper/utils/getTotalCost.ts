
export class Calculate {

    static calculateTokens(amount: number, exchangeRate: number, totalCostPerMillionTokens: number): number {
        // Convert NPR to USD
        const amountPaidUSD = amount / exchangeRate;

        // Convert USD to tokens
        return Math.floor((amountPaidUSD / totalCostPerMillionTokens) * 1_000_000);
    }
}
