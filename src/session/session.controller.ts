import { Controller, Post, Body } from '@nestjs/common';
import { SessionsService } from './session.service'; 

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('logout')
  async logout(@Body('sessionId') sessionId: string) {
    const session = await this.sessionsService.logout(sessionId);
    return {
      message: 'Logout successful',
      sessionId: session.sessionId,
      loggedOutAt: session.loggedOutAt,
    };
  }
}