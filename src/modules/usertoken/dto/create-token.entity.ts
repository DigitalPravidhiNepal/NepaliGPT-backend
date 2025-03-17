import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDecimal, IsNumber, IsOptional, IsString } from "class-validator";

export class createTokenDto {
    @ApiProperty()
    @IsNumber()
    amount: number;
}

export class UpdatePriceDto {

    @IsString() // Needed because IsDecimal expects a string input
    @IsDecimal()
    @ApiPropertyOptional()
    @IsOptional()
    exchangeRate: string;  // Example: "132.50" for 1 USD = 132.50 NPR

    @IsString()
    @IsDecimal()
    @ApiPropertyOptional()
    @IsOptional()
    totalTokenCost: string;  // Example: "0.0005" for per 1M tokens


}