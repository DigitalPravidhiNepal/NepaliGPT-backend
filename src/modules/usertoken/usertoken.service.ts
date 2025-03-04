import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { userTokenEntity } from 'src/model/userToken.entity';
import { Repository } from 'typeorm';
import { createTokenDto } from './dto/create-token.entity';

@Injectable()
export class UsertokenService {
    constructor(
        @InjectRepository(userTokenEntity)
        private userTokensRepo: Repository<userTokenEntity>,
        private readonly configService: ConfigService) { }

    async addTokens(userId: string, CreateTokenDto: createTokenDto) {
        const { amount } = CreateTokenDto;
        const exchangeRate = Number(this.configService.get<string>('EXCHANGE_RATE'));  // Example: 1 USD = 132 NPR (Fetch dynamically)
        const totalCostPerMillionTokens = Number(this.configService.get<string>('TOTALTOKENCOST')); // API cost + 30% profit

        // Convert NPR to USD
        const amountPaidUSD = amount / exchangeRate;

        // Convert USD to tokens
        const tokensToAdd = Math.floor((amountPaidUSD / totalCostPerMillionTokens) * 1_000_000);

        let userTokens = await this.userTokensRepo.findOne({ where: { user: { id: userId } } });

        if (!userTokens) {
            userTokens = this.userTokensRepo.create({ user: { id: userId }, totalTokens: tokensToAdd });
            userTokens.remainingTokens = tokensToAdd;
        } else {
            userTokens.totalTokens += tokensToAdd;
            userTokens.usedTokens = 0;
            userTokens.remainingTokens = userTokens.totalTokens - userTokens.usedTokens;
        }

        await this.userTokensRepo.save(userTokens);
        return {
            message: "Tokens added successfully",
            tokensAdded: tokensToAdd,
        };
    }


    // Deduct tokens when user uses a service
    async deductTokens(userId: string) {
        const userTokens = await this.userTokensRepo.findOne({ where: { user: { id: userId } } });

        if (!userTokens || userTokens.remainingTokens < userTokens.usedTokens) {
            throw new Error("Insufficient tokens. Please recharge.");
        }
        userTokens.usedTokens++;
        userTokens.remainingTokens = userTokens.totalTokens - userTokens.usedTokens;
        await this.userTokensRepo.save(userTokens);
        return userTokens.remainingTokens;
    }

    // Get remaining tokens for a user
    async getUserTokens(userId: string) {
        return await this.userTokensRepo.findOne({ where: { user: { id: userId } } });
    }
}
