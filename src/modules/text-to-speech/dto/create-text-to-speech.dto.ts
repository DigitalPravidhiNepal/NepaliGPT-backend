import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTextToSpeechDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    language: string

    @ApiProperty()
    @IsString()
    tone: string

    @ApiProperty()
    @IsString()
    description: string
}
