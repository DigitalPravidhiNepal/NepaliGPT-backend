import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    country: string;

}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    name: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    phone: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    country: string;
}


export class UpdateUserByAdminDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    name: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    phone: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    country: string;

    @IsOptional()
    @ApiProperty({ default: false })
    isActive: boolean;
}