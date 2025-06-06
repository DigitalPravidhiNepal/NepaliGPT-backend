import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreatePaymentDto {
    @ApiProperty()
    @IsNumber()
    amount: number;
}