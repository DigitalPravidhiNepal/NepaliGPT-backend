import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSpeechToTextDto {

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    audio: string;

    @ApiProperty()
    @IsString()
    description: string;

}
