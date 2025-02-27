import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateSuperAdminDto {
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    @MinLength(8)
    password: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

}
export class CreateBotDto {

    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    role: string;

    @IsString()
    @ApiProperty()
    instructions: string;

    @ApiProperty({ required: false, type: 'string', format: 'binary' })
    @IsOptional()
    photo?: any;
}

export class UpdateBotDto {
    @IsString()
    @ApiProperty()
    @IsOptional()
    name: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    role: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    instructions: string;
}

export class UpdatePhotoDto {
    @ApiProperty({ required: false, type: 'string', format: 'binary' })
    @IsOptional()
    photo: any;
}
