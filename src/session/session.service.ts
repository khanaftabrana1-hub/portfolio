import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}

  async createSession(
    userId: number,
    userEmail: string,
    token: string,
    expiresAt: Date,
  ) {
    const newSession = this.sessionRepo.create({
      userId,
      userEmail,
      token,
      expiresAt,
      loggedOutAt: null,
    });
    return await this.sessionRepo.save(newSession);
  }

  async logout(sessionId: string) {
    if (!sessionId) {
      throw new HttpException('sessionId is required', HttpStatus.BAD_REQUEST);
    }

    const session = await this.sessionRepo.findOne({
      where: { sessionId },
    });

    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }

    if (session.loggedOutAt) {
      throw new HttpException(
        'User already logged out',
        HttpStatus.BAD_REQUEST,
      );
    }

    session.loggedOutAt = new Date();
    return await this.sessionRepo.save(session);
  }
}