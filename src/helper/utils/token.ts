import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { JwtPayload, roleType, VerifyPayload } from "../types/index.type";
import { ConfigService } from "@nestjs/config";
require('dotenv').config();

@Injectable()
export class Token {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    async generateRefreshToken(jwtPayload: JwtPayload) {
        const expirationTimeInSeconds = '30d';
        const token = await this.jwtService.signAsync(jwtPayload, {
            secret: process.env.RT_SECRET,
            expiresIn: expirationTimeInSeconds,
        });
        return token;
    }
    async generateAcessToken(jwtPayload: JwtPayload) {
        const expirationTimeInSeconds = '1d';
        const token = await this.jwtService.signAsync(jwtPayload, {
            secret: process.env.AT_SECRET,
            expiresIn: expirationTimeInSeconds,
        });
        return token;
    }
    async generateUtilToken(jwtPayload: JwtPayload) {
        const expirationTimeInSeconds = '10m';
        const token = await this.jwtService.signAsync(jwtPayload, {
            secret: this.config.get<string>('UTIL_SECRET'),
            expiresIn: expirationTimeInSeconds,
        });
        return token;

    }

    async generateVerifyToken(jwtPayload: VerifyPayload) {
        const expirationTimeInSeconds = '10m';
        const token = await this.jwtService.signAsync(jwtPayload, {
            secret: process.env.UTIL_SECRET,
            expiresIn: expirationTimeInSeconds,
        });
        return token;

    }
}