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

export class updateTitle {
    @IsString()
    @ApiProperty()
    title: string;
}

export class searchChat {
    @IsString()
    @ApiProperty()
    query: string;
}
export class PhotoUploadDto {
    @IsString()
    @ApiProperty()
    photo: string;
}