import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string, phoneNumber?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phoneNumber,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      access_token: this.jwtService.sign({ userId: user.id, email: user.email }),
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.accountLocked) {
      throw new UnauthorizedException('Account is locked due to too many failed login attempts. Please contact support.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Increment failed login attempts
      const failedAttempts = user.failedLoginAttempts + 1;
      const shouldLock = failedAttempts >= 5;

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
          accountLocked: shouldLock,
        },
      });

      if (shouldLock) {
        throw new UnauthorizedException('Account locked due to too many failed login attempts.');
      }

      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lastLoginAt: new Date(),
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      access_token: this.jwtService.sign({ userId: user.id, email: user.email }),
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
