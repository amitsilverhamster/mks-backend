import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as session from 'express-session';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // Fetch user from the database
    const user = await this.prisma.users.findFirst({
      where: { email: email },
    });

    if (user) {
      // Compare the entered password with the stored hashed password
      try {
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (isPasswordValid) {
          return user;
        } else {
          console.error('Password comparison failed.');
        }
      } catch (error) {
        console.error('Error comparing passwords:', error);
      }
    } else {
      console.error('User not found.');
    }
    return null;
  }

  async login(authDto: AuthDto, req: any) {
    const { email, password } = authDto;
    const user = await this.validateUser(email, password);
    
    if (!user) {
      console.error('Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    // Store user information in the session
    req.session.user = user.id;
    req.session.user_name =user.name

    req.session.accessToken = accessToken


    return {
      // access_token: accessToken,
      // session: req.session,
      'login':true,
    };
  }
  async logout(req: any): Promise<{ logout: boolean }> {
    // Destroy the session
    req.session.destroy((err: any) => {
      if (err) {
        console.error('Error destroying session:', err);
        throw new UnauthorizedException('Could not log out.');
      }
    });

    return {
      logout: true,
    };
  }
}
