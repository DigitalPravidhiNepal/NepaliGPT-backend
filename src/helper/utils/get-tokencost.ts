import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PricingEntity } from "src/model/pricing.entity";
import { Repository } from "typeorm";

@Injectable()
export class CalculateUsedToken {
    constructor(
        @InjectRepository(PricingEntity)
        private pricingRepository: Repository<PricingEntity>,
    ) { }
    async getTokenCost(imageSize: string): Promise<number> {
        const baseCostMap = {
            "1024x1024": 0.08, // 1:1
            "1024x1792": 0.12, // Portrait
            "1792x1024": 0.12  // Landscape
        };

        const baseCost = baseCostMap[imageSize];
        if (!baseCost) return 0;

        const profitMargin = 0.20;
        // const costPerMillionTokens = Number(process.env.TOTALTOKENCOST);
        const pricing = await this.pricingRepository.find()
        const costPerMillionTokens = +pricing[0].totalTokenCost;

        const profitAddedCost = baseCost + (baseCost * profitMargin);
        const tokenCost = (profitAddedCost / costPerMillionTokens) * 1_000_000;

        return Math.floor(tokenCost);
    }
}
