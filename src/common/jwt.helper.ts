import { JwtService } from '@nestjs/jwt';
import { JWT_CONFIG } from './jwt.config';

const jwtService = new JwtService({
  secret: JWT_CONFIG.secret,
  signOptions: { expiresIn: JWT_CONFIG.expiresIn as any },
});

export const generateAuthToken = (userId: number, userEmail: string): string => {
  const payload = { sub: userId, userEmail };
  return jwtService.sign(payload);
};