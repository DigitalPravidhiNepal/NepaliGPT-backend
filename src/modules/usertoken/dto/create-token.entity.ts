import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class createTokenDto {
    @ApiProperty()
    @IsNumber()
    amount: number;
}