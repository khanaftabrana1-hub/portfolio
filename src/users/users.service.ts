import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Resend } from 'resend';
import { APP_CONFIG } from '../common/config';
import { getOtpEmailTemplate } from '../common/otptemplate.js';

@Injectable()
export class UsersService {
  private resend: Resend;

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {
    this.resend = new Resend(APP_CONFIG.resendApiKey);
  }

  async registerUser(userData: CreateUserDto) {
    if (!userData?.passwordHash || userData.passwordHash.length !== 6) {
      return { status: 400, message: 'Password must be exactly 6 characters long' };
    }

    const userExist = await this.usersRepo.findOne({
      where: {
        userEmail: userData.userEmail,
      },
    });

    if (userExist) {
      return { status: 401, message: 'user email already register' };
    }

    const passwordHash = await bcrypt.hash(userData.passwordHash, 10);
    return await this.usersRepo.save({ ...userData, passwordHash });
  }

  async login(loginData: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: {
        userEmail: loginData.userEmail,
      },
    });

    if (!user) {
      return { status: 404, message: 'user not found' };
    }

    const isValidPassword = await bcrypt.compare(loginData.passwordHash, user.passwordHash);

    if (!isValidPassword) {
      return { status: 403, message: 'invalid user password' };
    }


    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(generatedOtp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.usersRepo.update(user.userId, {
      otp: otpHash,
      otpExpiresAt,
    });


    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'aftab26645@gmail.com',
      subject: 'Login OTP Verification',
      html: getOtpEmailTemplate(generatedOtp),
    });

    return {
      status: 200,
      message: 'Password verified. OTP has been sent to your email.',
    };
  }


  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { userEmail, otp } = verifyOtpDto;

    const user = await this.usersRepo.findOne({
      where: { userEmail },
    });

    if (!user || !user.otp || !user.otpExpiresAt) {
      return { status: 400, message: 'Invalid request or OTP not found' };
    }

    if (new Date() > user.otpExpiresAt) {
      return { status: 400, message: 'OTP has expired' };
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid) {
      return { status: 400, message: 'Invalid OTP code' };
    }


    await this.usersRepo.update(user.userId, {
      otp: null,
      otpExpiresAt: null,
    });

    return {
      status: 200,
      message: 'OTP verified successfully. Login complete!',
      data: {
        userId: user.userId,
        userEmail: user.userEmail,
      },
    };
  }
}