import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { SpeechTone } from "src/helper/types/index.type";

export class CreateTextToSpeechDto {
    @ApiProperty({
        enum: SpeechTone,  // Specifies the enum type
        enumName: 'SpeechTone',  // Optional: can help with clearer UI representation
        description: 'The tone of the speech'  // Optional description
    })
    @IsEnum(SpeechTone)
    tone: SpeechTone;

    @ApiProperty()
    @IsString()
    text: string
}
