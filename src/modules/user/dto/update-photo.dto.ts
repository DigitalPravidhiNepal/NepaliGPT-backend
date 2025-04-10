import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class PhotoUpdateDto {
    @ApiProperty({ required: false, type: 'string', format: 'binary' })
    @IsOptional()
    photo: any;
}

export class UpdatePasswordDto {

    @ApiProperty()
    @IsString()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    newPassword: string;


}