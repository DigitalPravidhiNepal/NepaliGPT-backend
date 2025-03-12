import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateChatDto {
    @ApiProperty()
    @IsString()
    prompt: string;
}

export class SessionId {
    @ApiPropertyOptional()
    @IsOptional()
    sessionId: string;
}