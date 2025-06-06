import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { userTokenEntity } from 'src/model/userToken.entity';
import { Repository } from 'typeorm';
import { createTokenDto } from './dto/create-token.entity';
import { Calculate } from 'src/helper/utils/getTotalCost';
import { PricingEntity } from 'src/model/pricing.entity';


@Injectable()
export class UsertokenService {
    constructor(
        @InjectRepository(PricingEntity)
        private pricingRepository: Repository<PricingEntity>,

        @InjectRepository(userTokenEntity)
        private userTokensRepo: Repository<userTokenEntity>,
        private readonly configService: ConfigService
    ) { }

    async addTokens(userId: string, amount: number) {
        const pricing = await this.pricingRepository.find();
        const exchangeRate = +pricing[0].exchangeRate
        const totalCostPerMillionTokens = +pricing[0].totalTokenCost;

        // const exchangeRate = Number(this.configService.get<string>('EXCHANGE_RATE'));
        // const totalCostPerMillionTokens = Number(this.configService.get<string>('TOTALTOKENCOST')); // API cost + 30% profit
        const tokensToAdd = Calculate.calculateTokens(amount, exchangeRate, totalCostPerMillionTokens);

        let userTokens = await this.userTokensRepo.findOne({ where: { user: { id: userId } } });

        if (!userTokens) {
            userTokens = this.userTokensRepo.create({ user: { id: userId }, totalTokens: tokensToAdd });
            userTokens.remainingTokens = tokensToAdd;
        } else {
            userTokens.totalTokens += tokensToAdd;
            userTokens.remainingTokens = userTokens.totalTokens - userTokens.usedTokens;
        }

        await this.userTokensRepo.save(userTokens);
        return {
            message: "Tokens added successfully",
            tokensAdded: tokensToAdd,
        };
    }

    // Deduct tokens when the user uses a service
    async deductTokens(userId: string, usedToken: number) {
        const userTokens = await this.userTokensRepo.findOne({ where: { user: { id: userId } } });
        console.log(userTokens)

        // Check if userTokens exists and has enough remaining tokens
        if (!userTokens) {
            throw new BadRequestException("User not found.");
        }

        if (userTokens.remainingTokens < usedToken) {
            throw new BadRequestException("Insufficient tokens. Please recharge.");
        }

        // Update user's token usage 
        userTokens.usedTokens += usedToken;
        userTokens.remainingTokens -= usedToken;

        // If remaining tokens are 0, set totalTokens to 0 as well
        if (userTokens.remainingTokens === 0) {
            userTokens.totalTokens = 0;
        }

        // Save the updated user tokens to the database
        await this.userTokensRepo.save(userTokens);

        // Return the remaining tokens
        return {
            remainingToken: userTokens.remainingTokens,
            usedToken: usedToken
        }
    }

    // Get remaining tokens for a user
    async getUserTokens(userId: string) {
        return await this.userTokensRepo.findOne({ where: { user: { id: userId } } });
    }

    async getPricePerToken() {
        const pricing = await this.pricingRepository.find();

        if (!pricing || pricing.length === 0) {
            throw new Error("No pricing data found.");
        }

        const exchangeRate = +pricing[0].exchangeRate; // e.g., USD to local currency
        const totalCostPerMillionTokens = +pricing[0].totalTokenCost; // Cost in USD for 1M tokens

        // Convert total cost to local currency and then find per-token cost
        const oneTokenCost = (exchangeRate * totalCostPerMillionTokens) / 1_000_000;

        return oneTokenCost;
    }

}
