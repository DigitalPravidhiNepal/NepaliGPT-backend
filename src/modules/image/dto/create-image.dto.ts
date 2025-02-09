import { IsOptional, IsString, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateImageDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value || '')
    artStyle?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value || '')
    lightingStyle?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value || '')
    moodStyle?: string;

    @ApiProperty()
    @IsOptional()
    @IsIn(['256x256', '512x512', '1024x1024']) // Allowed image sizes
    @Transform(({ value }) => value || '1024x1024') // Default to '1024x1024' if not provided
    imageSize?: '1024x1024' | '1792x1024' | '1024x1792';

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(4) // OpenAI allows max 4 images per request
    @Transform(({ value }) => value || 1) // Default to 1 if not provided
    numberOfImages?: number;
}
