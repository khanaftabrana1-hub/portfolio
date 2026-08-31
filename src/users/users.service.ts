import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  // 1. REGISTER USER
  async registerUser(userData: CreateUserDto) {
    if (!userData?.passwordHash || userData.passwordHash.length !== 6) {
      throw new HttpException(`Password must be at least 6 characters`, HttpStatus.BAD_REQUEST)

    }

    const userExist = await this.usersRepo.findOne({
      where: { userEmail: userData.userEmail },
    });

    if (userExist) {
      throw new HttpException(`userEmail already exists. ${userData.userEmail}`, HttpStatus.CONFLICT)
    }


    const passwordHash = await bcrypt.hash(userData.passwordHash, 10);
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(generatedOtp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const savedUser = await this.usersRepo.save({
      ...userData,
      passwordHash,
      otp: otpHash,
      otpExpiresAt,
      varifyEmail: false,
    });


    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: userData.userEmail,
        subject: `Registration OTP Verification - ${Date.now()}`,
        html: getOtpEmailTemplate(generatedOtp),
      });
    } catch (error: any) {
      console.error('[Resend Email Error]:', error?.message || error);
    }


    throw new HttpException(`User registered successfully. OTP sent to `, HttpStatus.CREATED)
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { userEmail, otp } = verifyOtpDto;

    const user = await this.usersRepo.findOne({
      where: { userEmail },
    });

    if (!user || !user.otp || !user.otpExpiresAt) {
      throw new HttpException(`user otp is invalid `, HttpStatus.BAD_REQUEST)
    }

    if (new Date() > user.otpExpiresAt) {
      throw new HttpException(
        'OTP has expired',
        HttpStatus.BAD_REQUEST
      );
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid) {
      throw new HttpException(`Invalid OTP `, HttpStatus.BAD_REQUEST)
    }

    await this.usersRepo.update(user.userId, {
      otp: null,
      otpExpiresAt: null,
      varifyEmail: true,
    });

    throw new HttpException(`Otp has been varified `, HttpStatus.OK)
  }
  async login(loginData: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { userEmail: loginData.userEmail },
    });

    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND
      );
    }

    if (!user.varifyEmail) {
      throw new HttpException(
        'Email is not verified . please verify otp first',
        HttpStatus.BAD_REQUEST
      );
    }

    const isValidPassword = await bcrypt.compare(loginData.passwordHash, user.passwordHash);

    if (!isValidPassword) {
      throw new HttpException(
        'Invalid password',
        HttpStatus.BAD_REQUEST
      );
    }

    return user
  }
}