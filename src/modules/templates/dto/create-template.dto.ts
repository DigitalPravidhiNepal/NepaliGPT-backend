import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { AccessType } from "src/helper/types/index.type";


export class CreateTemplateDto {

    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    description: string;

    @IsEnum(AccessType)
    @ApiProperty()
    pricing: AccessType;

    @IsString()
    @ApiProperty()
    category: string; // e.g., 'Blog', 'Text', 'Social'

    @IsString()
    @ApiProperty()
    promptTemplate: string;

}
export class generateDto {
    @IsString()
    @ApiProperty()
    creativity: string;

    @IsString()
    @ApiProperty()
    tone: string;

    @IsNumber()
    @ApiProperty()
    maxToken: number

    @IsString()
    @ApiProperty()
    inputData: string;

    @IsString()
    @ApiProperty()
    language: string;
}

