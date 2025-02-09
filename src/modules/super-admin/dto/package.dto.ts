import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { AccessType } from "src/helper/types/index.type";

export class CreatePackageDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    codeGenerationLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    imageGenerationLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    speechToTextLimit?: number;

    @IsNumber()
    @ApiProperty()
    speechDurationLimit: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    textToSpeechLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    textCharacterLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    templatePromptLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    supportRequestLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    maxTokenLimit?: number;

    @IsEnum(AccessType)
    @ApiProperty({ enum: AccessType })
    chatBotAccess: AccessType;

    @IsEnum(AccessType)
    @ApiProperty({ enum: AccessType })
    templateAccess: AccessType;

    @IsNumber()
    @ApiProperty()
    monthly_price: number;

    @IsNumber()
    @ApiProperty()
    yearly_price: number;
}

export class UpdatePackageDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    name?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    codeGenerationLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    imageGenerationLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    speechToTextLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    speechDurationLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    textToSpeechLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    textCharacterLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    templatePromptLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    supportRequestLimit?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    maxTokenLimit?: number;

    @IsEnum(AccessType)
    @IsOptional()
    @ApiProperty({ required: false, enum: AccessType })
    chatBotAccess?: AccessType;

    @IsEnum(AccessType)
    @IsOptional()
    @ApiProperty({ required: false, enum: AccessType })
    templateAccess?: AccessType;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    monthly_price?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    yearly_price?: number;
}
