import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, FileTypeValidator, ParseFilePipe, UploadedFile } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto, searchChat, SessionId, updateTitle } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { PhotoUpdateDto } from '../user/dto/update-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';


@Controller('chat')
@ApiTags('chat')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class ChatController {
  constructor(private readonly chatService: ChatService
  ) { }

  @Post()
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'generate chat' })
  create(@Body() createChatDto: CreateChatDto, @Req() req: any, @Query() sessionId?: SessionId) {
    const { sub } = req.user;
    return this.chatService.chat(createChatDto, sub, sessionId);
  }



  // Get chat sessions for a user
  @Get('sessions')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all sessions' })
  async getChatSessions(@Req() req: any) {
    const id = req.user.sub;
    return this.chatService.getChatSessions(id);
  }

  //Search Chat by query
  @SkipThrottle()
  @Get('search-chat')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'search chat' })
  searchChat(@Req() req: any, @Query('query') query: string) {
    const id = req.user.sub;
    return this.chatService.searchChat(id, query)
  }

  // Get chats by session ID
  @Get('session/:sessionId')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get chats by session id' })
  async getChatsBySession(@Param('sessionId') sessionId: string, @Req() req: any) {
    const id = req.user.sub;
    return this.chatService.getChatHistory(sessionId, id);
  }



  // Rename a chat session title
  @Patch('session/:sessionId')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'rename the chat session title' })
  async renameSession(
    @Param('sessionId') sessionId: string,
    @Body() Updatetitle: updateTitle
  ) {
    const { title } = Updatetitle;
    return this.chatService.renameSessionTitle(sessionId, title);
  }

  //delete Chat
  @Delete('delete-chat/:sessionId')
  @Roles(roleType.customer)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "delete chat" })
  remove(@Req() req: any, @Param('sessionId') sessionId: string) {
    const id = req.user.sub;
    return this.chatService.deleteChat(id, sessionId)
  }
}
