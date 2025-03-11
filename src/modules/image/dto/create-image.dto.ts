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

    @ApiProperty({ enum: ['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792'], default: '1024x1024' })
    @IsOptional()
    @IsIn(['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792']) // Allowed image sizes
    @Transform(({ value }) => value ?? '1024x1024') // Ensures undefined or null gets replaced
    imageSize: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024';

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value || '')
    negative_keywords?: string;


}
