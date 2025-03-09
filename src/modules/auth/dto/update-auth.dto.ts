import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateAuthDto {


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    country: string;
}
