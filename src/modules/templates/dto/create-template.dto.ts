import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  AccessType,
  category,
  ContentTone,
  Creativity,
  inputType,
  Language,
} from 'src/helper/types/index.type';

export class FieldDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsEnum(inputType)
  @ApiProperty({ enum: inputType })
  inputType: inputType;

  @IsString()
  @ApiProperty()
  label: string;

  @IsString()
  @ApiProperty()
  placeholder: string;
}

export class CreateTemplateDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsEnum(AccessType)
  @ApiProperty()
  pricing: AccessType;

  @ApiProperty({ example: ['test'] })
  @IsArray()
  // @ValidateNested({ each: true })
  categoryIds: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  @ApiProperty({ type: [FieldDto] })
  fields: FieldDto[];

  @IsString()
  @ApiProperty()
  promptTemplate: string;
}
export class generateDto {
  @IsObject()
  @ApiProperty()
  userInputs: Record<string, string>; // User-provided values for dynamic fields

  @IsEnum(Creativity)
  @ApiProperty({ enum: Creativity })
  creativity: Creativity;

  @IsNumber()
  @ApiProperty()
  maxToken: number;

  @IsEnum(Language)
  @ApiProperty({ enum: Language })
  language: Language;

  @IsEnum(ContentTone)
  @ApiProperty({ enum: ContentTone })
  tone: ContentTone;
}

class InputDataItem {
  @ApiProperty({ example: 'title' })
  @IsString()
  key: string;

  @ApiProperty({ example: 'How AI is Changing the World' })
  @IsNotEmpty()
  value: any; // Can be string, number, etc.
}

export class CreateSavedTemplateContentDto {
  @ApiProperty({
    example: 'This is the final AI-generated content based on the user inputs.',
    description: 'The generated output content.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Dynamic user inputs as key-value pairs.',
    example: [
      { key: 'title', value: 'How AI is Changing the World' },
      {
        key: 'summary',
        value:
          'A deep dive into the impact of artificial intelligence on society.',
      },
      { key: 'author', value: 'John Doe' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InputDataItem)
  inputData: InputDataItem[];
}

export class CreateTemplateCategoryDto {
  @IsString()
  @ApiProperty()
  name: string;
}
