import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsEnum, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { AccessType, category, inputType } from 'src/helper/types/index.type';

export class UpdateFieldDto {

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'id for the field' })
    id: string;

    @IsEnum(inputType)
    @IsOptional()
    @ApiPropertyOptional({ enum: inputType, description: 'Type of input field (text, number, etc.)' })
    inputType: inputType;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Label for the field' })
    label: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Placeholder text for the field' })
    placeholder: string;
}

export class UpdateTemplateDto {

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Title of the template' })
    title: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Description of the template' })
    description: string;

    @IsEnum(AccessType)
    @IsOptional()
    @ApiPropertyOptional({ enum: AccessType, enumName: 'AccessType', description: 'Access level for the template' })
    pricing: AccessType;

    @IsOptional()
    @ApiPropertyOptional({ enum: category, enumName: 'Category', description: 'Category of the template' })
    @IsArray()
    categoryIds: category;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateFieldDto)
    @ApiPropertyOptional({ type: [UpdateFieldDto], description: 'List of fields associated with the template' })
    fields: UpdateFieldDto[];

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Prompt template for generating the template content' })
    promptTemplate: string;

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Whether the template is active or not' })
    isFeatured: boolean;
}
